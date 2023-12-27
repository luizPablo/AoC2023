
const fs = require('fs');

const modules = new Map();
let execOrder = [];


const process = () => {
    const content = fs.readFileSync('input.txt', 'utf8');
    const lines = content.split('\n');

    buildModules(lines);

    // part 1
    // pulse counters
    let countPresses = 0;
    let lowCount = 0;
    let highCount = 0;

    const pulseButton = new PulseButton();

    do {
        countPresses++;
        pulseButton.press();

        while (execOrder.length > 0) {
            const [name, signal, outputs] = execOrder.shift();

            signal ? highCount += outputs : lowCount += outputs;

            const module = modules.get(name);

            module.component.execute();
        }

    } while (countPresses < 1000);

    console.log('part 1:', (lowCount + countPresses) * highCount);

    // part 2
    // rx has only a conjunction as input (dt)
    // dt has four conjunctions as input (vk, ks, pm, dl)
    // vk has another conjunction as input (xd)
    // ks has another conjunction as input (vr)
    // pm has another conjunction as input (pf)
    // dl has another conjunction as input (ts)
    // each broadcaster output is connected to one of the conjunctions last mentioned conjunctions
    // each conjunctions is the end of a "subcircuit" inside the main flow
    // we need to find when all of the four subcircuits are off at the same time, that way a low signal will be sent to rx

    // create maps containing all flipflops
    const allFlipFlops = new Map()

    modules.forEach((module) => {
        if (module.component instanceof FlipFlop) {
            allFlipFlops.set(module.component.name, false);
        }
    });

    const starters = modules.get('broadcaster').component.out.map(module => module.name);
    countPresses = Array(starters.length).fill(0);

    // reset queues
    execOrder = [];

    // reset modules
    buildModules(lines);

    for (let i = 0; i < starters.length; i++) {
        const starter = starters[i];

        while (true) {
            countPresses[i] += 1;
            pulseButton.press(starter);

            while (execOrder.length > 0) {
                const [name, signal] = execOrder.shift();

                const module = modules.get(name);

                module.component.execute();

                if (module.component instanceof FlipFlop) {
                    allFlipFlops.set(name, signal);
                }
            }

            if (Array.from(allFlipFlops.values()).every(value => !value)) {
                break;
            }
        }
    }

    console.log('part 2:', leastCommonMultiple(countPresses));
};

const greatestCommonDivisor = (a, b) => {
    if (b === 0) {
        return a;
    } else {
        return greatestCommonDivisor(b, a % b);
    }
};

const leastCommonMultiple = (array) => {
    let multiple = 1;

    for (let i = 0; i < array.length; i++) {
        multiple = (multiple * array[i]) / greatestCommonDivisor(multiple, array[i]);
    }

    return multiple;
};

class PulseButton {
    constructor() { };

    press(starter = null) {
        if (starter) {
            const module = modules.get(starter);

            if (module.component.memory) {
                module.component.pulse(this.signal, 'broadcaster');
            } else {
                module.component.pulse(this.signal);
            }

            return;
        }

        const module = modules.get('broadcaster');
        execOrder.push(['broadcaster', false, module.component.out.length]);
    }
}

class Broadcaster {
    constructor() {
        this.out = [];
        this.signal = false;
    }

    connectOutput(module) {
        this.out.push(module);
    }

    execute() {
        for (const module of this.out) {
            // console.log('broadcasting', '-low', module.name)
            // check if is a conjunction, send signal and name to update memory
            // otherwise, send only signal
            if (module.memory) {
                module.pulse(this.signal, 'broadcaster');
            } else {
                module.pulse(this.signal);
            }
        }
    }
}

class FlipFlop {
    constructor(name) {
        this.name = name;
        this.signal = false;
        this.out = [];
        this.queue = [];
    }

    connectOutput(module) {
        this.out.push(module);
    }

    pulse(pulse) {
        if (!pulse) {
            this.signal = !this.signal;

            this.queue.push({
                pulse: this.signal,
            });

            execOrder.push([this.name, this.signal, this.out.length]);
        }
    }

    execute() {
        while (this.queue.length > 0) {
            const { pulse } = this.queue.shift();

            for (const destination of this.out) {
                // console.log(this.name, 'flipflop', pulse ? '-high' : '-low', destination.name);
                // check if is a conjunction, send signal and name
                // otherwise, send only signal
                if (destination instanceof Conjuction) {
                    destination.pulse(pulse, this.name);
                } else {
                    destination.pulse(pulse);
                }
            }

        }
    }
}

class Conjuction {
    constructor(name) {
        this.name = name;
        this.memory = {};
        this.out = [];
        this.signal = true;
        this.queue = [];
    }

    connectOutput(module) {
        this.out.push(module);
    }

    pulse(pulse, module) {
        // update memory
        this.memory[module] = pulse;

        this.signal = !Object.entries(this.memory).every(([key, value]) => value);

        this.queue.push({
            pulse: this.signal,
        });

        execOrder.push([this.name, this.signal, this.out.length]);
    }

    execute() {
        while (this.queue.length > 0) {
            const { pulse } = this.queue.shift();

            for (const destination of this.out) {
                // console.log(this.name, 'conjunction', pulse ? '-high' : '-low', destination.name);
                // check if is a conjunction, send signal and name
                // otherwise, send only signal
                if (destination instanceof Conjuction) {
                    destination.pulse(pulse, this.name);
                } else {
                    destination.pulse(pulse);
                }
            }
        }
    }

}

const buildModules = (lines) => {
    for (const line of lines) {
        const [left, right] = line.split(' -> ');

        let type;
        let name;

        if (left === 'broadcaster') {
            type = 'broadcaster';
            name = 'broadcaster';
        } else {
            type = left.slice(0, 1);
            name = left.slice(1);
        }

        const outputs = right.split(', ');

        switch (type) {
            case 'broadcaster':
                const broadcaster = new Broadcaster('broadcaster');
                modules.set('broadcaster', {
                    component: broadcaster,
                    outputs,
                });
                break;
            case '%':
                const flipFlop = new FlipFlop(name);
                modules.set(name, {
                    component: flipFlop,
                    outputs,
                });
                break;
            case '&':
                const conjunction = new Conjuction(name);
                modules.set(name, {
                    component: conjunction,
                    outputs,
                });
                break;
            default:
                throw new Error('Unknown module type');
        }
    }

    // make connections
    modules.forEach((module) => {
        for (const output of module.outputs) {
            const outputModule = modules.get(output);
            if (!outputModule) {
                module.component.connectOutput({
                    pulse: () => { },
                    execute: () => { },
                    name: output,
                });

                continue;
            }

            module.component.connectOutput(outputModule.component);
        }
    });

    // initialize conjunctions memory
    modules.forEach((module) => {
        if (module.component instanceof Conjuction) {
            let inputs = Array.from(modules.entries()).filter(([name, component]) => component.outputs.includes(module.component.name));

            inputs.forEach(([name]) => {
                module.component.memory[name] = false;
            });
        }
    });
};

process();