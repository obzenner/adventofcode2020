'use strict';

const fs = require('fs');
var path = require('path');

const validatePasswordPolicy1 = (limits, toeval, password) => {
    const sortedPassword = Array.from(password).sort();
    const firstIndex = sortedPassword.indexOf(toeval[0]);
    const lastIndex = sortedPassword.lastIndexOf(toeval[0]);
    const allevals = sortedPassword.slice(firstIndex, lastIndex+1);
    const isValid = allevals.length >= limits[0] && allevals.length <= limits[1];
    return isValid;
}

const validatePasswordPolicy2 = (limits, toeval, password) => {
    const passwordArray = Array.from(password);
    const isFirstLimitEqual = passwordArray[limits[0] - 1] === toeval[0];
    const isSecondLimitEqual = passwordArray[limits[1] - 1] === toeval[0];
    return isFirstLimitEqual !== isSecondLimitEqual;
}

const day2Solution = () => {
    const rawInput = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8');
    const input = rawInput.split('\n').reduce((acc, curr) => {
        const splitBySpace = curr.split(' ');
        const limits = splitBySpace[0].split('-').map(l => Number(l));
        const toeval = Array.from(splitBySpace[1]).slice(0, splitBySpace[1].length -1);
        const password = splitBySpace[2];
        acc = [...acc, {
            limits,
            toeval,
            password
        }];
        return acc;
    }, []);
    
    const validPasswordsPolicy1 = input.reduce((acc, pw) => {
        const { limits, toeval, password } = pw;
        const isValid = validatePasswordPolicy1(limits, toeval, password);
        return isValid ? [...acc, password] : acc;
    }, [])


    const validPasswordsPolicy2 = input.reduce((acc, pw) => {
        const { limits, toeval, password } = pw;
        const isValid = validatePasswordPolicy2(limits, toeval, password);
        return isValid ? [...acc, password] : acc;
    }, [])

    return {
        firstPolicy: validPasswordsPolicy1.length,
        secondPolicy: validPasswordsPolicy2.length
    }
};

module.exports = {
    day2Solution
}