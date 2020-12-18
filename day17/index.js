'use strict';

const fs = require("fs");
const path = require('path');

const getInitActiveCubes = (cubes, size = 3) => {
    let y = 0;

    return cubes.reduce((acc, cube, i) => {
        if (i % size === 0) y += 1;   
        const cubeObj = { status: cube, coords: {x: i % size, y: y - 1, z: 0}, neighbours: [] };
        acc.set(getCubeID(i % size, y - 1, 0), cubeObj);
        return acc;
    }, new Map());
};

const getCubeID = (x, y, z) => {
    return `${x}${y}${z}`;
}

const getCube = ({ x, y, z }, plainDepth = 1, zDepth = 1, neighbours = []) => {
    
    for (let i = -zDepth; i <= zDepth; i++) {
        const zCoord = z + i;
        for (let j = 0; j < plainDepth; j++) {
            const center = {x, y, z: zCoord};
            const ln = { x: x - 1 - j, y, z: zCoord};
            const rn = { x: x + 1 + j, y, z: zCoord};
            const bn = { x, y: y + 1 + j, z: zCoord};
            const tn = { x, y: y - 1 - j, z: zCoord};
            const tln = { x: x - 1 - j, y: y - 1 - j, z: zCoord};
            const trn = { x: x + 1 + j, y: y - 1 - j, z: zCoord};
            const bln = { x: x - 1 - j, y: y + 1 + j, z: zCoord};
            const brn = { x: x + 1 + j, y: y + 1 + j, z: zCoord};
            neighbours = [...neighbours, center, ln, rn, bn, tn, tln, trn, bln, brn];
        }
    }

    return [...neighbours];
}

const evalStatus = (status, numberOfActiveNeighbours) => {
    if (status === '#' && (numberOfActiveNeighbours === 2 || numberOfActiveNeighbours === 3)) return '#';
    else if (status === '.' && numberOfActiveNeighbours === 3) return '#';
    else return '.';
}

const getNewCubes = (cubes) => {
    let updatedState = new Map([...cubes]);

    cubes.forEach((v, cubeId) => {
        const { coords, status } = v;
        const { x, y, z } = coords;
        const neighboursCube = getCube({ x, y, z });

        let newNeighbours = new Map();
        updatedState = [...neighboursCube].reduce((acc, pC) => {
            const { x, y, z } = pC;
            const pCId = getCubeID(x, y, z);
            const exists = cubes.get(pCId);
            const cubeStatus = exists ? exists.status : '.';
            const isSelf = cubeId === pCId;

            if (!isSelf) {
                newNeighbours.set(pCId, { status: cubeStatus, coords: { x, y, z }})
            }

            if (!exists && !isSelf) {
                acc.set(pCId, { status: cubeStatus, coords: { x, y, z }, neighbours: new Map() })
            }
            return acc;
        }, updatedState);
        updatedState.set(cubeId, { status, coords, neighbours: newNeighbours });
    });

    return updatedState;
}

const setNewState = (cubes) => {
    cubes.forEach((cube, cubeId) => {
        const { status, coords, neighbours } = cube;
        let numberOfActive = 0;

        neighbours.forEach((n) => {
            if (n.status === '#') numberOfActive++
        });
        const newStatusForCube = evalStatus(status, numberOfActive);
        cubes.set(cubeId, { status: newStatusForCube, coords, neighbours})
    });

    return new Map([...cubes]);
}

const runCycles = (cubes, currentCycle = 1, maxNumberOfCycles = 6) => {
    while (currentCycle <= maxNumberOfCycles) {
        const newCubes = getNewCubes(cubes);
        const newStateForCubes = setNewState(newCubes);
        return runCycles(newStateForCubes, currentCycle + 1)
    }
    return cubes;
};

const day17Solution = () => {
    const initCubes = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8')
        .split(/\n/).reduce((acc, l) => {
            const cubes = l.split('');
            return [...acc, ...cubes];
        }, []);

    // only ever check active cubes?
    const cubes = getInitActiveCubes(initCubes, 3);
    const initState = getNewCubes(cubes);
    const initGameOfLifeState = getNewCubes(initState);

    const newStateForCubes = runCycles(initGameOfLifeState);

    let meh = 0;
    newStateForCubes.forEach((v) => {
        if (v.status === '#') meh++;
    })
    console.log(meh)

    return {
        part1: null,
        part2: null
    }
}

module.exports = {
    day17Solution
}