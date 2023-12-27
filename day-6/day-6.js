const fs = require('fs');

const process = () => {
    const fileContent = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
    const lines = fileContent.split('\n');

    const timeStr = lines[0];
    const distanceStr = lines[1];

    // part 1 (whitout 'replaceAll')
    // part 2 (with 'replaceAll')
    const times = timeStr.split(':')[1].trim().replaceAll(' ', '').match(/\d+/g).map(Number);
    const distances = distanceStr.split(':')[1].trim().replaceAll(' ', '').match(/\d+/g).map(Number);

    console.log(times, distances);

    let acc = 1;

    for (let i = 0; i < times.length; i++) {
        const time = times[i];
        const distance = distances[i];

        let count = 0;

        for (let j = 0; j <= time; j++) {
            if ((j * (time - j)) > distance) {
                count++;
            }
        }

        acc *= count;
    }

    console.log(acc);
};

process();