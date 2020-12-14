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

// PART2 SIEVE
function findTimeStamp(busRecords) {
    let time = 0n;
    let step = 1n;

    for (let i = 0; i < busRecords.length; i++) {
        const { offset, routeLength } = busRecords[i];
        while ((time + offset) % routeLength) {
            time += step;
        }
        step *= routeLength;
    }

    return time;
}


// PART2 CRT
const modInverse = (a, m) => {
    let g = gcd(a, m);

    if (g != 1n) {
        console.log("No Inverse");
    } else {
        return power(a, m - 2n, m)
    }
}

const power = (x, y, m) => {
    if (y === 0n) return 1n;

    let p = power(x, y / 2n, m) % m;
    p = (p * p) % m;

    if (y % 2n === 0n) return p;
    else return ((x * p) % m);
}

const gcd = (a, b) => {
    if (a === 0n) return b;
    return gcd(b % a, a)
}

const chineseRemainderSolution = (pairs) => {
    const N = pairs.reduce((acc, p) => {
        return acc * p[0];
    }, 1n);

    const Ni = pairs.map(pair => N / pair[0]);
    const b = pairs.map((pair, i) => pair[1] === 0n ? 0n : pair[0] - pair[1]);
    const x = pairs.map((item, i) => modInverse(Ni[i], item[0]))
    const bnx = Ni.map((item, i) => item * b[i] * x[i])
    const sum = bnx.reduce((acc, cur) => acc + cur)

    return sum - (sum / N) * N
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

    const minDiff = getClosestDiff({ earliestTimestamp, timestamps });
    const sieveTimestamp = findTimeStamp(timestamps
        .map(b => {
            return {
                routeLength: BigInt(b.routeLength),
                offset: BigInt(b.offset)
            };
    }))
    const chineseTheorem = chineseRemainderSolution(rawInput[1].split(",").reduce((acc, v, i) => {
        if (v !== 'x') {
            acc = [...acc, [BigInt(v), BigInt(i)]]
        }
        return acc;
    }, []));

    return {
        part1: minDiff.timestamp * minDiff.minutes,
        part2: chineseTheorem,
        part2Sieve: sieveTimestamp
    }
}

module.exports = {
    day13Solution
}