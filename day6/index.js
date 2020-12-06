'use strict';

const fs = require('fs');
const path = require('path');
const { separateByEmptyLine, intersection, getUniqueValues } = require('../utils/index');

const day6Solution = () => {
    const rawInput = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8').toString();
    const input = rawInput.split('\n');

    const groups = separateByEmptyLine(input);
    const numberOfUniqueAnswersForAllGroups = groups.reduce((acc, group) => {
        const uniqueAnwersPerGroup = getUniqueValues(group.flatMap(i => i[0].split('')));
        return acc + uniqueAnwersPerGroup.length;
    }, 0)

    const arrayWithEverybodyAnsweredYes = groups.reduce((acc, group) => {
        const arraysOfSortedAnswersInGroup = group.reduce((acc, v) => [...acc, v[0].split('').sort()], []);
        return [...acc, intersection(arraysOfSortedAnswersInGroup)]
    }, []);

    const numberOfAnswersEverybodyAnsweredYes = arrayWithEverybodyAnsweredYes.reduce((acc, v) => acc + v.length, 0);

    return {
        part1: numberOfUniqueAnswersForAllGroups,
        part2: numberOfAnswersEverybodyAnsweredYes
    }
};

module.exports = {
    day6Solution
}