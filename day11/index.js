'use strict';

const fs = require("fs");
const path = require('path');


const getLineNumber = (seatNumber, interval) => {
    return Math.ceil(seatNumber / interval);
}

const isSameLine = (currentSeat, adjacentSeat, interval) => {
    return getLineNumber(currentSeat, interval) === getLineNumber(adjacentSeat, interval);
};

const validator = (seatNumber, adjacentSeat, direction, interval) => {
    switch (direction) {
        case 'left':
        case 'right':
            return isSameLine(seatNumber, adjacentSeat, interval) ? adjacentSeat : null;
        case 'top':
        case 'bottom':
            return adjacentSeat;
        case 'diagonalTopLeft':
        case 'diagonalTopRight':
            return isSameLine(seatNumber - interval, adjacentSeat, interval) ? adjacentSeat : null;
        case 'diagonalBottomLeft':
        case 'diagonalBottomRight':
            return isSameLine(seatNumber + interval, adjacentSeat, interval) ? adjacentSeat : null;
    };
}

const getAdjacentSeats = (seats, interval, seatNumber = 1) => {
    const adjacentSeatNumbers = {
        left: seatNumber - 1,
        diagonalTopLeft: seatNumber - interval - 1,
        diagonalBottomLeft: seatNumber + interval - 1,
        right: seatNumber + 1,
        diagonalTopRight: seatNumber - interval + 1,
        diagonalBottomRight: seatNumber + interval + 1,
        top: seatNumber - interval,
        bottom: seatNumber + interval
    };

    const validatedAdjacentSeats = Object.keys(adjacentSeatNumbers).reduce((acc, key) => {
        const validatedSeat = validator(seatNumber, adjacentSeatNumbers[key], key, interval);
        acc[key] = validatedSeat;
        return acc;
    }, {})

    const adjacentSeats = Object.keys(validatedAdjacentSeats).reduce((acc, seatKey) => {
        const seatIndex = validatedAdjacentSeats[seatKey] - 1;
        acc[seatKey] = seats[seatIndex];
        return acc;
    }, {});

    return adjacentSeats;
}

const repopulateSeats = (seats, interval, numberOfAdjustments = 0) => {
    let newSeats = [];

    while (true) {
        newSeats = [...seats.reduce((acc, seat, index) => {
            const adjacentSeats = getAdjacentSeats(seats, interval, index + 1);
            const hasOccupiedSeats = Object.keys(adjacentSeats).reduce((a, key) => {
                const seatValue = adjacentSeats[key];
                    return seatValue === '#' ? [...a, seatValue] : a;
            }, []);
    
            if (seat === 'L' && hasOccupiedSeats.length === 0) {
                numberOfAdjustments++;
                return [...acc, '#'];
            } else if (seat === '#' && hasOccupiedSeats.length >= 4) {
                numberOfAdjustments++;
                return [...acc, 'L'];
            } else {
                acc = [...acc, seat];
            }
    
            return acc;
        }, [])]

        if (numberOfAdjustments === 0) {
            return newSeats;
        }

        return repopulateSeats(newSeats, interval, 0);
    }
};


const nextSeatNumberDirectionRules = (seatNumber, interval) => {
    return {
        left: seatNumber - 1,
        diagonalTopLeft: seatNumber - interval - 1,
        diagonalBottomLeft: seatNumber + interval - 1,
        right: seatNumber + 1,
        diagonalTopRight: seatNumber - interval + 1,
        diagonalBottomRight: seatNumber + interval + 1,
        top: seatNumber - interval,
        bottom: seatNumber + interval
    }
};


const getNextSeatIndex = (seatNumber, interval, direction) => {
    const adjacentSeat = nextSeatNumberDirectionRules(seatNumber, interval)[direction];
    return validator(seatNumber, adjacentSeat, direction, interval);
}

const findVisibleSeatsInDirection = (seats, seatNumber = 40, interval = 10, direction = 'top') => {
    let startSeat = seatNumber;
    let firstFoundSeat = null

    while (true) {
        // here we calc index based on direction as before
        const nextSeatIndex = getNextSeatIndex(startSeat, interval, direction);
        const nextSeat = seats[nextSeatIndex - 1];

        if (['L', '#'].includes(nextSeat)) {
            firstFoundSeat = nextSeat
        } else {
            startSeat = getNextSeatIndex(startSeat, interval, direction);
        };

        if (firstFoundSeat || !nextSeat) {
            return firstFoundSeat;
        }
    }
}

const repopulateSeatsPart2 = (seats, interval, numberOfAdjustments = 0) => {
    const directions = Object.keys(nextSeatNumberDirectionRules());
    let newSeats = [];

    while (true) {
        newSeats = [...seats].reduce((acc, seat, index) => {
            const seatNumber = index + 1;
            const allVisibleSeats = directions.reduce((a, direction) => {
                const foundSeat = findVisibleSeatsInDirection(seats, seatNumber, interval, direction);
                if (foundSeat) {
                    a = [...a, foundSeat];
                }
                return a;
            }, [])
            const occupiedSeats = allVisibleSeats.filter(seat => seat === '#');

            if (seat === 'L' && occupiedSeats.length === 0) {
                numberOfAdjustments++;
                return [...acc, '#'];
            } else if (seat === '#' && occupiedSeats.length >= 5) {
                numberOfAdjustments++;
                return [...acc, 'L'];
            } else {
                acc = [...acc, seat];
            }

            return acc;
        }, []);

        if (numberOfAdjustments === 0) {
            return newSeats;
        }

        return repopulateSeatsPart2(newSeats, interval, 0);
    }
}

const day11Solution = () => {
    console.log('DAY 11')
    const rawInput = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8');
    const seats = rawInput.split(/\n/);
    const input = seats.reduce((acc, row) => {
        const { interval, seats } = acc;

        if (!interval) {
            acc.interval = row.length;
        }
        
        acc.seats = seats ? [...seats, ...row.split('')] : [...row.split('')];

        return acc;

    }, {});

    const finalSeats = repopulateSeats(input.seats, input.interval);
    const finalSeatsPart2 = repopulateSeatsPart2(input.seats, input.interval);

    console.log(finalSeatsPart2.filter(s => s === '#').length)
    return {
        part1: finalSeats.filter(s => s === '#').length,
        part2: null
    }
}

module.exports = {
    day11Solution
}