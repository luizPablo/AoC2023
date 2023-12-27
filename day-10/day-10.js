const fs = require('fs');

const startDirectionsPossibilities = {
    up: ['|', 'F', '7'],
    down: ['|', 'L', 'J'],
    left: ['-', 'L', 'F'],
    right: ['-', '7', 'J'],
};

const process = () => {
    const fileContent = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
    const lines = fileContent.split('\n');

    const matrix = [];

    lines.forEach((line) => {
        const row = line.split('');
        matrix.push(row);
    });

    //find the "S" position
    let sPosition = null;

    function findOrigin(matrix) {
        let sPosition = null;
        matrix.some((row, rowIndex) => {
            return row.some((column, columnIndex) => {
                if (column === 'S') {
                    sPosition = {
                        rowIndex,
                        columnIndex,
                    };

                    return true;
                }

                return false;
            }) && sPosition !== null;
        });

        return sPosition;
    }

    sPosition = findOrigin(matrix);

    // find the two start directions
    function getDirections(matrix, position) {
        const directions = [];

        if (position.rowIndex > 0) {
            const upPipe = matrix[position.rowIndex - 1][position.columnIndex];

            if (startDirectionsPossibilities.up.includes(upPipe)) {
                directions.push('up');
            }
        }

        if (position.rowIndex < matrix.length - 1) {
            const downPipe = matrix[position.rowIndex + 1][position.columnIndex];

            if (startDirectionsPossibilities.down.includes(downPipe)) {
                directions.push('down');
            }
        }

        if (position.columnIndex > 0) {
            const leftPipe = matrix[position.rowIndex][position.columnIndex - 1];

            if (startDirectionsPossibilities.left.includes(leftPipe)) {
                directions.push('left');
            }
        }

        if (position.columnIndex < matrix[0].length - 1) {
            const rightPipe = matrix[position.rowIndex][position.columnIndex + 1];

            if (startDirectionsPossibilities.right.includes(rightPipe)) {
                directions.push('right');
            }
        }

        const directionMap = {
            'up,down': '|',
            'left,right': '-',
            'up,right': 'L',
            'up,left': 'J',
            'down,right': 'F',
            'down,left': '7',
        };

        // Sort directions to ensure consistent order
        const sortedDirections = directions.sort().join(',');

        // Use the map to get the character, or default to '.'
        return directionMap[sortedDirections] || '.';
    }

    const directions = getDirections(matrix, sPosition);

    const getNextMove = (previousPosition, currentePosition, currentDirection) => {
        switch (currentDirection) {
            case '|':
                if (previousPosition.rowIndex > currentePosition.rowIndex) {
                    return 'forward';
                } else {
                    return 'backward';
                }
            case '-':
                if (previousPosition.columnIndex < currentePosition.columnIndex) {
                    return 'forward';
                } else {
                    return 'backward';
                }
            case 'F':
                if (previousPosition.columnIndex === currentePosition.columnIndex) {
                    return 'forward';
                } else {
                    return 'backward';
                }
            case 'L':
                if (previousPosition.columnIndex !== currentePosition.columnIndex) {
                    return 'forward';
                } else {
                    return 'backward';
                }
            case 'J':
                if (previousPosition.columnIndex === currentePosition.columnIndex) {
                    return 'forward';
                } else {
                    return 'backward';
                }
            case '7':
                if (previousPosition.columnIndex !== currentePosition.columnIndex) {
                    return 'forward';
                } else {
                    return 'backward';
                }
            case '.':
                return 'stop';
            default:
                return 'stop';
        }
    };

    // find the path
    const path = [];
    let currentPosition = sPosition;
    let currentDirection = directions;
    let currentMove = '';

    const pathPositions = [];

    do {
        if (!currentMove) {
            currentMove = 'forward';
        }

        const nextMove = moveMap[currentDirection][currentMove];

        const nextPosition = {
            rowIndex: currentPosition.rowIndex + nextMove.y,
            columnIndex: currentPosition.columnIndex + nextMove.x,
        };

        pathPositions.push(nextPosition);

        currentDirection = matrix[nextPosition.rowIndex][nextPosition.columnIndex];
        currentMove = getNextMove(currentPosition, nextPosition, currentDirection);
        currentPosition = nextPosition;

        path.push(currentDirection);


    } while (currentPosition.rowIndex != sPosition.rowIndex || currentPosition.columnIndex != sPosition.columnIndex);

    console.log(path.length / 2);

    const getNoPathPoints = (matrix) => {
        const noPathPoints = [];

        matrix.forEach((row, rowIndex) => {
            row.forEach((column, columnIndex) => {
                if (!(pathPositions.some((pathPosition) => pathPosition.rowIndex === rowIndex && pathPosition.columnIndex === columnIndex))) {
                    noPathPoints.push({
                        rowIndex,
                        columnIndex,
                    });
                }
            });
        });

        return noPathPoints;
    };

    const noPathPoints = getNoPathPoints(matrix);

    // get dots that are inside the path (ray casting algorithm)
    const pointsInside = [];

    const isInsidePath = (point) => {
        let inside = false;

        for (let i = 0, j = pathPositions.length - 1; i < pathPositions.length; j = i++) {
            const xi = pathPositions[i].columnIndex;
            const yi = pathPositions[i].rowIndex;
            const xj = pathPositions[j].columnIndex;
            const yj = pathPositions[j].rowIndex;

            const intersect = ((yi > point.rowIndex) !== (yj > point.rowIndex)) &&
                (point.columnIndex < (xj - xi) * (point.rowIndex - yi) / (yj - yi) + xi);

            if (intersect) {
                inside = !inside;
            }
        }

        return inside;
    };

    noPathPoints.forEach((noPathPoint) => {
        if (isInsidePath(noPathPoint)) {
            pointsInside.push(noPathPoint);
        }
    });

    console.log(pointsInside.length);
};

const moveMap = {
    '|': {
        forward: {
            x: 0,
            y: -1,
        },
        backward: {
            x: 0,
            y: 1,
        },
    },
    '-': {
        forward: {
            x: 1,
            y: 0,
        },
        backward: {
            x: -1,
            y: 0,
        },
    },
    'F': {
        forward: {
            x: 1,
            y: 0,
        },
        backward: {
            x: 0,
            y: 1,
        },
    },
    'L': {
        forward: {
            x: 0,
            y: -1,
        },
        backward: {
            x: 1,
            y: 0,
        },
    },
    'J': {
        forward: {
            x: -1,
            y: 0,
        },
        backward: {
            x: 0,
            y: -1,
        },
    },
    '7': {
        forward: {
            x: 0,
            y: 1,
        },
        backward: {
            x: -1,
            y: 0,
        },
    },
    '.': {
        forward: {
            x: 0,
            y: 0,
        },
        backward: {
            x: 0,
            y: 0,
        },
    },
};

process();