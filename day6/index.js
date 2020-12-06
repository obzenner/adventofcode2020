'use strict';

const fs = require('fs');
const path = require('path');

const day6Solution = () => {
    const rawInput = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8').toString();
    const input = rawInput.split('\n');

};

module.exports = {
    day6Solution
}