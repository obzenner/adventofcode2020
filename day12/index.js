'use strict';

const fs = require("fs");
const path = require('path');

const COORD_VALUES = ['x', 'y']

const returnOppositeCoord = (current) => {
    return COORD_VALUES.find(coord => coord !== current);
}

// PART 1
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
            course
        };
    }, {});

    return moveShip(finalDestination);
}

// PART2
const setNewCourseWithWP = ({degree, course, dir}) => {
    const { wx, wy } = course[2];
    let wpCoords = null;

    switch (degree) {
        case 0:
        case 360:
            return [...course];
        case 90:
            if (course[0] === 'x') {
                if (dir === 'R') {
                    // y coord becomes -x coord, x coord becomes y coord
                    course[1] = !course[1];
                    wpCoords = {wx: wy, wy: -wx};
                } else if (dir === 'L') {
                    // y coord becomes x coord, x cord becomes -y coord
                    wpCoords = {wx: -wy, wy: wx};
                }
            } else {
                if (dir === 'L') {
                    // x coord becomes -y coord, y coord becomes x coord
                    course[1] = !course[1];
                    wpCoords = {wx: -wy, wy: wx};
                } else if (dir === 'R') {
                    // x coord becomes y coord, y coord becomes -x coord
                    wpCoords = {wx: wy, wy: -wx};
                }
            }
            course[0] = returnOppositeCoord(course[0]);
            course[2] = wpCoords;
            return [...course];
        case 270:
            if (course[0] === 'x') {
                if (dir === 'L') {
                    // y coord becomes -x coord, x coord becomes y coord
                    course[1] = !course[1];
                    wpCoords = {wx: wy, wy: -wx};
                } else if (dir == 'R') {
                    // y coord becomes x coord, x coord becomes -y coord
                    wpCoords = {wx: -wy, wy: wx};
                }
            } else {
                if (dir === 'R') {
                    // x coord becomes -y coord, y coord becomes x coord
                    course[1] = !course[1];
                    wpCoords = {wx: -wy, wy: wx};
                } else if (dir === 'L') {
                     // x coord becomees y coord, y coord becomes -x coord
                     wpCoords = {wx: wy, wy: -wx};
                }
            }
            course[0] = returnOppositeCoord(course[0]);
            course[2] = {...wpCoords};
            return [...course];
        case 180:
            wpCoords = {wx: -wx, wy: -wy};
            course[2] = {...wpCoords};
            course[1] = !course[1];
            return [...course];
        default:
            return [...course];
    }
}

const moveShipWithWayPoint = ({coordinates = {x: 0, y: 0}, instr, course = ['x', true, {wx: 10, wy: 1}]}) => {
    const { navInstr, value } = instr;
    const { x, y } = coordinates;
    const { wx, wy } = course[2];
    let newWPCoordinates = null;
    let newShipCoordinates = null;
    let newCourse = null;


    switch (navInstr) {
        case 'E':
            newWPCoordinates = {wy, wx: wx + value};
            course[2] = newWPCoordinates;
            break;
        case 'S':
            newWPCoordinates = {wx, wy: wy - value};
            course[2] = newWPCoordinates;
            break;
        case 'W':
            newWPCoordinates = {wy, wx: wx - value};
            course[2] = newWPCoordinates;
            break;
        case 'N':
            newWPCoordinates = {wx, wy: wy + value};
            course[2] = newWPCoordinates;
            break;
        case 'R':
        case 'L':
            newCourse = setNewCourseWithWP({degree: value, course, dir: navInstr});
            break;
        case 'F':
            newShipCoordinates = {x: x + value*wx, y: y + value*wy};
            break;
    };

    return {
        coordinates: newShipCoordinates || {...coordinates},
        course: newCourse || [...course]
    }
}

const getFinalDestinationWithWaypoint = (navInstrs) => {
    const initialState = {
        coordinates: {x: 0, y: 0},
        instr: navInstrs[0],
        course: ['x', true, { wx: 10, wy: 1}]
    };

    const finalDestination = navInstrs.reduce((acc, navInstr) => {
        if (!Object.keys(acc).length) {
            return initialState;
        }

        const {coordinates, course} = moveShipWithWayPoint(acc);

        return {
            coordinates: coordinates,
            instr: navInstr,
            course: course
        };
    }, {});

    return moveShipWithWayPoint(finalDestination);
}

const day12Solution = () => {
    const rawInput = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8');
    const navigationInstructions = rawInput.split(/\n/).reduce((acc, instr) => {
        return [...acc, {
            navInstr: instr[0],
            value: Number(instr.substring(1, instr.length))
        }];
    }, [])

    const { coordinates } = getFinalDestination(navigationInstructions);
    const withWaypoint = getFinalDestinationWithWaypoint(navigationInstructions);

    return {
        part1: Math.abs(coordinates.x) + Math.abs(coordinates.y),
        part2: Math.abs(withWaypoint.coordinates.x) + Math.abs(withWaypoint.coordinates.y)
    }
}

module.exports = {
    day12Solution
}