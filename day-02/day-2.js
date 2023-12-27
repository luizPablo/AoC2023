const fs = require('fs');

const getGameID = (game) => {
    return parseInt(game.split(' ')[1]);
};

const checkRedCubes = (gamesStr) => {
    const regex = /\b(1[3-9]|[2-9]\d)\s*red\b/g;
    return !regex.test(gamesStr);
};

const checkGreenCubes = (gamesStr) => {
    const regex = /\b(1[4-9]|[2-9]\d)\s*green\b/g;
    return !regex.test(gamesStr);
};

const checkBlueCubes = (gamesStr) => {
    const regex = /\b(1[5-9]|[2-9]\d)\s*blue\b/g;
    return !regex.test(gamesStr);
}

const getLargestNumberBeforeRed = (str) => {
    const regex = /\b(\d+)\s*red\b/g;
    let match;
    let maxNumber = -Infinity;

    while ((match = regex.exec(str)) !== null) {
        const number = parseInt(match[1]);
        if (number > maxNumber) {
            maxNumber = number;
        }
    }

    return maxNumber;
};

const getLargestNumberBeforeGreen = (str) => {
    const regex = /\b(\d+)\s*green\b/g;
    let match;
    let maxNumber = -Infinity;

    while ((match = regex.exec(str)) !== null) {
        const number = parseInt(match[1]);
        if (number > maxNumber) {
            maxNumber = number;
        }
    }

    return maxNumber;
};

const getLargestNumberBeforeBlue = (str) => {
    const regex = /\b(\d+)\s*blue\b/g;
    let match;
    let maxNumber = -Infinity;

    while ((match = regex.exec(str)) !== null) {
        const number = parseInt(match[1]);
        if (number > maxNumber) {
            maxNumber = number;
        }
    }

    return maxNumber;
};

const processGames = () => {
    const fileContent = fs.readFileSync(__dirname + '/input.txt', 'utf-8');

    const lines = fileContent.split('\n');

    let sum = 0;
    let powerSum = 0;

    for (const line of lines) {
        const [idStr, gamesStr] = line.split(':');

        const identifier = getGameID(idStr);


        const largestNumberBeforeRed = getLargestNumberBeforeRed(gamesStr);
        const largestNumberBeforeGreen = getLargestNumberBeforeGreen(gamesStr);
        const largestNumberBeforeBlue = getLargestNumberBeforeBlue(gamesStr);

        const powerSet = largestNumberBeforeRed * largestNumberBeforeGreen * largestNumberBeforeBlue;
        powerSum += powerSet;

        const redValid = checkRedCubes(gamesStr);
        const greenValid = checkGreenCubes(gamesStr);
        const blueValid = checkBlueCubes(gamesStr);

        if (redValid && greenValid && blueValid) {
            sum += identifier;
        }
    };

    console.log('part 1:', sum);
    console.log('part 2:', powerSum);
};

processGames();