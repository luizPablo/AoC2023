const fs = require('fs');

const lineLength = 140;

const processLine = (fullMatrixLine) => {
    const regex = /[^\d\.]/g;

    let sum = 0;
    let gearsSum = 0;

    let match;
    while ((match = regex.exec(fullMatrixLine)) !== null) {
        let numbers = [];
        const symbolIndex = match.index;
        const lineIndex = Math.floor(symbolIndex / lineLength);

        let previousLine = fullMatrixLine.substring((lineIndex - 1) * lineLength, lineIndex * lineLength);
        const previousLineNumbers = previousLine.match(/\d+/g) || [];

        const potentialGear = match[0] === '*';
        const potentialGearParts = [];

        //check if some number is adjacent to the symbol
        previousLineNumbers.forEach((number) => {
            //get first and last index of the number using regex
            const regex = new RegExp(`\\b${number}\\b`);
            const firstIndex = previousLine.search(regex);
            const lastIndex = firstIndex + number.length - 1;

            //check if the symbol is adjacent to the number
            const firstCondition = symbolIndex >= (Math.max(firstIndex - 1, 0)) + (lineIndex * lineLength);
            const secondCondition = symbolIndex <= (Math.min(lastIndex + 1, lineLength)) + (lineIndex * lineLength);
            const isAdjacent = firstCondition && secondCondition;

            //replace each number char with "."
            if (isAdjacent) {
                potentialGearParts.push(number);
                numbers.push(number);
                sum += parseInt(number);

                const newLine = previousLine.replace(regex, '.'.repeat(number.length));
                fullMatrixLine = fullMatrixLine.replace(previousLine, newLine);
                previousLine = newLine;
            }
        });

        let currentLine = fullMatrixLine.substring(lineIndex * lineLength, (lineIndex + 1) * lineLength);
        const currentLineNumbers = currentLine.match(/\d+/g) || [];

        //check if some number is adjacent to the symbol
        currentLineNumbers.forEach((number) => {
            //get first and last index of the number using regex
            const regex = new RegExp(`\\b${number}\\b`);
            const firstIndex = currentLine.search(regex);
            const lastIndex = firstIndex + number.length - 1;

            //check if the symbol is adjacent to the number
            const isAdjacent = firstIndex + (lineIndex * lineLength) === symbolIndex + 1 || lastIndex + (lineIndex * lineLength) === symbolIndex - 1;

            //replace each number char with "."
            if (isAdjacent) {
                potentialGearParts.push(number);
                numbers.push(number);
                sum += parseInt(number);

                const newLine = currentLine.replace(regex, '.'.repeat(number.length));
                fullMatrixLine = fullMatrixLine.replace(currentLine, newLine);
                currentLine = newLine;
            }
        });

        let nextLine = fullMatrixLine.substring((lineIndex + 1) * lineLength, (lineIndex + 2) * lineLength);
        const nextLineNumbers = nextLine.match(/\d+/g) || [];

        //check if some number is adjacent to the symbol
        nextLineNumbers.forEach((number) => {
            //get first and last index of the number using regex
            const regex = new RegExp(`\\b${number}\\b`);
            const firstIndex = nextLine.search(regex);
            const lastIndex = firstIndex + number.length - 1;

            //check if the symbol is adjacent to the number
            const firstCondition = symbolIndex >= (Math.max(firstIndex - 1, 0)) + (lineIndex * lineLength);
            const secondCondition = symbolIndex <= (Math.min(lastIndex + 1, lineLength)) + (lineIndex * lineLength);
            const isAdjacent = firstCondition && secondCondition;

            //replace each number char with "."
            if (isAdjacent) {
                potentialGearParts.push(number);
                numbers.push(number);
                sum += parseInt(number);

                const newLine = nextLine.replace(regex, '.'.repeat(number.length));
                fullMatrixLine = fullMatrixLine.replace(nextLine, newLine);
                nextLine = newLine;
            }
        });

        if (potentialGear) {
            if (potentialGearParts.length === 2) {
                const arrayProduct = potentialGearParts.reduce((a, b) => a * b, 1);
                gearsSum += arrayProduct;
            }
        }
    }

    console.log('part 1:', sum);
    console.log('part 2:', gearsSum);
};

const process = () => {
    const fileContent = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
    const lines = fileContent.split('\n');

    //concatenate lines
    let line = '';
    lines.forEach((l) => {
        line += l;
    });

    //process line
    processLine(line);
};


process();