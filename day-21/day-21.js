const fs = require('fs');

const process = () => {
    const content = fs.readFileSync('input.txt', 'utf8');
    const lines = content.split('\n');

    let field = lines.map(line => line.split(''));

    // get coordinates of starting point (S)
    let sPosition = getStartPosition(field);

    // run step
    for (let i = 0; i < 64; i++) {
        runStep(field, sPosition);
    }

    // part 1
    let count = countPlots(field);

    console.log('part 1:', count);

    // part 2
    let originalField = lines.map(line => line.split(''));
    let infinityField = originalField;

    // expanding the field, each iteration triples the size of the field
    // two iterations are enough for this problem
    for (let i = 0; i < 2; i++) {
        infinityField = expandField(infinityField);
    }

    // getting the starting position in the expanded field
    sPosition = getStartPosition(infinityField);

    // we have a polinomial function, that describes the number of plots 
    // according to the number of steps and the field size
    // the fiels is repeated in all directions, so the function is quadratic
    let polinomialValues = [];

    // to find the function, we need to find the values of the function for 3 different values
    // f(x) = y, where x is the size of the field / 2 (the step goes in all directions),
    // so the edge is reached in x * 2 steps
    // y is the number of plots
    // let's get the values for 3 different sizes of the field
    // first x = 65, where is the size of the original field
    // then triple, the size of the field, x = 65 + 131
    // and triple again, x = 65 + 131 + 131
    let firstValue = 65;
    let secondValue = 65 + 131;
    let thirdValue = 65 + 131 + 131;

    for (let i = 1; i <= thirdValue; i++) {
        runStep(infinityField, sPosition);

        // store the values for three steps
        if (i === firstValue || i === secondValue || i === thirdValue) {
            polinomialValues.push([i, countPlots(infinityField)]);
        }
    }

    // our goal is to find the value of the function for 26501365 steps
    let steps = 26501365;

    // get the values of x and y
    let xValues = polinomialValues.map(([x, y]) => x);
    let yValues = polinomialValues.map(([x, y]) => y);

    // find the value of the function for 26501365 steps using Lagrange's interpolation
    console.log('part 2:', lagrangeInterpolation(steps, xValues, yValues));
};

const getStartPosition = (field) => {
    let sPosition = [];
    field.forEach((line, y) => {
        const x = line.indexOf('S');
        if (x !== -1) {
            sPosition = [y, x];

            return sPosition;
        }
    });

    return sPosition;
};

const runStep = (field, startPosition) => {
    let positions = [];

    field.forEach((line, y) => {
        line.forEach((cell, x) => {
            if (cell === 'O') {
                positions.push([y, x]);
            }
        });
    });

    if (positions.length === 0) {
        positions = [startPosition];
    }

    positions.forEach(([y, x]) => {
        let [startY, startX] = startPosition;

        y === startY && x === startX ? field[y][x] = 'S' : field[y][x] = '.';

        const up = [y - 1, x];
        const down = [y + 1, x];
        const left = [y, x - 1];
        const right = [y, x + 1];

        move(field, up);
        move(field, down);
        move(field, left);
        move(field, right);
    });
};

const move = (field, position) => {
    const [y, x] = position;

    const validPosition = y >= 0 && y < field.length && x >= 0 && x < field[y].length && field[y][x] !== '#';

    if (!validPosition) {
        return;
    }

    field[y][x] = 'O';
}

const countPlots = (field) => {
    let count = 0;

    field.forEach((line) => {
        line.forEach((cell) => {
            if (cell === 'O') {
                count++;
            }
        });
    });

    return count;
};

const expandField = (field) => {
    const size = field.length;
    const expandedSize = size * 3;
    let infinityField = Array(expandedSize).fill().map(() => Array(expandedSize).fill('.'));

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            let currentCell = field[y][x];

            // center
            infinityField[y + size][x + size] = field[y][x];

            if (currentCell === 'S') {
                continue;
            }

            // up
            infinityField[y][x + size] = field[y][x];
            // down
            infinityField[y + size * 2][x + size] = field[y][x];
            // left
            infinityField[y + size][x] = field[y][x];
            // right
            infinityField[y + size][x + size * 2] = field[y][x];
            // up-left
            infinityField[y][x] = field[y][x];
            // up-right
            infinityField[y][x + size * 2] = field[y][x];
            // down-left
            infinityField[y + size * 2][x] = field[y][x];
            // down-right
            infinityField[y + size * 2][x + size * 2] = field[y][x];
        }
    }

    return infinityField;
};

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

process();