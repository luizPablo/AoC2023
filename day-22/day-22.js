const fs = require('fs');

const process = () => {
    const content = fs.readFileSync('input.txt', 'utf8');
    let lines = content.split('\n');
    let bricks = [];

    for (let line of lines) {
        let [start, end] = line.split('~');
        let [xs, ys, zs] = start.split(',').map(Number);
        let [xe, ye, ze] = end.split(',').map(Number);

        bricks.push({
            start: [xs, ys, zs],
            end: [xe, ye, ze],
        });
    }

    // Sorting bricks by height (z-axis)
    bricks.sort((a, b) => a.start[2] - b.start[2]);

    let filled = {};

    // Filling until bricks can fall
    let falledBricks = [];

    for (let brick of bricks) {
        let [xs, ys, zs] = brick.start;
        let [xe, ye, ze] = brick.end;

        while (validFall({ start: [xs, ys, zs - 1], end: [xe, ye, ze - 1] }, filled) && zs - 1 >= 1) {
            zs -= 1;
            ze -= 1;
        }

        falledBricks.push({ start: [xs, ys, zs], end: [xe, ye, ze] });

        for (let [x, y, z] of tiles({ start: [xs, ys, zs], end: [xe, ye, ze] })) {
            filled[`${x},${y},${z}`] = true;
        }
    }

    // Sorting bricks by height (z-axis)
    falledBricks.sort((a, b) => a.start[2] - b.start[2]);

    let bricksAmount = falledBricks.length;

    let parents = Array.from({ length: bricksAmount }, () => []);
    let children = Array.from({ length: bricksAmount }, () => []);

    // build bricks dependency map
    for (let i = 0; i < bricksAmount; i++) {
        for (let j = 0; j < bricksAmount; j++) {
            // the bricks is too far
            if (falledBricks[j].start[2] > falledBricks[i].end[2] + 1) {
                break;
            }

            // check if the brick (i) supports the brick (j)
            if (j > i && supports(falledBricks[i], falledBricks[j])) {
                // add the brick (i) as a parent of the brick (j)
                parents[j].push(i);
                // add the brick (j) as a child of the brick (i)
                children[i].push(j);
            }
        }
    }

    let disintegrationMap = Array.from({ length: bricksAmount }, () => []);

    // getting the bricks that can't disintegrate (is the only parent of another brick)
    for (let i = 0; i < bricksAmount; i++) {
        for (let j = 0; j < bricksAmount; j++) {
            if (parents[j].length === 1 && parents[j][0] === i) {
                disintegrationMap[i].push(j);
            }
        }
    }

    // the bricks that have zero, two or more parents can be disintegrated
    console.log('part 1:', disintegrationMap.filter(x => x.length === 0).length);

    let total = 0;

    for (let i = 0; i < bricksAmount; i++) {
        let visited = new Set();
        let stack = [];

        // get all base stack bricks (bricks in the ground)
        for (let j = 0; j < bricksAmount; j++) {
            if (falledBricks[j].start[2] === 1) {
                visited.add(j);
                if (j !== i) {
                    stack.push(j);
                }
            }
        }

        // recursively update the stack with all bricks that can fall (children)
        while (stack.length > 0) {
            let brick = stack.pop();
            if (brick !== i) {
                for (let child of children[brick]) {
                    if (!visited.has(child)) {
                        stack.push(child);
                        visited.add(child);
                    }
                }
            }
        }

        total += bricksAmount - visited.size;
    }

    console.log('part 2:', total);
};

function tiles({ start, end }) {
    let [xd, yd, zd] = start;
    let [xf, yf, zf] = end;

    if (xd < xf) return Array.from({ length: xf - xd + 1 }, (_, i) => [xd + i, yd, zd]);
    if (yd < yf) return Array.from({ length: yf - yd + 1 }, (_, i) => [xd, yd + i, zd]);
    if (zd < zf) return Array.from({ length: zf - zd + 1 }, (_, i) => [xd, yd, zd + i]);

    return [[xd, yd, zd]];
}

function validFall(brick, filled) {
    return tiles(brick).every(([x, y, z]) => !(`${x},${y},${z}` in filled));
}

function supports(brick1, brick2) {
    for (let tile of tiles(brick1)) {
        let [x, y, z] = tile;
        if (tiles(brick2).some(([bx, by, bz]) => bx === x && by === y && bz === z + 1)) {
            return true;
        }
    }
    return false;
}

process();