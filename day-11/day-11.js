const fs = require('fs');

const process = () => {
    const fileContent = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
    const lines = fileContent.split('\n');

    const matrix = [];

    lines.forEach((line) => {
        const row = line.split('');
        matrix.push(row);
    });

    //get matrix rows wich have only dots
    //get matrix columns wich have only dots
    let rowsIndexes = [];
    let columnsIndexes = [];

    matrix.forEach((row, columnIndex) => {
        if (row.every((column) => column === '.')) {
            rowsIndexes.push(matrix.indexOf(row));
        }

        if (matrix.every((row) => row[columnIndex] === '.')) {
            columnsIndexes.push(columnIndex);
        }
    });

    let galaxiesPositions = [];

    //find galaxies
    matrix.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            if (column === '#') {
                galaxiesPositions.push({
                    rowIndex,
                    columnIndex,
                });
            }
        });
    });

    //find distances between galaxies
    const distances = [];
    let sumDistances = 0;
    //part 1 (added spaces = 1)
    //part 2 (added spaces = 9999999)
    let addedSpaces = 1;

    //check how many dots rows are between two galaxies
    //check how many dots columns are between two galaxies
    const getEmpties = (rowIndex, columnIndex, rowIndexDestination, columnIndexDestination) => {
        let emptyRowsBetween = rowsIndexes.filter((emptyRowIndex) => {
            return (rowIndex < emptyRowIndex && rowIndexDestination > emptyRowIndex) || (rowIndex > emptyRowIndex && rowIndexDestination < emptyRowIndex);
        }).length;
        let emptyColumnsBetween = columnsIndexes.filter((emptyColumnIndex) => {
            return (columnIndex < emptyColumnIndex && columnIndexDestination > emptyColumnIndex) || (columnIndex > emptyColumnIndex && columnIndexDestination < emptyColumnIndex);
        }).length;

        return { emptyRowsBetween, emptyColumnsBetween };
    };


    galaxiesPositions.forEach((galaxyPosition, index) => {
        for (let indexDestination = index + 1; indexDestination < galaxiesPositions.length; indexDestination++) {
            const galaxyPositionDestination = galaxiesPositions[indexDestination];

            const distanceNumber = Math.abs(galaxyPosition.rowIndex - galaxyPositionDestination.rowIndex) + Math.abs(galaxyPosition.columnIndex - galaxyPositionDestination.columnIndex);
            const empties = getEmpties(galaxyPosition.rowIndex, galaxyPosition.columnIndex, galaxyPositionDestination.rowIndex, galaxyPositionDestination.columnIndex);
            sumDistances += distanceNumber + ((empties.emptyRowsBetween + empties.emptyColumnsBetween) * addedSpaces);

            const distance = {
                from: index,
                to: indexDestination,
                empties,
                distance: distanceNumber + ((empties.emptyRowsBetween + empties.emptyColumnsBetween) * addedSpaces),
            };

            distances.push(distance);
        }
    });

    console.log(sumDistances);
};

process();