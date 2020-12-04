'use strict';

const fs = require('fs');
var path = require('path');

const getPassportFields = (input) => {
    let passportIndex = 0;
    let passports = [];

    for (let i = 0; i < input.length; i++) {
        const line = input[i];
        if (!passports[passportIndex]) {
            passports[passportIndex] = [];
        }
        if (line !== '') {
            const fields = line.split(' ').map(f => {
                const field = f.split(':');
                return field;
            });
            passports[passportIndex] = [...passports[passportIndex], ...fields];
        } else {
            passportIndex++;
        }
    }

    return passports;
}

const sortAndJoin = (array = []) => {
    return array.sort().join('');
}

const requiredFields = [
    ['byr', /^19[2-9][0-9]|200[0-2]$/],
    ['iyr', /^201[0-9]|2020$/],
    ['eyr', /^202[0-9]|2030$/],
    ['hgt', /^(?:1[5-8][0-9]|19[0-3])cm|(?:59|6[0-9]|7[0-6])in$/],
    ['hcl', /^#[0-9,a-f]{6}$/],
    ['ecl', /^amb|blu|brn|gry|grn|hzl|oth$/],
    ['pid', /^\d{9}$/]
];

const validateFields = (passports, optionalField = 'cid') => {
    return passports.filter(p => {
        const fieldsString = sortAndJoin(p.filter(p => p[0] !== optionalField).map(p => p[0]));
        return sortAndJoin(requiredFields.map(r => r[0])) === fieldsString;
    }).length;
}

const validateFieldsPart2 = (passports, optionalField = 'cid') => {
    return passports.filter(passport => {
        const validator = requiredFields.reduce((acc, field) => {
            const passportField = passport.find(p => p[0] === field[0]);
            if (passportField) {
                const fieldRegex = requiredFields.find(r => r[0] === field[0])[1];
                const isMatch = passportField[1].match(fieldRegex);
                acc = [...acc, [field[0], Boolean(isMatch)]]
                return acc;
            } else {
                acc = [...acc, [field[0], false]]
                return acc;
            }
        }, []);
        
        if (validator.filter(v => v[1] === true).length === requiredFields.length) {
            return passport;
        }
    }, []);
}

const day4Solution = () => {
    const rawInput = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8').toString();
    const input = rawInput.split('\n');
    const passports = getPassportFields(input);
    return {
        part1: validateFields(passports),
        part2: validateFieldsPart2(passports).length
    }
};

module.exports = {
    day4Solution
}