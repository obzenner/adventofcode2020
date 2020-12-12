'use strict';

const fs = require("fs");
const path = require('path');


const getLineNumber = (seatNumber, interval) => {
    return Math.ceil(seatNumber / interval);
}

const isValidLine = (currentSeat, adjacentSeat, interval) => {
    return getLineNumber(currentSeat, interval) === getLineNumber(adjacentSeat, interval);
};

const validator = (seatNumber, adjacentSeat, direction, interval) => {
    let currentSeatNumber = null;

    switch (direction) {
        case 'left':
        case 'right':
            currentSeatNumber = seatNumber;
            break;
        case 'top':
        case 'bottom':
            currentSeatNumber = adjacentSeat;
            break;
        case 'diagonalTopLeft':
        case 'diagonalTopRight':
            currentSeatNumber = seatNumber - interval;
            break;
        case 'diagonalBottomLeft':
        case 'diagonalBottomRight':
            currentSeatNumber = seatNumber + interval;
            break;
    };

    return isValidLine(currentSeatNumber, adjacentSeat, interval) ? adjacentSeat : null;
}

const nextSeatNumberDirectionRules = (seatNumber, interval) => {
    return {
        left: seatNumber - 1,
        diagonalTopLeft: seatNumber - 1 - interval,
        diagonalBottomLeft: seatNumber - 1 + interval,
        right: seatNumber + 1,
        diagonalTopRight: seatNumber + 1 - interval,
        diagonalBottomRight: seatNumber + 1 + interval,
        top: seatNumber - interval,
        bottom: seatNumber + interval
    }
};

const getNextSeatIndex = (seatNumber, interval, direction) => {
    const adjacentSeat = nextSeatNumberDirectionRules(seatNumber, interval)[direction];
    return validator(seatNumber, adjacentSeat, direction, interval);
}

// PART 1
const getAdjacentSeats = (seats, interval, seatNumber = 1) => {
    const directions = Object.keys(nextSeatNumberDirectionRules());

    const validatedAdjacentSeats = directions.reduce((acc, direction) => {
        const validatedSeat = getNextSeatIndex(seatNumber, interval, direction);
        acc = [...acc, seats[validatedSeat - 1]]
        return acc;
    }, [])

    return validatedAdjacentSeats;
}

const repopulateSeatsPart1 = (seats, interval) => {
    let newSeats = [];

    while (true) {
        newSeats = seats.reduce((acc, seat, index) => {
            const adjacentSeats = getAdjacentSeats(seats, interval, index + 1);
            const hasOccupiedSeats = adjacentSeats.filter(s => s === '#');
            
            if (seat === 'L' && hasOccupiedSeats.length === 0) {
                return [...acc, '#'];
            } else if (seat === '#' && hasOccupiedSeats.length >= 4) {
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
    const directions = Object.keys(nextSeatNumberDirectionRules());
    let newSeats = [];

    while (true) {
        newSeats = seats.reduce((acc, seat, index) => {
            const seatNumber = index + 1;
            const allVisibleSeats = directions.reduce((a, direction) => {
                const foundSeat = getVisibleSeatsInDirection(seats, seatNumber, interval, direction);
                if (foundSeat) {
                    a = [...a, foundSeat];
                }
                return a;
            }, [])
            const occupiedSeats = allVisibleSeats.filter(seat => seat === '#');

            if (seat === 'L' && occupiedSeats.length === 0) {
                return [...acc, '#'];
            } else if (seat === '#' && occupiedSeats.length >= 5) {
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