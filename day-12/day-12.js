const fs = require('fs');

const process = () => {
    const fileContent = fs.readFileSync(__dirname + '/min-input.txt', 'utf-8');
    const lines = fileContent.split('\n');

    let cache = {};

    const possibilities = (springs, groups) => {
        let key = springs + groups.toString();

        if (cache[key]) {
            return cache[key]['counter'];
        }

        if (groups.length === 0) {
            if (!springs.includes('#')) {
                return 1;
            }

            return 0;
        }

        let validCombinations = 0;
        let limit = springs.length - (groups.slice(1).reduce((a, b) => a + b, 0)) + (groups.length - 1) - (groups[0]) + 1;

        for (let position = 0; position < limit; position++) {
            let possible = '.'.repeat(position) + '#'.repeat(groups[0]) + '.';

            let breakFlag = false;

            for (let i = 0; i < Math.min(springs.length, possible.length); i++) {
                if (springs[i] !== possible[i] && springs[i] !== '?') {
                    breakFlag = true;

                    break;
                }
            }

            if (!breakFlag) {
                validCombinations += possibilities(springs.slice(possible.length), groups.slice(1));
            }
        }

        cache[key] = {
            'counter': validCombinations
        };

        return validCombinations;
    }

    let sum = 0;
    let expandedSum = 0;

    lines.forEach((line) => {
        const [springs, numbersStr] = line.split(' ');

        const numbers = numbersStr.split(',').map((number) => parseInt(number));
        sum += possibilities(springs, numbers);

        const expandedSprings = Array(5).fill(springs).join('?');
        const expandedNumbers = Array(5).fill(numbersStr).join(',').split(',').map((number) => parseInt(number));
        expandedSum += possibilities(expandedSprings, expandedNumbers);
    });

    console.log('part 1:', sum);
    console.log('part 2:', expandedSum);

};

process();