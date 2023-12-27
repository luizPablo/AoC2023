const fs = require('fs');

const process = () => {
    let cache = {};

    const moveRocks = (matrix, direction) => {
        let tempMatrix = [];

        if (direction === 'up') {
            for (let i = matrix[0].length - 1; i >= 0; i--) {
                const column = matrix.map(line => line[i]);

                tempMatrix.push(column);
            }
        }

        if (direction === 'down') {
            for (let i = 0; i < matrix.length; i++) {
                const column = matrix.map(line => line[i]);

                tempMatrix.push(column.reverse());
            }
        }

        if (direction === 'left') {
            tempMatrix = matrix;
        }

        if (direction === 'right') {
            tempMatrix = matrix.map(line => line.reverse());
        }

        tempMatrix.forEach((line) => {
            let dotCount = 0;

            for (let i = 0; i < line.length; i++) {
                // check how many consecutive dots before the "0"
                if (line[i] === '.') {
                    dotCount++;
                    continue;
                }

                // if we found "#", reset dotCount
                // the next "0" can be moved until this point
                if (line[i] === '#') {
                    dotCount = 0;
                }

                // if we found "0" and there are dots before it, move it
                if (line[i] === 'O' && dotCount > 0) {
                    line[i] = '.';
                    line[i - dotCount] = 'O';
                }
            }
        });

        // undo rotation
        if (direction === 'up') {
            tempMatrix = tempMatrix[0].map((element, index) => tempMatrix.map(row => row[index]).reverse())
        }

        if (direction === 'down') {
            tempMatrix = tempMatrix[0].map((element, index) => tempMatrix.map(row => row[row.length - 1 - index]));
        }

        if (direction === 'right') {
            tempMatrix = tempMatrix.map(line => line.reverse());
        }

        let sum = 0;

        // calculate sum
        tempMatrix.forEach((line, lineIndex) => {
            line.forEach((element) => {
                if (element === 'O') {
                    sum += line.length - lineIndex;
                }
            });
        });

        return {
            result: tempMatrix,
            sum,
        };
    };

    const fileContent = fs.readFileSync(__dirname + '/min-input.txt', 'utf-8');
    const lines = fileContent.split('\n');

    // generating the matrix
    const matrix = lines.map(line => line.split(''));

    // part 1
    const { sum, result: res } = moveRocks(matrix, 'up');

    res.forEach((line, index) => console.log(line.join(' '), ' -> ', (line.length - index)));
    console.log('\nSum of part 1:', sum, '\n\n');

    // part 2
    // 1000 and 1000000000 will have the same result
    // we just to need to find the spin cycle size
    let cycles = 1000;
    let result;
    let aux;

    let spinCycleSize = 0;

    // find the spin cycle size
    for (let i = 0; i < cycles; i++) {
        if (i === 0) {
            result = matrix;
            aux = matrix;
        }

        if (cache[JSON.stringify(result)]) {
            // we found the spin cycle
            let firstIndex = Object.keys(cache).indexOf(JSON.stringify(result));
            let lastIndex = i;

            /**
             * 
             * This is a crazy math formula that works
             * THE EXAMPLE BELOW IS FOR MINIMAL INPUT
             * 
             * firstIndex = 3
             * lastIndex = 10
             * 
             * 1000 - 3 = 997 (cycles that will run after the first index)
             * 997 / (10 - 3) = 142.4285 (count of spin cycles)) 
             * 142 * (10 - 3) = 994 (cycles that will run until the last spin cycle)
             * 10 + (1000 - 994 - 3) = 13 (equivalent cycle to 1000th cycle)
             * 
             */
            let cycleRuns = Math.floor((cycles - firstIndex) / (lastIndex - firstIndex)) * (lastIndex - firstIndex);

            spinCycleSize = lastIndex + (cycles - cycleRuns - firstIndex);

            break;
        }

        let moved;

        //move up
        moved = moveRocks(result, 'up');
        result = moved.result;

        //move left
        moved = moveRocks(result, 'left');
        result = moved.result;

        //move down
        moved = moveRocks(result, 'down');
        result = moved.result;

        //move right
        moved = moveRocks(result, 'right');
        result = moved.result;

        cache[JSON.stringify(aux)] = moved.sum;

        aux = result;
    }

    // calculate the sum of the spin cycle
    let spinCycleSum = 0;
    let spinCycleMatrix = matrix;

    for (let i = 0; i < spinCycleSize; i += 1) {
        for (movement of ['up', 'left', 'down', 'right']) {

            let moved = moveRocks(spinCycleMatrix, movement);
            spinCycleMatrix = moved.result;
            spinCycleSum = moved.sum;
        }

        if (i === spinCycleSize - 1) {
            spinCycleMatrix.forEach((line, index) => console.log(line.join(' '), ' -> ', (line.length - index)));
        }
    }

    console.log('\nSum of part 2:', spinCycleSum);
    console.group('Equivalente cycle:', spinCycleSize);
};

process();