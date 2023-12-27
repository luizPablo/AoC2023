const fs = require('fs');

const getCard = (line) => {
    const numbers = line.split(':')[1].trim();

    const winningNumbersStr = numbers.split('|')[0].trim();
    const ownNumbersStr = numbers.split('|')[1].trim();

    //extract numbers using regex
    const winningNumbers = winningNumbersStr.match(/\d+/g).map(Number);
    const ownNumbers = ownNumbersStr.match(/\d+/g).map(Number);

    return {
        winningNumbers,
        ownNumbers,
        copies: 1,
    };
};

let numberOfCards = 0;

const checkCard = (card) => {
    //check how many numbers appear in the winning numbers
    let count = 0;
    card.ownNumbers.forEach((number) => {
        if (card.winningNumbers.includes(number)) {
            count++;
        }
    });

    numberOfCards += card.copies;

    return count;
};

const process = () => {
    const fileContent = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
    const lines = fileContent.split('\n');

    const cards = lines.map((line) => getCard(line));

    let sum = 0;

    cards.map((card, index) => {
        const matches = checkCard(card);

        if (matches > 0) {
            for (let i = 0; i < matches; i++) {
                if (index + i + 1 < cards.length) {
                    cards[index + i + 1].copies += 1 * card.copies;
                }
            }

            points = Math.pow(2, matches - 1);
            sum += points * card.copies;
        }
    });

    console.log('part 1:', sum);
    console.log('part 2:', numberOfCards);
};

process();