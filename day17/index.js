'use strict';

const fs = require("fs");
const path = require('path');

const getInitActiveCubes = (cubes, size = 3) => {
    let y = 0;
    return cubes.reduce((acc, cube, i) => {
        if (i % size === 0) y += 1;   
        if (cube === '.') return acc;
        const cubeObj = { status: cube, coords: {x: i % size, y: y - 1, z: 0, w: 0}, neighbours: new Map() };
        acc.set(getCubeID(i % size, y - 1, 0, 0), cubeObj);
        return acc;
    }, new Map());
};

const getCubeID = (x, y, z, w) => {
    return `${x}${y}${z}${w}`;
}

const getCube = ({ x, y, z, w }, plainDepth = 1, zDepth = 1, wDepth = 0, neighbours = []) => {
    
    for (let l = -wDepth; l <= wDepth; l++) {
        const wCoord = w + l;
        for (let i = -zDepth; i <= zDepth; i++) {
            const zCoord = z + i;
            for (let j = 0; j < plainDepth; j++) {
                const center = {x, y, z: zCoord, w: wCoord};
                const ln = { x: x - 1 - j, y, z: zCoord, w: wCoord};
                const rn = { x: x + 1 + j, y, z: zCoord, w: wCoord};
                const bn = { x, y: y + 1 + j, z: zCoord, w: wCoord};
                const tn = { x, y: y - 1 - j, z: zCoord, w: wCoord};
                const tln = { x: x - 1 - j, y: y - 1 - j, z: zCoord, w: wCoord};
                const trn = { x: x + 1 + j, y: y - 1 - j, z: zCoord, w: wCoord};
                const bln = { x: x - 1 - j, y: y + 1 + j, z: zCoord, w: wCoord};
                const brn = { x: x + 1 + j, y: y + 1 + j, z: zCoord, w: wCoord};
                neighbours = [...neighbours, center, ln, rn, bn, tn, tln, trn, bln, brn];
            }
        }
    }

    return [...neighbours];
}

const evalStatus = (status, numberOfActiveNeighbours) => {
    const shouldRemainActive = status === '#' && (numberOfActiveNeighbours === 2 || numberOfActiveNeighbours === 3);
    const shouldBecomeActive = status === '.' && numberOfActiveNeighbours === 3;
    if (shouldRemainActive || shouldBecomeActive) return '#';
    else return '.'
}

const getNewCubes = (cubes, zDepth = 1, wDepth = 0) => {
    let updatedState = new Map([...cubes]);

    cubes.forEach((v, cubeId) => {
        const { coords, status } = v;
        const { x, y, z, w } = coords;
        const neighboursCube = getCube({ x, y, z, w }, 1, zDepth, wDepth);
       
        let newNeighbours = new Map();
        neighboursCube.forEach(pC => {
            const { x, y, z, w } = pC;
            const pCId = getCubeID(x, y, z, w);
            const exists = cubes.get(pCId);
            const isSelf = cubeId === pCId;

            if (isSelf) {
                return;
            }

            if (exists) {
                newNeighbours.set(pCId, exists)
            } else {
                const newRec = { status: '.', coords: { x, y, z, w }, neighbours: new Map() };
                newNeighbours.set(pCId, newRec)
                updatedState.set(pCId, newRec);
            }
        });

        updatedState.set(cubeId, { status, coords, neighbours: newNeighbours });
    });

    return updatedState;
}

const setNewState = (cubes) => {
    cubes.forEach((cube, cubeId) => {
        const { status, coords, neighbours } = cube;
        let numberOfActive = 0;

        neighbours.forEach((n) => {
            if (n.status === '#') numberOfActive++;
        });

        const newStatusForCube = evalStatus(status, numberOfActive);
    
        if (newStatusForCube === '.') {
            cubes.delete(cubeId);
        } else {
            cubes.set(cubeId, { status: newStatusForCube, coords, neighbours: new Map()});
        }
    });

    return cubes;
}

const runCycles = (cubes, zDepth = 1, wDepth = 0, currentCycle = 1, maxNumberOfCycles = 6) => {
    const initCubesWithNeighbours = getNewCubes(cubes, zDepth, wDepth);
    
    while (currentCycle <= maxNumberOfCycles) {
        const newCubes = getNewCubes(initCubesWithNeighbours, zDepth, wDepth);
        const newStateForCubes = setNewState(newCubes);
        return runCycles(newStateForCubes, zDepth, wDepth, currentCycle + 1)
    }
    return cubes.size;
};

const day17Solution = () => {
    const initCubes = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8')
        .split(/\n/).reduce((acc, l) => {
            const cubes = l.split('');
            return [...acc, ...cubes];
        }, []);

    const initActiveCubes = getInitActiveCubes(initCubes, 3);

    const numberOfActiveCubes = (cubes) => runCycles(cubes);
    const numberOfActiveCubesPt2 = (cubes) => runCycles(cubes);


    return {
        part1: numberOfActiveCubes(initActiveCubes),
        // part2: numberOfActiveCubesPt2(initActiveCubes)
    }
}

module.exports = {
    day17Solution
}