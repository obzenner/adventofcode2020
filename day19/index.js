'use strict';

const fs = require("fs");
const path = require('path');

// 0: 4 1 5
// 1: 2 3 | 3 2
// 2: 4 4 | 5 5
// 3: 4 5 | 5 4
// 4: a
// 5: b

// ababbb
// bababa
// abbbab
// aaabbb
// aaaabbb

const hasIds = (ruleRecord) => {
    return ruleRecord.some(r => typeof r === 'number');
}

const explodeOrRule = (oRrule, rules) => {
    let temp = [...oRrule];
    let i = 0

    while (hasIds(temp)) {
        temp = temp.filter(r => r !== '|').reduce((acc, t, index) => {
            const retrieved = rules.find(r => r.ruleId === t);
            if (retrieved) {
                acc = [...acc, ...retrieved.body];
            } else {
                acc = [...acc, t]
            }
            return acc;
        }, []);
        i++
    }

    return temp;
}

const breakDownRules = (rules) => {
    const zeroRule = rules.find(r => r.ruleId === 0);
    const test = zeroRule.body.reduce((acc, r) => {
        const expl = explodeOrRule([r], rules);
        return [...acc, expl]
    }, []);

    // const la = test.reduce((acc, t, i) => {
    //     console.log(t)
    //     let tempStr = '';
    //     let temp = [];

    //     t.forEach((v, index) => {
    //         if (t.length > 1) {
    //             if (((index + 1) % 3) !== 0) {
    //                 tempStr += v;
    //             } else {
    //                 temp = [...temp, tempStr];
    //                 tempStr = ''
    //             }
    //         } else {
    //             temp = [...temp, v]
    //         }
    //     });
    //     return [...acc, temp];
    // }, []);

    console.log(test[0])

};

const day19Solution = () => {
    const input = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8')
        .split(/\n/)
        .reduce((acc, line, i, arr) => {
            if (acc.status === 'rules' && line !== '') {
                const exploded = line.split(' ');
                acc.rules = [...acc.rules, {
                    ruleId: Number(exploded[0].split(':')[0]),
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

    const brokenRules = breakDownRules(input.rules);

    return {
        part1: null,
        part2: null
    }
}

module.exports = {
    day19Solution
}