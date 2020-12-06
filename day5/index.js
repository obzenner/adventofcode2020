'use strict';

const fs = require('fs');
const path = require('path');

const LIMITS = {
    rows: [0, 127],
    columns: [0, 7],
}

const SEAT_MULTIPLIER = 8;

const getHalf = (low = 0, high = 127, direction = 'F') => {
    const value = ((high - low) / 2) + low;
    switch (direction) {
        case 'F':
        case 'L':
            return [low, Math.floor(value)];
        case 'B':
        case 'R':
            return [Math.round(value), high];
    }
}

const getValue = (rules, limits) => {
    return rules.reduce((acc, rule) => {
        return getHalf(acc[0], acc[1], rule);
    }, limits)[0];
};

const getRowAndColumnRulesPerRecord = (input) => {
    return input.reduce((acc, record) => {
        const rules = record.split('').reduce((acc, rule, index) => {
            if (!acc.rowRules) {
                acc.rowRules = [];
            }
            if (!acc.columnRules) {
                acc.columnRules = [];
            }

            if (index < 7) {
                acc.rowRules = [...acc.rowRules, rule]
            } else {
                acc.columnRules = [...acc.columnRules, rule]
            }

            return acc;
        }, {})
        return [...acc, rules];
    }, []);
}

const day5Solution = () => {
    const rawInput = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8').toString();
    const input = rawInput.split('\n');
    const rowsAndColums = getRowAndColumnRulesPerRecord(input);
    const finalValues = rowsAndColums.reduce((acc, record) => {
        const row = getValue(record.rowRules, LIMITS.rows);
        const column = getValue(record.columnRules, LIMITS.columns);
        const seatId = row * SEAT_MULTIPLIER + column;
        if (!acc[row]) {
            acc[row] = {
                seats: [seatId]
            }
        } else {
            acc[row].seats = [...acc[row].seats, seatId].sort((a, b) => a - b);
        }

        return acc;

    }, {});

    
    const allOccupiedSeats = Object.keys(finalValues).reduce((acc, row) => {
        return finalValues[row].seats ? [...acc, ...finalValues[row].seats] : acc;
    }, []).sort((a, b) => a - b);

    const findMissingSeat = (firstSeat, lastSeat) => {
        let missingSeat = 0;
        for (let i = firstSeat; i <= lastSeat; i++) {
            if (!allOccupiedSeats.includes(i)) {
                missingSeat = i;
            }
        }
        return missingSeat;
    }

    return {
        part1: allOccupiedSeats[allOccupiedSeats.length - 1],
        part2: findMissingSeat(allOccupiedSeats[0], allOccupiedSeats[allOccupiedSeats.length - 1])
    }
};

module.exports = {
    day5Solution
}