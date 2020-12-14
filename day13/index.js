'use strict';

const fs = require("fs");
const path = require('path');

const calcTimestampDiff = (testAgainst = 939, timestamp) => {
    const closestTimestamp = timestamp * Math.ceil(testAgainst / timestamp);

    return { timestamp, minutes: Math.abs(testAgainst - closestTimestamp) };
};

const getClosestDiff = ({ earliestTimestamp, timestamps }) => {
    const minDiff = timestamps.reduce((acc, t) => {
        const { routeLength } = t;
        const diff = calcTimestampDiff(earliestTimestamp, routeLength);
        if (acc === 0) {
            acc = diff;
        } else {
            const isNewValueLower = acc.minutes > diff.minutes;
            acc = isNewValueLower ? diff : acc;
        }
        return acc;
    }, 0);

    return minDiff;
}

function findTimeStampBayla(busRecords) {
    return busRecords.reduce((acc, b) => {
        const { offset, routeLength } = b;
        let { timestamp, mult } = acc;
        let loop = true;

        while (loop) {
            if ((timestamp + offset) % routeLength === 0) {
                mult *= routeLength;
                loop = false;
            } else {
                timestamp += mult;
            }
        }
    
        return {timestamp, mult};
    }, {timestamp: 0, mult: 1})
}

const day13Solution = () => {
    const rawInput = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8').split(/\n/);
    const { earliestTimestamp, timestamps } = {
        earliestTimestamp: Number(rawInput[0]),
        timestamps: rawInput[1].split(',').reduce((acc, bus, index) => {
            if (bus !== 'x') {
                return [...acc, {
                    routeLength: Number(bus),
                    offset: index
                }]
            }
            return acc;
        }, [])
    };

    const minDiff = getClosestDiff({earliestTimestamp, timestamps});
    const { timestamp } = findTimeStampBayla(timestamps)

    return {
        part1: minDiff.timestamp * minDiff.minutes,
        part2: timestamp
    }
}

module.exports = {
    day13Solution
}