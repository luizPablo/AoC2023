const fs = require('fs');

const process = () => {
    const fileContent = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
    const lines = fileContent.split('\n\n');

    const instructions = lines[0].trim().split('');
    const map = lines[1].trim().split('\n').map((line) => {
        let [position, destinations] = line.split(' = ');
        destinations = destinations.replace(/\(|\)/g, '').split(', ');

        const destinationsObject = destinations.reduce((acc, destination, index) => {
            if (index === 0) {
                acc['L'] = destination;
            } else {
                acc['R'] = destination;
            }

            return acc;
        }, {});

        return {
            position,
            destinations: destinationsObject,
        };
    });

    const part1 = (start, end) => {
        let currentPosition = map.find((position) => position.position === start);
        let countSteps = 0;

        while (currentPosition.position !== end) {
            for (let instruction of instructions) {
                const nextPosition = map.find((position) => position.position === currentPosition.destinations[instruction]);

                if (nextPosition) {
                    currentPosition = nextPosition;
                    countSteps++;
                } else {
                    console.log('No next position found');
                    process.exit(1);
                }
            }
        }

        console.log('Steps: ', countSteps);
        return countSteps;
    };

    const getSteps = (position) => {
        let currentPosition = position;
        let steps = 0;

        while (!currentPosition.position.endsWith('Z')) {
            for (let instruction of instructions) {
                const nextPosition = map.find((position) => position.position === currentPosition.destinations[instruction]);

                if (nextPosition) {
                    currentPosition = nextPosition;
                    steps++;
                } else {
                    console.log('No next position found');
                    process.exit(1);
                }
            }
        }

        return steps;
    };

    const greatestCommonDivisor = (a, b) => {
        if (b === 0) {
            return a;
        } else {
            return greatestCommonDivisor(b, a % b);
        }
    };

    const leastCommonMultiple = (a, b) => {
        return (a * b) / greatestCommonDivisor(a, b);
    };

    const leastCommonMultipleSteps = (steps) => {
        let multiple = 1;

        for (let i = 0; i < steps.length; i++) {
            multiple = leastCommonMultiple(multiple, steps[i]);
        }

        return multiple;
    };

    const part2 = () => {
        //find all positions with A at the end
        let currentPositions = map.filter((position) => position.position.endsWith('A'));

        let steps = [];

        currentPositions.forEach((position) => {
            const result = getSteps(position);
            steps.push(result);
        });

        //find least common multiple of all steps
        const result = leastCommonMultipleSteps(steps);

        console.log('Ghost steps: ', result);
    };

    part1("AAA", "ZZZ");
    part2();
};

process();