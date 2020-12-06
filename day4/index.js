'use strict';

const fs = require('fs');
const path = require('path');
const { separateByEmptyLine } = require('../utils/index')

const sortAndJoin = (array = []) => {
    return array.sort().join('');
}

const requiredFields = [
    ['byr', /^(19[2-9][0-9]|200[0-2])$/],
    ['iyr', /^(201[0-9]|2020)$/],
    ['eyr', /^(202[0-9]|2030)$/],
    ['hgt', /^(?:1[5-8][0-9]|19[0-3])cm|(?:59|6[0-9]|7[0-6])in$/],
    ['hcl', /^#[0-9a-f]{6}$/],
    ['ecl', /^(amb|blu|brn|gry|grn|hzl|oth)$/],
    ['pid', /^\d{9}$/]
];

const validateFields = (passports, optionalField = 'cid') => {
    return passports.filter(p => {
        const fieldsString = sortAndJoin(p.filter(p => p[0] !== optionalField).map(p => p[0]));
        return sortAndJoin(requiredFields.map(r => r[0])) === fieldsString;
    });
}

const validateFieldsPart2 = (passports) => {
    return passports.filter(passport => {
        const validFields = requiredFields.reduce((acc, field) => {
            const fieldName = field[0];
            const passportField = passport.find(p => p[0] === fieldName);

            if (passportField) {
                const fieldRegex = field[1];
                const passportFieldValue = passportField[1];
                const isMatch = passportFieldValue.match(fieldRegex);
                return Boolean(isMatch) ? [...acc, [fieldName, Boolean(isMatch)]] : acc;
            } else {
                return acc;
            }
        }, []);

        if (validFields.length === requiredFields.length) {
            return passport;
        }
    });
}

const day4Solution = () => {
    const rawInput = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8').toString();
    const input = rawInput.split('\n');
    const passports = separateByEmptyLine(input);
    return {
        part1: validateFields(passports).length,
        part2: validateFieldsPart2(passports).length
    }
};

module.exports = {
    day4Solution
}