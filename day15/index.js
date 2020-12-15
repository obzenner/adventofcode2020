'use strict';

const getLastSpokenNumber = (input, limit = 2020, memo = new Map()) => {
    let lastSpoken = 0;

    for (let i = 0; i < limit; i++) {
        if (input[i] || input[i] === 0) {
            lastSpoken = input[i];
            memo.set(lastSpoken, i + 1);
        } else if (!(memo.has(lastSpoken))) {
            memo.set(lastSpoken, i);
            lastSpoken = 0;
        } else {
            const temp = memo.get(lastSpoken);
            memo.set(lastSpoken, i);
            lastSpoken = i - temp;
        }
    }

    return lastSpoken;
}

const day15Solution = () => {
    const input = [8, 0, 17, 4, 1, 12];

    const lastSpokenPt1 = getLastSpokenNumber(input, 2020);
    const lastSpokenPt2 = getLastSpokenNumber(input, 30000000);

    return {
        part1: lastSpokenPt1,
        part2: lastSpokenPt2
    }
}

module.exports = {
    day15Solution
}