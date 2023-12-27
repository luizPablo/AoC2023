const fs = require('fs');

const FIVE_OF_A_KIND = 7;
const FOUR_OF_A_KIND = 6;
const FULL_HOUSE = 5;
const THREE_OF_A_KIND = 4;
const TWO_PAIRS = 3;
const ONE_PAIR = 2;
const NOTHING = 1;

const getHandType = (hand) => {
    const cards = hand.split('');

    //check how many "J" there is in the hand (part 2)
    const jCount = cards.filter(card => card === 'J').length;

    //counting how many of each card there is (part 2)
    const cardCounts = cards.reduce((counts, card) => {
        if (card !== 'J') {
            counts[card] = (counts[card] || 0) + 1;
        };

        return counts;
    }, {});

    //getting the values of the counts
    const counts = Object.values(cardCounts);

    //add jCount to the highest count (part 2)
    counts.sort((a, b) => b - a);
    counts[0] += jCount;

    //determine if the hand is a five of a kind (all the same)
    const isFiveOfAKind = (new Set(cards).size === 1 && cards.length === 5) || counts.includes(5);

    if (isFiveOfAKind) {
        return FIVE_OF_A_KIND;
    }

    //determine if the hand is a four of a kind (four of the same)
    const isFourOfAKind = counts.includes(4);

    if (isFourOfAKind) {
        return FOUR_OF_A_KIND;
    }

    //determine if the hand is a full house (three of the same and two of the same)
    const isFullHouse = counts.includes(3) && counts.includes(2);

    if (isFullHouse) {
        return FULL_HOUSE;
    }

    //determine if the hand is a three of a kind (three of the same)
    const isThreeOfAKind = counts.includes(3);

    if (isThreeOfAKind) {
        return THREE_OF_A_KIND;
    }

    //determine if the hand is a two pairs (two of the same and two of the same)
    const isTwoPairs = counts.filter(count => count === 2).length === 2;

    if (isTwoPairs) {
        return TWO_PAIRS;
    }

    //determine if the hand is a one pair (two of the same)
    const isOnePair = counts.includes(2);

    if (isOnePair) {
        return ONE_PAIR;
    }

    return NOTHING;
};

const compareCards = (cardA, cardB) => {
    let numberA;
    let numberB;

    switch (cardA) {
        case 'T':
            numberA = 10;
            break;
        case 'J':
            numberA = 1; // 11, for part 1
            break;
        case 'Q':
            numberA = 12;
            break;
        case 'K':
            numberA = 13;
            break;
        case 'A':
            numberA = 14;
            break;
        default:
            numberA = parseInt(cardA);
            break;
    };

    switch (cardB) {
        case 'T':
            numberB = 10;
            break;
        case 'J':
            numberB = 1; // 11, for part 1
            break;
        case 'Q':
            numberB = 12;
            break;
        case 'K':
            numberB = 13;
            break;
        case 'A':
            numberB = 14;
            break;
        default:
            numberB = parseInt(cardB);
            break;
    };

    if (numberA > numberB) {
        return 1;
    }

    if (numberA < numberB) {
        return -1;
    }

    return 0;
};

const process = () => {
    const fileContent = fs.readFileSync(__dirname + '/min-input.txt', 'utf-8');
    const lines = fileContent.split('\n');

    let rankedHands = [];

    for (const line of lines) {
        const hand = line.split(' ')[0];
        const bid = line.split(' ')[1];

        const handType = getHandType(hand);

        rankedHands.push({
            hand,
            handType,
            bid,
        });
    }

    rankedHands.sort((a, b) => {
        if (a.handType > b.handType) {
            return 1;
        }

        if (a.handType < b.handType) {
            return -1;
        }

        //if the hand types are the same, compare the hands
        //the strongest order is (J) 2, 3, 4, 5, 6, 7, 8, 9, T, (J), Q, K, A
        if (a.handType === b.handType) {
            const cardsA = a.hand.split('');
            const cardsB = b.hand.split('');

            for (let i = 0; i < cardsA.length; i++) {
                const compareResult = compareCards(cardsA[i], cardsB[i]);
                if (compareResult !== 0) {
                    return compareResult;
                }
            }
        }

        return 0;
    });

    let sum = 0;

    rankedHands.map((rankedHand, index) => {
        sum += rankedHand.bid * (index + 1);
    });

    console.log(sum);
};

process();