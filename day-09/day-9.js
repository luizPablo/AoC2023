const fs = require('fs');

const process = () => {
    const fileContent = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
    const lines = fileContent.split('\n');

    const lagrangeInterpolation = (x, xValues, yValues) => {
        let result = 0;

        for (let i = 0; i < xValues.length; i++) {
            let term = yValues[i];

            for (let j = 0; j < xValues.length; j++) {
                if (j !== i) {
                    term = term * (x - xValues[j]) / (xValues[i] - xValues[j]);
                }
            }

            result += term;
        }

        return Math.round(result);
    };

    const processLine = (line) => {
        const sequence = line.match(/-?\d+/g).map((number) => parseInt(number));

        const xValues = Array.from({ length: sequence.length }, (e, i) => i);
        const yValues = sequence;

        const result = lagrangeInterpolation(sequence.length, xValues, yValues);
        const bakingResult = lagrangeInterpolation(-1, xValues, yValues);

        console.log('Result: ', result);
        console.log('Backing result: ', bakingResult);

        return {
            result,
            bakingResult,
        };
    };

    let termsSum = 0;
    let bakingTermsSum = 0;

    lines.forEach((line) => {
        const { result, bakingResult } = processLine(line);
        termsSum += result;
        bakingTermsSum += bakingResult;
    });

    console.log('Terms sum: ', termsSum);
    console.log('Baking terms sum: ', bakingTermsSum);
};

process();