'use strict';

const fs = require("fs");
const path = require('path');


const getCubeID = (status, x, y) => {
    return `${status}${x}${y}`;
}
const getInitCoordinates = (cubes, size = 3) => {
    let y = 0;

    return cubes.reduce((acc, cube, i) => {
        if (i % size === 0) y += 1;   
        const cubeObj = { status: cube, coords: {x: y - 1, y: i % size}};
        acc.set(getCubeID(cube, y - 1, i % size), cubeObj);
        return acc;
    }, new Map());
};

const getNextCubeStatus = (isActive, numberOfActiveNeighbours) => {
    if (isActive && (numberOfActiveNeighbours === 2 || numberOfActiveNeighbours === 3)) {
        return '#';
    } else {
        return '.';
    }
}

const getNeighbours = (cubeId, cube, cubeZ = 0, visibleGrid) => {
    const {status, coords} = cube;
    const isActive = status === '#';

    const { x, y } = coords;
    const possibleZ = [cubeZ, cubeZ - 1, cubeZ + 1];
    const possibleXY = [
        {x, y},
        {x: x - 1, y},
        {x: x + 1, y},
        {x, y: y - 1},
        {x, y: y + 1},
        {x: x - 1, y: y - 1},
        {x: x - 1, y: y + 1},
        {x: x + 1, y: y - 1},
        {x: x + 1, y: y + 1}
    ];
    const possibleX = possibleXY.map(v => v.x);
    const possibleY = possibleXY.map(v => v.y);
    const generatedInactiveCubes = possibleXY.reduce((acc, coords) => {
        const cube = { status: '.', coords };
        acc.set(getCubeID(status, coords.x, coords.y), cube);
        return acc;
    }, new Map());

    const allNeighbours = new Map();
    for (let i = 0; i < possibleZ.length; i++) {
        const zIndex = possibleZ[i];
        const isSameZ = zIndex === cubeZ;
        const visibleCubes = visibleGrid.get(zIndex);

        if (visibleCubes) {
            let visibleNeighbours = new Map();
            let invisibleNeighbours = new Map();

            visibleCubes.forEach((vc, key) => {
                const sameCube = isSameZ && key === cubeId;
                if (!sameCube && possibleX.includes(vc.coords.x) && possibleY.includes(vc.coords.y)) {
                    visibleNeighbours.set(key, vc);
                }
            });

            generatedInactiveCubes.forEach((gc, key) => {
                const sameCube = isSameZ && key === cubeId;
                const isVisibleNeighbour = visibleNeighbours.has(key);
                if (!sameCube && !isVisibleNeighbour) {
                    invisibleNeighbours.set(key, gc)
                }
            });
            allNeighbours.set(zIndex, new Map([...visibleNeighbours, ...invisibleNeighbours]));
        } else {
            allNeighbours.set(zIndex, [...generatedInactiveCubes]);
        }
    }
    
    let numberOfActiveNeighbours = 0;
    const newVisibleGrid = new Map();
    
    allNeighbours.forEach((v, k) => {
        const numberOfActive = [...v].filter(c => c[1].status === '#').length;
        numberOfActiveNeighbours += numberOfActive;

        const visibleGridValue = visibleGrid.get(k);
        const newIterGridValue = visibleGridValue ? new Map([...v].concat([...visibleGridValue])) : new Map([...v]);
        newVisibleGrid.set(k, newIterGridValue);
    });

    const nextCubeStatus = getNextCubeStatus(isActive, numberOfActiveNeighbours);
    newVisibleGrid.get(0).set(getCubeID(nextCubeStatus, coords.x, coords.y), {status: nextCubeStatus, coords});

    return newVisibleGrid;
};

const day17Solution = () => {
    const initGrid = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8')
        .split(/\n/).reduce((acc, l) => {
            const cubes = l.split('');
            return [...acc, ...cubes];
        }, []);

    const visibleGrid = new Map();
    visibleGrid.set(0, getInitCoordinates(initGrid, 3));
    const testCubeValues = visibleGrid.get(0).get('.00');
    const test = getNeighbours('.00', testCubeValues, 0, visibleGrid);
    
    const runCycle = (grid) => {
        //let finalGrid = grid;
        // finalGrid.forEach((g, zIndex) => {
        //     g.forEach((cube, cubeId) => {
        //         finalGrid = getNeighbours(cubeId, cube, zIndex, finalGrid);
        //     });
        // });

        const test = [...grid].reduce((acc, g) => {
            const zIndex = g[0];
            const zLevel = g[1];

            zLevel.forEach((cube, cubeId) => {
                acc = getNeighbours(cubeId, cube, zIndex, acc);
            });

            return acc;
        }, grid);
    };

    runCycle(visibleGrid)

    return {
        part1: null,
        part2: null
    }
}

module.exports = {
    day17Solution
}