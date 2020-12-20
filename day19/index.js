'use strict';

const fs = require("fs");
const path = require('path');


const day19Solution = () => {
    const input = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8')
        .split(/\n/)
        .reduce((acc, line, i, arr) => {
            if (acc.status === 'rules' && line !== '') {
                const exploded = line.split(' ');
                acc.rules = [...acc.rules, {
                    ruleId: Number(exploded[0][0]),
                    body: exploded.slice(1).map(v => {
                        if (['a', 'b', '|'].includes(v)) return v;
                        else return Number(v);
                    })
                }];
            } else {
                acc.messages = [...acc.messages, line];
            }

            if (line === '') {
                acc.status = 'messages';
                return acc;
            }

            if (i === arr.length - 1) {
                delete acc.status
            }

            return acc;
        }, { rules: [], messages: [], status: 'rules'})

    console.log(input)

    return {
        part1: null,
        part2: null
    }
}

module.exports = {
    day19Solution
}