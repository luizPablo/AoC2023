const fs = require('fs');

const process = () => {
    const fileContent = fs.readFileSync(__dirname + '/min-input.txt', 'utf-8');
    const lines = fileContent.split('\n');

    const field = lines.map(line => line.split(''));

    // part 1
    const energizedNodes = getEnergizedNodes(field, {
        current: [0, 0],
        direction: '>',
    });

    console.log('energizedNodes (part 1):', energizedNodes.length);

    // part 2
    // get all starting positions (edges of the field)
    const startingPositions = [];
    // we just need to get height because the field is a square
    const height = field.length;

    for (let i = 0; i < height; i++) {
        startingPositions.push({
            current: [i, 0],
            direction: 'v',
        });

        startingPositions.push({
            current: [0, i],
            direction: '>',
        });

        startingPositions.push({
            current: [height - 1, i],
            direction: '<',
        });

        startingPositions.push({
            current: [i, height - 1],
            direction: '^',
        });
    }

    let maxEnergizedNodes = 0;

    // brute force (takes some seconds to run)
    startingPositions.forEach((startingPosition) => {
        let fieldCopy = field;
        const energizedNodes = getEnergizedNodes(fieldCopy, startingPosition);

        if (energizedNodes.length > maxEnergizedNodes) {
            maxEnergizedNodes = energizedNodes.length;
        }
    });

    console.log('maxEnergizedNodes (part 2):', maxEnergizedNodes);
};

const getEnergizedNodes = (field, startPostion) => {
    // array of light paths
    // this array will be updated during the process
    const lightPaths = [startPostion];

    // current light path being processed
    let currentLightPath;

    // array of energized nodes
    const energized = [];

    // update energized nodes, return false if node is already energized in the current direction (to avoid infinite loop)
    const updateEnergizedNodes = (x, y, direction) => {
        if (energized.find(node => node.position[0] === x && node.position[1] === y && node.direction === direction)) {
            lightPaths.shift();
            currentLightPath = null;

            return false;
        }

        energized.push({
            position: [x, y],
            direction: direction,
        });

        return true;
    };


    while (lightPaths.length > 0) {
        // if there is no current light path, get the first one
        if (!currentLightPath) {
            currentLightPath = lightPaths[0];
        }

        // get current position
        let [x, y] = currentLightPath.current;

        // if current position is out of bounds, remove current light path and continue
        if (x < 0 || y < 0 || x > field[0].length - 1 || y > field.length - 1) {
            lightPaths.shift();
            currentLightPath = null;

            continue;
        }

        // if current position is empty, update energized nodes and move to next position, keeping the same direction
        if (isEmpty(field[y][x])) {
            const updated = updateEnergizedNodes(x, y, currentLightPath.direction);

            if (!updated) {
                continue;
            }

            field[y][x] = currentLightPath.direction;
            currentLightPath.current = [x + directionMap[currentLightPath.direction][0], y + directionMap[currentLightPath.direction][1]];

            continue;
        }

        if (field[y][x] === '/') {
            const updated = updateEnergizedNodes(x, y, currentLightPath.direction);

            if (!updated) {
                continue;
            }

            // update direction and move to next position
            currentLightPath.direction = moveMap['/'][currentLightPath.direction];
            currentLightPath.current = [x + directionMap[currentLightPath.direction][0], y + directionMap[currentLightPath.direction][1]];

            continue;
        }

        if (field[y][x] === '\\') {
            const updated = updateEnergizedNodes(x, y, currentLightPath.direction);

            if (!updated) {
                continue;
            }

            // update direction and move to next position
            currentLightPath.direction = moveMap['\\'][currentLightPath.direction];
            currentLightPath.current = [x + directionMap[currentLightPath.direction][0], y + directionMap[currentLightPath.direction][1]];

            continue;
        }

        if (field[y][x] === '|') {
            const updated = updateEnergizedNodes(x, y, currentLightPath.direction);

            if (!updated) {
                continue;
            }

            // if current direction is up or down, move to next position
            if (currentLightPath.direction === '^' || currentLightPath.direction === 'v') {
                currentLightPath.current = [x, y + directionMap[currentLightPath.direction][1]];
            } else {
                // if current direction is left or right, remove current light path and add two new ones (left and right)
                lightPaths.shift();
                currentLightPath = null;

                lightPaths.push({
                    current: [x, y + 1],
                    direction: 'v',
                });

                lightPaths.push({
                    current: [x, y - 1],
                    direction: '^',
                });
            }

            continue;
        }

        if (field[y][x] === '-') {
            const updated = updateEnergizedNodes(x, y, currentLightPath.direction);

            if (!updated) {
                continue;
            }

            // if current direction is left or right, move to next position
            if (currentLightPath.direction === '>' || currentLightPath.direction === '<') {
                currentLightPath.current = [x + directionMap[currentLightPath.direction][0], y];
            } else {
                // if current direction is up or down, remove current light path and add two new ones (up and down)
                lightPaths.shift();
                currentLightPath = null;

                lightPaths.push({
                    current: [x + 1, y],
                    direction: '>',
                });

                lightPaths.push({
                    current: [x - 1, y],
                    direction: '<',
                });
            }
        }
    }

    // remove duplicates from energized
    const energizedMap = {};

    energized.forEach((node) => {
        const key = node.position.join(',');
        energizedMap[key] = node;
    });

    // unique energized nodes
    return Object.values(energizedMap);
};

const isEmpty = (value) => {
    return value === '.' || value === '>' || value === '<' || value === '^' || value === 'v';
};

const directionMap = {
    '>': [1, 0],
    '<': [-1, 0],
    '^': [0, -1],
    'v': [0, 1],
};

const moveMap = {
    '/': {
        '>': '^',
        '^': '>',
        '<': 'v',
        'v': '<',
    },
    '\\': {
        '>': 'v',
        'v': '>',
        '<': '^',
        '^': '<',
    },
};

process();