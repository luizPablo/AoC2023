const fs = require('fs');

const upDirection = 0;
const downDirection = 1;
const rightDirection = 3;
const leftDirection = 4;

let maxPathSize = 0;
let maxPathWithoutSlopes = 0;

const process = () => {
    const content = fs.readFileSync('input.txt', 'utf8');
    let lines = content.split('\n');

    const field = lines.map(line => line.split(''));

    // part 1
    const start = [0, 1];
    let pathsMap = {
        0: 0,
    };

    move(field, { position: start, comesFrom: upDirection }, pathsMap, 0);

    console.log('part 1:', maxPathSize);

    // part 2
    pathsMap = {
        0: 0,
    };

    // takes a long loooong time to finish (more than 3.5 hours on my machine)
    move(field, { position: start, comesFrom: upDirection }, pathsMap, 0, true);

    console.log('part 2:', maxPathWithoutSlopes);
};

const move = (field, init, pathsMap, id, ignoreSlopes = false, visitedTiles = new Set()) => {
    let [y, x] = init.position;
    let comesFrom = init.comesFrom;
    let visited = new Set(visitedTiles);

    while (true) {
        if (y === field[0].length - 1 && x === field.length - 2) {
            if (!ignoreSlopes) {
                if (pathsMap[id] > maxPathSize) {
                    maxPathSize = pathsMap[id];
                }
            } else {
                if (pathsMap[id] > maxPathWithoutSlopes) {
                    maxPathWithoutSlopes = pathsMap[id];
                }
            }

            return;
        }

        let moves = getValidMoves(field, y, x, comesFrom, ignoreSlopes, visited);

        if (moves.length === 1) {
            pathsMap[id]++;

            [y, x] = moves[0].position;
            comesFrom = moves[0].comesFrom;

            field[y][x] = 'x';

            visited.add(`${y},${x}`);

            continue;
        }

        if (moves.length === 0) {
            return;
        }

        // more than one move
        for (let i = 0; i < moves.length; i++) {
            const way = moves[i];

            const newId = Object.keys(pathsMap).length;
            pathsMap[newId] = pathsMap[id] + 1;

            move(field, way, pathsMap, newId, ignoreSlopes, visited);
        }

        break;
    }
};

const getValidMoves = (field, y, x, comesFrom, ignoreSlopes = false, visitedTiles = new Set()) => {
    const moves = [];

    // up
    if (comesFrom !== upDirection && validPosition(field, y - 1, x)) {
        if (field[y - 1][x] !== '#' && (field[y - 1][x] !== 'v' || ignoreSlopes)) {
            moves.push({
                position: [y - 1, x],
                comesFrom: downDirection,
            });
        }
    }

    // down
    if (comesFrom !== downDirection && validPosition(field, y + 1, x)) {
        if (field[y + 1][x] !== '#' && (field[y + 1][x] !== '^' || ignoreSlopes)) {
            moves.push({
                position: [y + 1, x],
                comesFrom: upDirection,
            });
        }
    }

    // left
    if (comesFrom !== leftDirection && validPosition(field, y, x - 1)) {
        if (field[y][x - 1] !== '#' && (field[y][x - 1] !== '>' || ignoreSlopes)) {
            moves.push({
                position: [y, x - 1],
                comesFrom: rightDirection,
            });
        }
    }

    // right
    if (comesFrom !== rightDirection && validPosition(field, y, x + 1)) {
        if (field[y][x + 1] !== '#' && (field[y][x + 1] !== '<' || ignoreSlopes)) {
            moves.push({
                position: [y, x + 1],
                comesFrom: leftDirection,
            });
        }
    }

    if (visitedTiles.size > 0 && ignoreSlopes) {
        return moves.filter(move => {
            return !visitedTiles.has(`${move.position[0]},${move.position[1]}`);
        });
    }

    return moves;
};

const validPosition = (field, y, x) => {
    return y >= 0 && y < field.length && x >= 0 && x < field[0].length;
}

process();