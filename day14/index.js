'use strict';

const fs = require("fs");
const path = require('path');
const { toBinary64 } = require('../utils/index');

const NUMBER_OF_BITS = 36;


// PART 1
const applyBitmask = (value, bitmask) => {
    let newValue = '';
    const binaryValue = toBinary64(value).substring(64 - NUMBER_OF_BITS);

    for (let i = 0; i < NUMBER_OF_BITS; i++) {
        const maskBit = bitmask[i];
        const isSameValue = (maskBit === 'X' || binaryValue[i] === bitmask[i]);
        newValue += isSameValue ? binaryValue[i] : bitmask[i]
    }

    return parseInt(newValue, 2);
}

const runProgram = (bitmask, values) => {
    const result = values.reduce((acc, pairs) => {
        const memoryAddress = pairs[0];
        const value = pairs[1];
        const newValue = applyBitmask(value, bitmask);
        acc[memoryAddress] = newValue;
        return acc;
    }, {});
    return result;
}

const runPrograms = (programs) => {
    const results = Object.keys(programs).reduce((acc, bitmask) => {
        const values = programs[bitmask];
        return [...acc, runProgram(bitmask, values)];
    }, []);

    return results;
}

// Generate all combinations of array elements:
const combinations = (n) => {
    const max = 2**n;
    const result = [];
    for (let i = 0; i < max; i++) {
        result.push(i.toString(2).padStart(n, '0'));
    }
    return result;
}

const combinationsOfMemAddresses = (XIndexes, initArray, maxValue = 1) => {
    const combs = combinations(XIndexes.length).reduce((acc, comb) => {
        const c = comb.split('').map(v => Number(v));
        return [...acc, [...c]];
    }, []);

    const memAddrsStrings = combs.reduce((acc, comb) => {
        const newMemAddr = [...initArray];
        for (let i = 0; i < XIndexes.length; i++) {
            const indtoChange = XIndexes[i];
            newMemAddr[indtoChange] = comb[i];
        };
        
        return [...acc, parseInt(newMemAddr.join(''), 2)];
    }, []);
    
    return memAddrsStrings;
}

// PART 2
const getCombinationsForFloatingAddresses = (bitmask, XIndexes) => {
    const newMemoryAddresses = combinationsOfMemAddresses(XIndexes.sort((a, b) => a - b), Array.from(bitmask).map(v => {
        return v === 'X' ? 0 : Number(v);
    }));

    return newMemoryAddresses;
}

const applyBitmaskToMemoryAddress = (bitmask, memoryAddress) => {
    let newMemoryAddressString = '';
    let XIndexes = [];
    const binaryValue = toBinary64(memoryAddress).substring(64 - NUMBER_OF_BITS);

    for (let i = 0; i < NUMBER_OF_BITS; i++) {
        const maskBit = bitmask[i];
        switch (maskBit) {
            case 'X':
                XIndexes = [...XIndexes, i];
                newMemoryAddressString += 'X';
                break;
            case '0':
                newMemoryAddressString += binaryValue[i];
                break;
            case '1':
                newMemoryAddressString += 1;
                break;
        }
    }

    return getCombinationsForFloatingAddresses(newMemoryAddressString, XIndexes);
};

const decodeMemoryAddress = (bitmask, memoryAddress, value, memoryAddressMap) => {
    const allMemoryAddressesToChange = applyBitmaskToMemoryAddress(bitmask, memoryAddress);
    
    for (let i = 0; i < allMemoryAddressesToChange.length; i++) {
        memoryAddressMap.set(allMemoryAddressesToChange[i], value);
    }

    return memoryAddressMap;
};

const runProgramsWithMemoryAddressDecoder = (bitmask, values, memoryAddressMap) => {
    return values.reduce((acc, pairs) => {
        const memoryAddress = pairs[0];
        const value = pairs[1];
        acc = decodeMemoryAddress(bitmask, memoryAddress, value, acc);
        return acc;
    }, memoryAddressMap);
}

const runProgramsPart2 = (programs) => {
    const memoryAddressMap = Object.keys(programs).reduce((acc, bitmask) => {
        const memAddrs = programs[bitmask];
        for (let i = 0; i < programs[bitmask].length; i++) {
            acc.set(memAddrs[i][0], memAddrs[i][1])
        }
        return acc;
    }, new Map());

    const newMap = Object.keys(programs).reduce((acc, bitmask) => {
        const values = programs[bitmask];
        acc = runProgramsWithMemoryAddressDecoder(bitmask, values, acc);
        return acc;
    }, new Map());

    return [...newMap].reduce((acc, v) => acc + v[1], 0);
}


const day14Solution = () => {
    //mask = \d\w+
    const rawInput = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8').split(/mask/);
    const programs = rawInput.reduce((acc, line) => {
        if (line !== '') {
            const program = line.split(/\n/);
            const mask = program[0].substring(3);
            const values = program.reduce((acc, v, i) => {
                if (i !== 0 && v !== '') {
                    const value = v.split(/ = /);
                    acc = [...acc, [Number(value[0].match(/\d+/)[0]), Number(value[1])]];
                }
                return acc;
            }, []);
            acc[mask] = [...values];
        }
        return acc;
    }, {});

    const allMemoryAddressValues = runPrograms(programs).reduce((acc, program) => {
        Object.keys(program).forEach((key) => {
            acc[key] = program[key];
        })
        return acc;
    }, {});

    const allMemoryAddressValuesPart2 = runProgramsPart2(programs);

    return {
        part1: Object.keys(allMemoryAddressValues).reduce((acc, key) => acc + allMemoryAddressValues[key], 0),
        part2: allMemoryAddressValuesPart2
    }
}

module.exports = {
    day14Solution
}