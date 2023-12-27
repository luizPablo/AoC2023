const fs = require('fs');

function process() {
    const [workflows, parts] = parseInput('input.txt');

    // part 1
    const acceptedParts = parts.filter(p => acceptPart(p, workflows));
    const acceptedPartsSum = acceptedParts.reduce((acc, p) => {
        return acc + Object.values(p).reduce((acc, paramValue) => acc + paramValue, 0);
    }, 0);

    console.log("part 1:", acceptedPartsSum);

    // part 2
    const initState = ['in', { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] }];
    const acceptedFlows = Array.from(getAcceptedFlows(workflows, initState));
    const acceptedFlowsPossibilities = countPossibilities(acceptedFlows);

    console.log("Part 2:", acceptedFlowsPossibilities);
}

const acceptPart = (part, workflows) => {
    let workflow = workflows['in'];

    while (true) {
        for (const [condition, target] of workflow.rules) {
            let result;

            if (!condition) {
                // if there is no condition, an end state is reached
                result = target;
            } else {
                const { key, operation, value } = condition;
                // checking if the part meets the condition
                if ((operation === '<' && part[key] < value) || (operation === '>' && part[key] > value)) {
                    result = target;
                }
            }

            if (result === 'A') {
                // the part was accepted
                return true;
            } else if (result === 'R') {
                // the part was rejected
                return false;
            } else if (result) {
                // the part must go to another state
                workflow = workflows[result];
                break;
            } else {
                // the part must go to the next rule
                continue
            }
        }
    }
}

const updateRanges = (ranges, condition) => {
    const { key, operation, value } = condition;
    let [init, end] = ranges[key] || [1, 4000];

    if (operation === '>') {
        if (value >= end) {
            return null;
        }

        init = value + 1;
    } else {
        if (value <= init) {
            return null;
        }

        end = value - 1;
    }

    return { ...ranges, [key]: [init, end] };
}

const reverseCondition = (condition) => {
    const { key, operation, value } = condition;
    return operation === '<' ? { key, operation: '>', value: value - 1 } : { key, operation: '<', value: value + 1 };
}

function* getAcceptedFlows(workflows, state) {
    let [name, ranges] = state;

    // iterate over the rules of the current workflow
    for (const [condition, target] of workflows[name].rules) {
        let rangeMet;

        // keep the same ranges if there is no condition in the rule
        if (condition === null) {
            rangeMet = ranges;
        } else {
            // get the range that meets the condition
            rangeMet = updateRanges(ranges, condition);

            // in the next iteration, the range must be updated to meet the opposite condition
            ranges = updateRanges(ranges, reverseCondition(condition));
        }

        if (rangeMet !== null) {
            if (target === 'A') {
                yield rangeMet;
            } else if (target !== 'R') {
                yield* getAcceptedFlows(workflows, [target, rangeMet]);
            }
        }
    }
}

const countPossibilities = (flows) => {
    let total = 0;

    for (const flow of flows) {
        total += Object.values(flow).reduce((acc, [init, end]) => acc * (end - init + 1), 1);
    }

    return total;
}

const parseInput = (input) => {
    const content = fs.readFileSync(input, 'utf8');
    const lines = content.split('\n').filter(Boolean);
    const workflows = {};
    const parts = [];

    for (const line of lines) {
        // if includes ':' then it's a workflow
        // else it's a part
        if (line.includes(':')) {
            const workflow = { rules: [] };
            const [name, rulesStr] = line.split('{');
            workflow.name = name;
            const rules = rulesStr.slice(0, -1).split(',');

            for (const rule of rules) {
                if (rule.includes(':')) {
                    const [condition, target] = rule.split(':');
                    const [key, operation, value] = condition.split(/([<>])/);

                    workflow.rules.push([{ key, operation, value: Number(value) }, target]);
                } else {
                    workflow.rules.push([null, rule]);
                }
            }

            workflows[workflow.name] = workflow;

        } else {
            const part = {};
            const words = line.slice(1, -1).split(',');

            for (const word of words) {
                const [key, value] = word.split('=');
                part[key] = Number(value);
            }

            parts.push(part);
        }
    }

    return [workflows, parts];
}

process();