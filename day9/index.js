'use strict';

const fs = require("fs");
const path = require('path');

const findNumbersThatAreNotSumOfPreamble = (numbers, preambleSize = 5, shiftIndex = 0, result = []) => {
    while (true) {
        const numberToTest = numbers[shiftIndex + preambleSize];

        if (!numberToTest) {
            return result;
        }

        const sortedPreamble = numbers.slice(shiftIndex, shiftIndex + preambleSize).sort((a, b) => a - b);
        const indexOfFirstLargerNumber = sortedPreamble.findIndex(i => i > numberToTest);
        // cut out numbers larger than numberToTest
        const finalPreamble = indexOfFirstLargerNumber !== -1 ? sortedPreamble.slice(0, indexOfFirstLargerNumber) : sortedPreamble;

        const possibleAddendums = finalPreamble
            .reduce((acc, test, index, array) => {
                const result = array.find(possibleAddendum => {
                    return possibleAddendum === numberToTest - test && possibleAddendum !== test;
                });

                return result ? [...acc, result] : acc; 
            }, []);

        result = !Boolean(possibleAddendums.length) ? [...result, numberToTest] : result;
        return findNumbersThatAreNotSumOfPreamble(numbers, preambleSize, shiftIndex + 1, result);
    }
}

const findContigiousNumbersThatSumToTest = (numbers, test) => {
    const possibleNumbers = numbers.filter(n => n < test);
    
    let addedNumbers = [];
    let startIndex = possibleNumbers.length - 1;
    let sum = 0;

    while (startIndex > 0) {     
        addedNumbers = [...addedNumbers, possibleNumbers[startIndex]]
        sum = addedNumbers.reduce((acc, v) => acc + v, 0);

        if (sum > test) {
            startIndex += addedNumbers.length - 2;
            addedNumbers = [];
        } else {
            startIndex--;
        }

        if (addedNumbers.length > 1 && sum === test) {
            return addedNumbers;
        }
    }
};

const getEncryptionWeakness = (contiguousRange) => {
    const sorted = contiguousRange.sort((a, b) => a - b);
    return sorted[0] + sorted[sorted.length - 1];
}

const day9Solution = () => {
    const rawInput = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8');
    const inputNumbers = rawInput.split(/\n/).map(Number);
    const numbersThatAreNotSumOfPreamble = findNumbersThatAreNotSumOfPreamble(inputNumbers, 25);
    const contigiousNumbersThatSumToTest = findContigiousNumbersThatSumToTest(inputNumbers, numbersThatAreNotSumOfPreamble[0]);
    
    return {
        part1: numbersThatAreNotSumOfPreamble[0],
        part2: getEncryptionWeakness(contigiousNumbersThatSumToTest)
    }
}

module.exports = {
    day9Solution
}