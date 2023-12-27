const fs = require('fs');

const process = () => {
    const turnField = (field) => {
        const newField = [];

        for (let i = 0; i < field[0].length; i++) {
            newField.push(field.map(row => row[i]));
        };

        return newField;
    };

    const differeceBetweenLine = (line1, line2) => {
        let difference = 0;

        for (let i = 0; i < line1.length; i++) {
            if (line1[i] !== line2[i]) {
                difference++;
            };
        };

        return difference;
    };

    const getReflectionPosition = (field, smudge) => {
        for (let index = 0; index < field.length - 1; index++) {
            line = field[index];

            // find for two consecutive "equal" lines
            let difference = differeceBetweenLine(line, field[index + 1]);

            // this conditions will be true if the consecutive lines are "equal"
            if (difference <= smudge) {
                // number of lines above and below the "equal" lines
                const updside = index;
                const downside = field.length - index;

                // iterate over the next lines (up, down) and check equality
                for (let i = 0; i < Math.min(updside, downside); i++) {
                    const upRow = index - i - 1;
                    const downRow = index + i + 2;

                    // if are out of the field, then break
                    if (upRow < 0 || downRow >= field.length) {
                        break;
                    }

                    difference += differeceBetweenLine(field[upRow], field[downRow]);

                    //found two pairs that are not equal
                    if (difference > 0) {
                        continue;
                    }
                }

                // if the difference is equal to the smudge, then we found the reflection position
                if (difference === smudge) {
                    return index + 1;
                }
            }
        }

        return 0;
    };

    const fileContent = fs.readFileSync(__dirname + '/input.txt', 'utf-8');

    const fields = fileContent.split('\n\n');

    let sum = 0;
    const smudge = 1; // 0, for part 1

    fields.forEach((field) => {
        const fieldLines = field.split('\n');

        const rows = getReflectionPosition(fieldLines, smudge);
        sum += rows * 100;

        const columns = getReflectionPosition(turnField(fieldLines), smudge);
        sum += columns;
    });

    console.log(sum);
};

process();