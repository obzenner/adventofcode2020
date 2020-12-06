'use strict';

const fs = require('fs');
const path = require('path');

const multiplyArray = (array) => {
    return array.reduce((acc, curr) => {
        return acc = curr * acc;
    }, 1);
}

const findPair = (toAdd, array, condition) => {
    const toAddIndex = array.indexOf(toAdd);
    let i = 0;

    while (i < array.length) {
        const sum = toAdd + array[i];
        if (sum === condition) {
            return [toAdd, array[i]];
        }
        i++;
    }

    return findPair(array[toAddIndex + 1], array, condition);
};

const findThree = (array, condition) => {
    const arrayLength = array.length;

    for (let i = 0; i < arrayLength; i++) {
        for (let j = 0; j < arrayLength; j++) {
            for (let k = 0; k < arrayLength; k++) {
                const sumOfThree = array[i] + array[j] + array[k];
                if (sumOfThree === condition) {
                    return [array[i], array[j], array[k]]
                }
            }
        }
    }
}

const day1Solution = () => {
    const rawInput = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8');
    const input = rawInput.split('\n').map(n => Number(n))

    const resultPair = findPair(input[0], input, 2020);
    const resultThree = findThree(input, 2020);
    const pairResult = multiplyArray(resultPair);
    const threeResult = multiplyArray(resultThree);

    return {
        pairResult,
        threeResult
    }
};

module.exports = {
    day1Solution
}