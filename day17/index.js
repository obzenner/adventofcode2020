'use strict';

const fs = require("fs");
const path = require('path');

const day17Solution = () => {
    const raw = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8');

    return {
        part1: null,
        part2: null
    }
}

module.exports = {
    day17Solution
}