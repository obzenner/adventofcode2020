'use strict';

const fs = require("fs");
const path = require('path');


const getCubeID = (x, y, z) => {
    return `${x}${y}${z}`;
}
const getInitCoordinates = (cubes, size = 3) => {
    let y = 0;

    return cubes.reduce((acc, cube, i) => {
        if (i % size === 0) y += 1;   
        const cubeObj = { status: cube, coords: {x: i % size, y: y - 1, z: 0} };
        acc.set(getCubeID(i % size, y - 1, 0), cubeObj);
        return acc;
    }, new Map());
};

const getPossibleXY = (x, y) => [
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

const getCube = ({ x, y, z }, plainDepth = 1, zDepth = 1, neighbours = []) => {
    const self = {x, y, z};

    for (let i = -zDepth; i <= zDepth; i++) {
        const zCoord = z + i;
        for (let j = 0; j < plainDepth; j++) {
            const ln = { x: x - 1 - j, y, z: zCoord};
            const rn = { x: x + 1 + j, y, z: zCoord};
            const bn = { x, y: y + 1 + j, z: zCoord};
            const tn = { x, y: y - 1 - j, z: zCoord};
            const tln = { x: x - 1 - j, y: y - 1 - j, z: zCoord};
            const trn = { x: x + 1 + j, y: y - 1 - j, z: zCoord};
            const bln = { x: x - 1 - j, y: y + 1 + j, z: zCoord};
            const brn = { x: x + 1 + j, y: y + 1 + j, z: zCoord};
            neighbours = [...neighbours, ln, rn, bn, tn, tln, trn, bln, brn];
        }
    }

    return [...neighbours, self];
}

const getNextStatus = (status, numberOfActiveNeighbours) => {
    if (status === '#' && (numberOfActiveNeighbours === 2 || numberOfActiveNeighbours === 3)) return '#';
    else if (status === '.' && numberOfActiveNeighbours === 3) return '#';
    else return '.';
}

const getNeighbours = (cube, cubes) => {
    const cubeId = cube[0];
    const { coords, status } = cube[1];
    const { x, y, z } = coords;
    const theCube = getCube({ x, y, z });

    let numberOfActiveNeighbours = 0;
    const expandedCubes = theCube.reduce((acc, gCube) => {
        const { x, y, z } = gCube;
        const gId = getCubeID(x, y, z);
        const exists = cubes.get(gId);
        const isSelf = cubeId === gId;

        if (exists) {
            if (!isSelf && exists.status === '#') numberOfActiveNeighbours += 1;
            return acc;
        } else acc.set(gId, { status: '.', coords: { x, y, z}});
        return acc;
    }, new Map([...cubes]));

    const nextStatusForCube = getNextStatus(status, numberOfActiveNeighbours);
    // expandedCubes.set(cubeId, { status: nextStatusForCube, coords: { x, y, z }});

    return {
        expandedCubes,
        nextStatusCube: {
            cubeId,
            nextStatusForCube
        }
    };
}

const runCycles = (cubes, currentCycle = 1, maxNumberOfCycles = 1) => {
    while (currentCycle <= maxNumberOfCycles) {
        let cubesToSimultaneouslyUpdate = [];

        const newCubes = [...cubes].reduce((acc, currentCube) => {
            const { expandedCubes, nextStatusCube } = getNeighbours(currentCube, acc);
            acc = expandedCubes;
            cubesToSimultaneouslyUpdate = [...cubesToSimultaneouslyUpdate, nextStatusCube];
            return acc;
        }, new Map([...cubes]));

        
        cubesToSimultaneouslyUpdate.forEach(({cubeId, nextStatusForCube}) => {
            const { coords } = newCubes.get(cubeId);
            newCubes.set(cubeId, { status: nextStatusForCube, coords })
        });
        
        console.log(newCubes)
        return runCycles(newCubes, currentCycle + 1)
    }

    return cubes;
};

const day17Solution = () => {
    const initCubes = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8')
        .split(/\n/).reduce((acc, l) => {
            const cubes = l.split('');
            return [...acc, ...cubes];
        }, []);

    const cubes = getInitCoordinates(initCubes, 3);
    const newCubes = runCycles(cubes);
    let nOfActive = 0;
    newCubes.forEach((v, k) => {
        if (v.status === '#') {
            nOfActive += 1;
        }
    });
    console.log(nOfActive)

    return {
        part1: null,
        part2: null
    }
}

module.exports = {
    day17Solution
}