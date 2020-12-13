'use strict';

const fs = require("fs");
const path = require('path');

const calcTimestampDiff = (testAgainst = 939, timestamp) => {
    const closestTimestamp = timestamp * Math.ceil(testAgainst / timestamp);

    return { timestamp, minutes: Math.abs(testAgainst - closestTimestamp) };
};

const getClosestDiff = ({ earliestTimestamp, timestamps }) => {
    const filteredX = timestamps.filter(t => t !== 'x');
    const minDiff = filteredX.reduce((acc, t) => {
        const diff = calcTimestampDiff(earliestTimestamp, Number(t));
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


function findTimeStamp(buses) {
    const busRecords = buses.reduce((acc, bus, index) => {
        if (bus !== 'x') {
            return [...acc, {
                routeLength: Number(bus),
                offset: index
            }]
        }
        return acc;
    }, [])

    let multiplicator = 1;

    const finalTimestamp = busRecords.reduce((timestamp, busRecord) => {
        const {offset, routeLength} = busRecord;
        let loop = true;

        while (loop) {
            if ((timestamp + offset) % routeLength === 0) {
                multiplicator *= routeLength;
                loop = false;
            } else {
                timestamp += multiplicator;
            }
        }
        return timestamp;
    }, 0);

    return finalTimestamp;
}

const day13Solution = () => {
    const rawInput = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8').split(/\n/);
    const input = {
        earliestTimestamp: Number(rawInput[0]),
        timestamps: rawInput[1].split(',')
    }

    const minDiff = getClosestDiff(input);
    const timestamp = findTimeStamp(input.timestamps, input.timestamps.filter(b => b !== 'x'))

    return {
        part1: minDiff.timestamp * minDiff.minutes,
        part2: timestamp
    }
}

module.exports = {
    day13Solution
}