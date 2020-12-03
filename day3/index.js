'use strict';

const fs = require('fs');
var path = require('path');

const findTrees = (array, jump = 3, down = 1) => {
    const threshold = array[0].length;
    const bottomLimit = array.length + 1;
    let i = 1;
    let side = 1;
    let numberOfTrees = 0;

    while (i < bottomLimit) {
        if (i > down) {
            side += jump;
            const numberOfOverlaps = Math.floor(side / threshold);
            const edgePosition = numberOfOverlaps * threshold;
            const offset = side - edgePosition;
            const pointIndex = offset === 0 ? threshold : offset;
            const point = array[i - 1][pointIndex - 1];
            numberOfTrees = point === '#' ? numberOfTrees + 1 : numberOfTrees;
        }
        i = i + down;
    }
    return numberOfTrees
}

const day3Solution = () => {
    const rawInput = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8');
    const input = rawInput.split('\n').map(l => {
        return Array.from(l);
    });
    const allSlopes = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]];
    return {
        part1: findTrees(input, 3, 1),
        part2: allSlopes.reduce((acc, slope) => {
            const numberOfTrees = findTrees(input, slope[0], slope[1]);
            acc = acc * numberOfTrees;
            return acc;
        }, 1)
    }
};

module.exports = {
    day3Solution
}