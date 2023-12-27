const fs = require('fs');
const PriorityQueue = require('priorityqueuejs');

const process = () => {
    const fileContent = fs.readFileSync(__dirname + '/input.txt', 'utf-8');

    const lines = fileContent.split('\n');
    const field = lines.map(line => line.split('').map(Number));

    console.log('part 1:', minCost([0, 0], [field.length - 1, field.length - 1], 1, 3, field));
    console.log('part 2:', minCost([0, 0], [field.length - 1, field.length - 1], 4, 10, field));
};

const minCost = (start, end, minMoves, maxMoves, field) => {
    const sideLenght = field.length;

    // prioritize by lowest cost
    let queue = new PriorityQueue((a, b) => b[0] - a[0]);

    queue.enq([0, ...start, 0, 0]);

    // keep track of visited states
    let visited = new Set();

    while (!queue.isEmpty()) {
        let [currentCost, currentX, currentY, previousX, previousY] = queue.deq();

        if (currentX === end[0] && currentY === end[1]) {
            return currentCost;
        }

        // state is defined by the current position and the previous direction
        let state = `${currentX}-${currentY},${previousX}-${previousY}`;

        // skip if we've already seen this state from the same direction (to avoid cycles)
        if (visited.has(state)) {
            continue;
        }

        visited.add(state);

        // [1, 0] - right
        // [0, 1] - down
        // [-1, 0] - left
        // [0, -1] - up
        let directions = [[1, 0], [0, 1], [-1, 0], [0, -1]].filter(([dx, dy]) => {
            // filter out the opposite direction and the current direction (allow only turns)
            return (dx !== previousX || dy !== previousY) && !(dx === -previousX && dy === -previousY);
        });

        for (let [dx, dy] of directions) {
            // values of the current state
            let xPosition = currentX;
            let yPosition = currentY;
            let cost = currentCost;

            // move in the current direction until the end of the field or until we reach the max moves
            for (let i = 1; i <= maxMoves; i++) {
                xPosition += dx;
                yPosition += dy;

                // if we're out of the field, nothing to do here
                if (xPosition >= 0 && xPosition < sideLenght && yPosition >= 0 && yPosition < sideLenght) {
                    cost += field[xPosition][yPosition];

                    // if we dont reach the min moves, we can enqueue
                    // to get costs for the next moves (turns in different directions than the current one)
                    if (i >= minMoves) {
                        queue.enq([cost, xPosition, yPosition, dx, dy]);
                    }
                }
            }
        }
    }
}

process();