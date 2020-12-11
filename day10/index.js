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

const part2 = (adapters, min = 1, max = 3) => {
    const maxValue = Math.max(...adapters);
    const paths = Array(maxValue + 1).fill(0);
    paths[0] = 1;

    let index = 1;

    while (index <= maxValue + 1) {
        for (let x = 1; x < 4; x++) {
            const value = index - x;
            if (adapters.includes(value)) {
                const incr = paths[index] + paths[value];
                if (incr) {
                    paths[index] = incr;
                }
            }
        }
        index++;
    }

    return paths[paths.length - 1];
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
    const nOfombinations = part2([...lookupSetOfAdapters], 0);

    return {
        part1: numberOFOfDiffs['1'] * (numberOFOfDiffs['3'] + 1),
        part2: nOfombinations
    }
}

module.exports = {
    day10Solution
}