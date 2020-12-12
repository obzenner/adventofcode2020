'use strict';

const fs = require("fs");
const path = require('path');

const DIRECTIONS = ['left', 'right', 'top', 'bottom', 'diagTopLeft', 'diagTopRight', 'diagBottomLeft', 'diagBottomRight'];

const getLineNumber = (seat, interval) => {
    return Math.ceil(seat / interval);
}

const isValidLine = (testSeat, adjacentSeat, interval) => {
    return getLineNumber(testSeat, interval) === getLineNumber(adjacentSeat, interval);
};

const validator = (seat, adjacentSeat, direction, interval) => {
    let testSeat = null;

    switch (direction) {
        case 'left':
        case 'right':
            testSeat = seat;
            break;
        case 'top':
        case 'bottom':
            testSeat = adjacentSeat;
            break;
        case 'diagTopLeft':
        case 'diagTopRight':
            testSeat = seat - interval;
            break;
        case 'diagBottomLeft':
        case 'diagBottomRight':
            testSeat = seat + interval;
            break;
    };

    return isValidLine(testSeat, adjacentSeat, interval) ? adjacentSeat : null;
}

const nextSeatNumberDirectionRules = (seatNumber, interval) => {
    return {
        left: seatNumber - 1,
        diagTopLeft: seatNumber - 1 - interval,
        diagBottomLeft: seatNumber - 1 + interval,
        right: seatNumber + 1,
        diagTopRight: seatNumber + 1 - interval,
        diagBottomRight: seatNumber + 1 + interval,
        top: seatNumber - interval,
        bottom: seatNumber + interval
    }
};

const getNextSeatIndex = (seatNumber, interval, direction) => {
    const adjacentSeatNumber = nextSeatNumberDirectionRules(seatNumber, interval)[direction];
    return validator(seatNumber, adjacentSeatNumber, direction, interval);
}

// PART 1
const getOccupiedAdjacentSeats = (seats, interval, seatNumber = 1) => {
    const validatedOccupiedAdjacentSeats = DIRECTIONS.reduce((acc, direction) => {
        const validatedSeatNumber = getNextSeatIndex(seatNumber, interval, direction);
        const foundSeat = seats[validatedSeatNumber - 1];
        return foundSeat && foundSeat === '#' ? [...acc, foundSeat] : acc;
    }, [])

    return validatedOccupiedAdjacentSeats;
}

const repopulateSeatsPart1 = (seats, interval) => {
    let newSeats = [];

    while (true) {
        newSeats = seats.reduce((acc, seat, index) => {
            const occupiedSeatsNumber = getOccupiedAdjacentSeats(seats, interval, index + 1).length;
            
            if (seat === 'L' && occupiedSeatsNumber === 0) {
                return [...acc, '#'];
            } else if (seat === '#' && occupiedSeatsNumber >= 4) {
                return [...acc, 'L'];
            }
    
            return [...acc, seat];
        }, [])

        if (JSON.stringify(seats) === JSON.stringify(newSeats)) {
            return newSeats;
        }

        return repopulateSeatsPart1(newSeats, interval);
    }
};


// PART 2
const getVisibleSeatsInDirection = (seats, seatNumber = 40, interval = 10, direction = 'top') => {
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

const repopulateSeatsPart2 = (seats, interval) => {
    let newSeats = [];

    while (true) {
        newSeats = seats.reduce((acc, seat, index) => {
            const seatNumber = index + 1;
            const occupiedSeatsNumber = DIRECTIONS.reduce((a, direction) => {
                const foundSeat = getVisibleSeatsInDirection(seats, seatNumber, interval, direction);
                return foundSeat && foundSeat === '#' ? [...a, foundSeat] : a;
            }, []).length;

            if (seat === 'L' && occupiedSeatsNumber === 0) {
                return [...acc, '#'];
            } else if (seat === '#' && occupiedSeatsNumber >= 5) {
                return [...acc, 'L'];
            }

            return [...acc, seat];
        }, []);

        if (JSON.stringify(seats) === JSON.stringify(newSeats)) {
            return newSeats;
        }

        return repopulateSeatsPart2(newSeats, interval);
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

    console.time();
    const finalSeats = repopulateSeatsPart1(input.seats, input.interval);
    const finalSeatsPart2 = repopulateSeatsPart2(input.seats, input.interval);
    console.timeEnd();

    return {
        part1: finalSeats.filter(s => s === '#').length,
        part2: finalSeatsPart2.filter(s => s === '#').length
    }
}

module.exports = {
    day11Solution
}