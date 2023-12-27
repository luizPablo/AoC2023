const fs = require('fs');

const getOperation = (step) => {
    if (step.includes('=')) {
        return 'upsert';
    }

    return 'delete';
};

const hashString = (str) => {
    let currentValue = 0;

    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        currentValue += code;
        currentValue *= 17;
        currentValue %= 256;
    }

    return currentValue;
};

const process = () => {
    const fileContent = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
    const steps = fileContent.split(',');

    let sum = 0;
    let boxes = Array(256).fill(0).map(() => []);

    steps.forEach((step) => {
        // part 1
        let currentValue = hashString(step);
        sum += currentValue;

        // part 2
        // extract the operation
        const operation = getOperation(step);

        let label;
        let focal;

        // getting the label and focal
        if (operation === 'upsert') {
            [label, focal] = step.split('=');
            focal = parseInt(focal);
        } else {
            label = step.slice(0, -1);
        }

        // get the box
        currentBox = hashString(label);

        if (operation === 'upsert') {
            // upsert the lens
            let index = boxes[currentBox].findIndex((item) => item.label === label);

            if (index === -1) {
                boxes[currentBox].push({
                    label,
                    focal,
                    boxPosition: currentBox,
                });
            } else {
                boxes[currentBox][index].focal = focal;
            }
        } else {
            // delete the lens (if exists)
            let index = boxes[currentBox].findIndex((item) => item.label === label);

            if (index !== -1) {
                boxes[currentBox].splice(index, 1);
            }
        }
    });

    const usedBoxes = boxes.filter((box) => box.length > 0);

    const slotSum = usedBoxes.reduce((total, box) => {
        return total + box.reduce((acc, lens, slot) => {
            return acc + ((lens.boxPosition + 1) * (slot + 1) * lens.focal);
        }, 0);
    }, 0);

    console.log('part 1:', sum);
    console.log('part 2:', slotSum);
};

process();