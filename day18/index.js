'use strict';

const fs = require("fs");
const path = require('path');

// Please forgive me, that's all I can do when I don't feel like googling
const explodeFuckingBrackets = (line) => {
    return line.split(' ').reduce((acc, v) => {
        if (v !== ' ') {
            const num = v.match(/\d+/);
            const hasFuckingBrackets = num && (num[0].length < num.input.length);
            if (hasFuckingBrackets) {
                const location = num.input[0] === '(' ? 1 : 0;
                const diff = num.input.length - num[0].length;
                const brackets = location === 1 ? num.input.substring(0, diff) : num.input.substring(num[0].length, num.input.length)
                acc = location === 0 ? [...acc, num[0], ...brackets.split('')] : [...acc, ...brackets.split(''), num[0]]
            } else {
                acc = [...acc, v];
            }
        }
        return acc;
    }, []);
};

const calcLevel = (level) => {
    let op = '+';
    const value = level.reduce((acc, item, ind) => {
        const { i, v } = item;

        if (ind === 0) {
            return acc;
        }

        switch (v) {
            case '+':
                op = '+';
                return acc;
            case '*':
                op = '*'; 
                return acc;
            default:
                acc = op === '+' ? acc + Number(v) : acc * Number(v);
        }

        return acc;
    }, Number(level[0].v));

    const splitIndexes = [level[0].i - 1,  level[level.length - 1].i + 1]
    return { value, splitIndexes }
}


const getNewLine = (testLine, value) => {
    const firstArr = testLine.slice(0, value.splitIndexes[0]);
    const secondArr = testLine.slice(value.splitIndexes[1] + 1, testLine.length);
    return [...firstArr, value.value, ...secondArr];
};

const calcBracket = (testLine) => {
    const brackets = ['(', ')']

    const findNotNested = (test) => {
        let state = 'closed';
        let temp = [];

        test.forEach((v, i) => {
            if (state === 'finish') {
                return;
            }

            if (state === 'closed' && v === '(') {
                state = 'open';
            }
            
            if (state === 'open' && !brackets.includes(v)) {
                temp = [...temp, {i, v}];
            }

            if (state === 'open' && v === '(') {
                // reset array;
                temp = [];
            }

            if (state === 'open' && v === ')') {
                state = 'finish';
                return;
            }
        });

        return temp;
    }

    return findNotNested(testLine);
}

const calcAllBrackets = (testLine) => {
    const bracket = calcBracket(testLine);

    while (bracket.length > 0) {
        const nestedValue = calcLevel(bracket);
        const newLine = getNewLine(testLine, nestedValue)
        return calcAllBrackets(newLine);
    }
    
    return testLine.map((v, i) => {
        return { i, v }
    })
}

const calcAllLines = (rawLines) => {
    const calc = rawLines.reduce((acc, line) => {
        const explodedLine = explodeFuckingBrackets(line);
        const finalLine = calcAllBrackets(explodedLine);
        const finalCalc = calcLevel(finalLine);
        acc += finalCalc.value;
        return acc;
    }, 0)

    console.log(calc)
}

const day18Solution = () => {
    const raw = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8').split(/\n/);

    const resPt1 = calcAllLines(raw);


    return {
        part1: resPt1,
        part2: null
    }
}

module.exports = {
    day18Solution
}