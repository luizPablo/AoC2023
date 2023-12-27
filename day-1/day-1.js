const fs = require('fs');

const wordToDigit = {
    'one': 'o1e',
    'two': 't2w',
    'three': 'th3ee',
    'four': 'f4ur',
    'five': 'f5ve',
    'six': 's6x',
    'seven': 's7ven',
    'eight': 'e8ght',
    'nine': 'n9ne',
};

const replaceWordDigits = (str) => {
    let newStr = str;

    for (const word in wordToDigit) {
        newStr = newStr.replaceAll(word, wordToDigit[word]);
    }

    console.log(newStr);

    return newStr;
};

const getNumber = (line) => {
    let str = line;

    // Replace words with their numeric values
    str = replaceWordDigits(str);

    const digits = str.match(/\d/g);

    if (!digits) {
        return 0;
    } else if (digits.length === 1) {
        return parseInt(`${digits[0]}${digits[0]}`);
    } else {
        return parseInt(`${digits[0]}${digits[digits.length - 1]}`);
    }
};

async function process() {
    const fileContent = fs.readFileSync(__dirname + '/input.txt', 'utf-8');

    const lines = fileContent.split('\n');

    let sum = 0;

    for (const line of lines) {
        console.log(line);

        const number = getNumber(line);

        console.log(number);

        sum += number;
    }

    console.log(sum);
}

process();
