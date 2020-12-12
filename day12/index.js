'use strict';

const fs = require("fs");
const path = require('path');

const COORD_VALUES = ['x', 'y']

const returnOppositeCoord = (current) => {
    return COORD_VALUES.find(coord => coord !== current);
}

const setNewCourse = ({degree, course, dir}) => {
    switch (degree) {
        case 0:
        case 360:
            return [...course];
        case 90:
            if (course[0] === 'x') {
                if (dir === 'R') {
                    course[1] = !course[1];
                }
            } else {
                if (dir === 'L') {
                    course[1] = !course[1];
                }
            }
            course[0] = returnOppositeCoord(course[0]);
            return [...course];
        case 270:
            if (course[0] === 'x') {
                if (dir === 'L') {
                    course[1] = !course[1];
                }
            } else {
                if (dir === 'R') {
                    course[1] = !course[1];
                }
            }
            course[0] = returnOppositeCoord(course[0]);
            return [...course];
        case 180:
            course[1] = !course[1];
            return [...course];
        default:
            return [...course];
    }
}

const moveShip = ({coordinates = {x: 0, y: 0}, instr, course = ['x', true]}) => {
    const { navInstr, value } = instr;
    const { x, y } = coordinates;
    let newCoordinates = null;
    let newCourse = null;

    switch (navInstr) {
        case 'E':
            newCoordinates = {...coordinates, x: x + value};
            break;
        case 'S':
            newCoordinates = {...coordinates, y: y - value};
            break;
        case 'W':
            newCoordinates = {...coordinates, x: x - value};
            break;
        case 'N':
            newCoordinates = {...coordinates, y: y + value};
            break;
        case 'R':
        case 'L':
            newCourse = setNewCourse({degree: value, course, dir: navInstr});
            break;
        case 'F':
            const goStraight = course[1]
            const currentPosition = coordinates[course[0]];
            newCoordinates = {...coordinates};
            newCoordinates[course[0]] = goStraight ? currentPosition + value : currentPosition - value;
            break;
    };

    return {
        coordinates: newCoordinates || {...coordinates},
        course: newCourse || [...course]
    }
}

const getFinalDestination = (navInstrs) => {
    const initialState = {
        coordinates: {x: 0, y: 0},
        instr: navInstrs[0],
        course: ['x', true]
    };

    const finalDestination = navInstrs.reduce((acc, navInstr) => {
        if (!Object.keys(acc).length) {
            return initialState;
        }

        const {coordinates, course} = moveShip(acc);

        return {
            coordinates: coordinates,
            instr: navInstr,
            course: course
        };
    }, {});

    return moveShip(finalDestination);
}

const day12Solution = () => {
    console.log('DAY 12')
    const rawInput = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8');
    const navigationInstructions = rawInput.split(/\n/).reduce((acc, instr) => {
        return [...acc, {
            navInstr: instr[0],
            value: Number(instr.substring(1, instr.length))
        }];
    }, [])

    const { coordinates } = getFinalDestination(navigationInstructions);

    return {
        part1: Math.abs(coordinates.x) + Math.abs(coordinates.y),
        part2: null
    }
}

module.exports = {
    day12Solution
}