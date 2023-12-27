const fs = require('fs');

const process = () => {
    const fileContent = fs.readFileSync(__dirname + '/input.txt', 'utf-8');

    const lines = fileContent.split('\n');

    // part 1
    const inputs = lines.map(line => {
        const values = line.split(' ');

        return {
            direction: values[0],
            movements: parseInt(values[1]),
            color: values[2].replace('(', '').replace(')', '').replace('#', '')
        };
    });

    // part 2
    const hexInputs = inputs.map(input => {
        const hex = input.color.slice(0, -1);
        const hexDirection = input.color.slice(-1);

        const movements = parseInt(hex, 16);
        let direction;

        switch (hexDirection) {
            case '0':
                direction = 'R';
                break;
            case '1':
                direction = 'D';
                break;
            case '2':
                direction = 'L';
                break;
            case '3':
                direction = 'U';
                break;
        }

        return {
            direction,
            movements,
        };
    });

    // inputs for part 1
    const { edgeCornersSet, edgeSize } = getEdgePoints(inputs);

    const parsedPoints = Array.from(edgeCornersSet).map(point => {
        const values = point.split(',');

        return [parseInt(values[1]), parseInt(values[0])];
    });

    const totalArea = getArea(parsedPoints, edgeSize);
    console.log('part 1:', totalArea);

    // inputs for part 2
    const { edgeCornersSet: hexEdgeCornersSet, edgeSize: hexEdgeSize } = getEdgePoints(hexInputs);

    const hexParsedPoints = Array.from(hexEdgeCornersSet).map(point => {
        const values = point.split(',');

        return [parseInt(values[1]), parseInt(values[0])];
    });

    const hexTotalArea = getArea(hexParsedPoints, hexEdgeSize);
    console.log('part 2:', hexTotalArea);
};

const getEdgePoints = (inputs) => {
    const edgeCornersSet = new Set();
    let edgeSize = 0;

    let xPosition = 0;
    let yPosition = 0;

    let previousDirection = null;
    let currentDirection = inputs[0].direction;

    inputs.forEach(input => {
        currentDirection = input.direction;

        switch (input.direction) {
            case 'R':
                xPosition += input.movements;

                if (previousDirection !== 'R' && previousDirection !== 'L') {
                    edgeCornersSet.add(`${xPosition},${yPosition} `);

                    edgeSize += input.movements;
                }

                break;
            case 'D':
                yPosition += input.movements;

                if (previousDirection !== 'D' && previousDirection !== 'U') {
                    edgeCornersSet.add(`${xPosition},${yPosition}`);

                    edgeSize += input.movements;
                }

                break;
            case 'L':
                xPosition -= input.movements;

                if (previousDirection !== 'R' && previousDirection !== 'L') {
                    edgeCornersSet.add(`${xPosition},${yPosition}`);

                    edgeSize += input.movements;
                }

                break;
            case 'U':
                yPosition -= input.movements;

                if (previousDirection !== 'D' && previousDirection !== 'U') {
                    edgeCornersSet.add(`${xPosition},${yPosition}`);

                    edgeSize += input.movements;
                }

                break;
        }

        previousDirection = currentDirection;
    });

    return { edgeCornersSet, edgeSize };
};

// shoelace formula + pick's theorem
const getArea = (edgePoints, edgeSize) => {
    // shoelace formula
    let area = 0;

    for (let i = 0, j = edgePoints.length - 1; i < edgePoints.length; j = i++) {
        const xi = edgePoints[i][1];
        const yi = edgePoints[i][0];
        const xj = edgePoints[j][1];
        const yj = edgePoints[j][0];

        area += (xi * yj) - (yi * xj);
    }

    area = Math.abs(area / 2);

    /**
     * pick's theorem
     * 
     * i -> interior points
     * b -> boundary points
     *
     * area = i + (b / 2) - 1
     * 
     * we need to find i + b, so
     * 
     * i + (b / 2) = area + 1
     * 
     * (sum b/2 to both sides)
     * i + b = area + (b / 2) + 1 
     * 
     **/
    return area + (edgeSize / 2) + 1;
};

process();