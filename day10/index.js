'use strict';

const fs = require("fs");
const path = require('path');

const buildJoltsDifferences = (adapters, maxDifference = 3, testRange = 0, joltsDiffs = {}) => {
    const validAdaptersForTestRange = adapters.filter(adapter => {
        return adapter - testRange <= maxDifference;
    });

    while (validAdaptersForTestRange.length > 0) {
        const nextAdapter = validAdaptersForTestRange[0];
        const difference = nextAdapter - testRange;
        const nextAdapters = adapters.filter(a => a !== nextAdapter);

        if (!joltsDiffs[difference]) {
            joltsDiffs[difference] = [nextAdapter]
        } else {
            joltsDiffs[difference] = [...joltsDiffs[difference], nextAdapter];
        }

        return buildJoltsDifferences(nextAdapters, maxDifference, nextAdapter, joltsDiffs);
    }

    return joltsDiffs;
}

const combinations = (value, set, memo = {}) => {
    if (memo[value]) { return memo[value]; }

    if (value === 0) {
        memo[value] = 1;
        return 1;
    }
    if (value < 0) {
        memo[value] = 0;
        return 0;
    }
    if (!set.has(value)) {
        memo[value] = 0;
        return 0;
    }
    memo[value] = (
        combinations(value - 1, set, memo) +
        combinations(value - 2, set, memo) +
        combinations(value - 3, set, memo)
    )
    return memo[value];
}


const day10Solution = () => {
    const rawInput = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8');
    const adapters = rawInput.split(/\n/).map(Number).sort((a, b) => a - b);
    const joltsDiffs = buildJoltsDifferences(adapters);
    const numberOFOfDiffs = Object.keys(joltsDiffs).reduce((acc, diff) => {
        acc[diff] = joltsDiffs[diff].length;
        return acc;
    }, {})

    const lookupSetOfAdapters = new Set([0, ...adapters, Math.max(...adapters) + 3]);
    const lastAdapterValue = [...lookupSetOfAdapters].pop();
    const nOfombinations = combinations(lastAdapterValue, lookupSetOfAdapters);

    return {
        part1: numberOFOfDiffs['1'] * (numberOFOfDiffs['3'] + 1),
        part2: nOfombinations
    }
}

module.exports = {
    day10Solution
}