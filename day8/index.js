'use strict';

const fs = require("fs");
const path = require('path');

const prepareInstructions = (rawInput) => {
    return rawInput.reduce((acc, line) => {
        const explode = line.split(' ');
        return [...acc, {
            code: explode[0],
            value: Number(explode[1].slice(1, explode[1].length)),
            operation: explode[1][0]
        }]
    }, []);
}

const runInstructions = (instructions) => {
    let currInstrIndex = 0;
    let instructionsRan = new Set();
    let acc = 0;

    while (!instructionsRan.has(currInstrIndex) && currInstrIndex < instructions.length) {
        const currentInstr = instructions[currInstrIndex];

        instructionsRan.add(currInstrIndex);

        const value = (currentInstr.operation === '+' ? + currentInstr.value : - currentInstr.value);

        switch (currentInstr.code) {
            case 'nop':
                currInstrIndex++;
                break;
            case 'acc':
                acc = acc + value;
                currInstrIndex++;
                break;
            case 'jmp':
                currInstrIndex = currInstrIndex + value;
                break;
        };
    }
    
    return {
        acc,
        instructionsRan,
        currInstrIndex
    };
}

const getNextJmpOrNopIndex = (instructions, nextJmpOrNopIndex = 0) => {
    let jmpOrNop = null;
    let i = nextJmpOrNopIndex;

    while (!jmpOrNop) {
        if (['nop', 'jmp'].includes(instructions[i].code)) {
            jmpOrNop = instructions[i];
        }
        i++;
    }

    return {
        instrIndex: i - 1,
        jmpOrNop: Object.assign(jmpOrNop)
    };
    
}

const findFixedCombination = (instructions, nextJmpOrNopIndex = 0, accValue) => {
    let isCurrentInstrIndexLast = false;
    const lastInstructionIndex = instructions.length - 1;

   while (!isCurrentInstrIndexLast) {
        const nextJmpOrNop = getNextJmpOrNopIndex(instructions, nextJmpOrNopIndex);
        const newInstructions = instructions.reduce((acc, instr, index) => {
            let newInstr = Object.assign({}, instr);
            if (index === nextJmpOrNop.instrIndex) {
                newInstr = Object.assign(newInstr, { code: newInstr.code === 'jmp' ? 'nop' : 'jmp' });
            }
            return [...acc, newInstr];
        }, []);

        accValue = runInstructions(newInstructions);
        isCurrentInstrIndexLast = accValue.currInstrIndex - 1 === lastInstructionIndex;

        if (isCurrentInstrIndexLast) {
            return accValue;
        }

        return findFixedCombination(instructions, nextJmpOrNop.instrIndex + 1, accValue);
    }

   return accValue;
}

const day8Solution = () => {
    const rawInput = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8');
    const instructions = prepareInstructions(rawInput.split(/\n/));
    const accValue = runInstructions(instructions);
    const fixedInstructionsResult = findFixedCombination(instructions, 0);
    
    return {
        part1: accValue.acc,
        part2: fixedInstructionsResult.acc
    }
}

module.exports = {
    day8Solution
}