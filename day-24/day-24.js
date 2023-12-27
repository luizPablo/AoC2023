const fs = require('fs');
const { exit } = require('process');
const { init: initZ3 } = require('z3-solver');

const minSize = 200000000000000;
const maxSize = 400000000000000;
// const minSize = 7;
// const maxSize = 27;

const process = async () => {
    const content = fs.readFileSync('input.txt', 'utf8');
    let lines = content.split('\n');

    const stones = lines.map(line => {
        let [positions, velocities] = line.split(' @ ');
        positions = positions.split(', ').map(position => parseInt(position));
        velocities = velocities.split(', ').map(velocity => parseInt(velocity));

        return {
            positions,
            velocities,
        };
    });

    // part 1
    let countStones = 0;

    for (let i = 0; i < stones.length; i++) {
        for (let j = i + 1; j < stones.length; j++) {
            let { past, x, y } = findIntersection(
                stones[i].positions,
                stones[i].velocities,
                stones[j].positions,
                stones[j].velocities,
            );

            if (!past && x >= minSize && x <= maxSize && y >= minSize && y <= maxSize) {
                countStones++;
            }
        }
    }

    console.log('part 1:', countStones);

    // part 2
    const startingPosition = await getStartingPosition(stones);
    console.log('part 2:', startingPosition.reduce((acc, curr) => acc + curr, 0));

    exit();
};

function findIntersection([px1, py1], [vx1, vy1], [px2, py2], [vx2, vy2]) {
    // get the line equations (y = mx + b)

    // found the inclination of each line
    let inclination1 = vy1 / vx1;
    let inclination2 = vy2 / vx2;

    // found the constant of each line
    let constant1 = py1 - inclination1 * px1;
    let constant2 = py2 - inclination2 * px2;

    // Calculate the intersection point
    let ix = (constant2 - constant1) / (inclination1 - inclination2);
    let iy = inclination1 * ix + constant1;

    // Calculate the time of intersection for each stone
    let tx1 = (ix - px1) / vx1;
    let tx2 = (ix - px2) / vx2;
    let ty1 = (iy - py1) / vy1;
    let ty2 = (iy - py2) / vy2;

    // Check if the intersection occurs in the past for either stone
    if (tx1 < 0 || tx2 < 0 || ty1 < 0 || ty2 < 0) {
        return { past: true, x: ix, y: iy };
    } else {
        return { past: false, x: ix, y: iy };
    }
}

// z3 lib does the entire job
const getStartingPosition = async (stones) => {
    const { Context } = await initZ3();
    const { Real, Solver } = Context('main');

    // create the variables
    const x = Real.const('x');
    const y = Real.const('y');
    const z = Real.const('z');

    const vx = Real.const('vx');
    const vy = Real.const('vy');
    const vz = Real.const('vz');

    // create the solver
    const solver = new Solver();

    // add the constraints
    stones.forEach(({ positions, velocities }, index) => {
        let [hx, hy, hz] = positions;
        let [hvx, hvy, hvz] = velocities;

        const t = Real.const(`t${index}`);

        // The solver.add function is used to add constraints to the solver 
        // These constraints represent the equations of motion for the stones
        // The ge function creates a constraint that its argument is greater than or equal to zero
        // The add, mul, and eq functions are used to create constraints that represent the equations of motion for the stones
        // It's basically a system of equations
        solver.add(t.ge(0));
        solver.add(x.add(vx.mul(t)).eq(t.mul(hvx).add(hx)));
        solver.add(y.add(vy.mul(t)).eq(t.mul(hvy).add(hy)));
        solver.add(z.add(vz.mul(t)).eq(t.mul(hvz).add(hz)));
    });

    // check if the solver is satisfiable
    let satisfied = await solver.check();

    if (satisfied !== 'sat') {
        throw new Error('unsatisfiable');
    }

    // get the model
    const model = solver.model();

    // return the values (x, y, z), mapped to numbers
    return [model.eval(x), model.eval(y), model.eval(z)].map(Number);

};

process();