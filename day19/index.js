'use strict';

const fs = require("fs");
const path = require('path');


const day19Solution = () => {
    const raw = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8').split(/\n/);



    return {
        part1: resPt1,
        part2: resPt2
    }
}

module.exports = {
    day19Solution
}