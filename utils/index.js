'use strict';

const separateByEmptyLine = (input) => {
    let itemIndex = 0;
    let items = [];

    for (let i = 0; i < input.length; i++) {
        const line = input[i];
        if (!items[itemIndex]) {
            items[itemIndex] = [];
        }
        if (line !== '') {
            const fields = line.split(' ').map(f => {
                const field = f.split(':');
                return field;
            });
            items[itemIndex] = [...items[itemIndex], ...fields];
        } else {
            itemIndex++;
        }
    }

    return items;
}

const intersection = (array) => {
    return array.reduce((a, b) => a.filter(v => b.includes(v)));
};

const getUniqueValues = (array) => {
    return [...new Set(array)];
}

const swapByIndex = (arr, x, y) => [arr[x],arr[y]] = [arr[y],arr[x]];

// permutations Heap's algo
const heapsPermutations = inputArray => {
    let result = [];

    const generate = (length, heapArray) => {
        const lastIndex = length - 1;

        if (length === 1) {
            result = [...result, [...heapArray]];
            return;
        }

        generate(lastIndex, heapArray);

        for (let i = 0; i < lastIndex; i++) {
            if (length % 2 === 0) {
                swapByIndex(heapArray, i, lastIndex);
            } else {
                swapByIndex(heapArray, 0, lastIndex);
            }

            generate(lastIndex, [...heapArray]);
        }
    };

    generate(inputArray.length, [...inputArray]);

    return result;
}

// factorial
const numberOfPermutations = array => array.reduce((acc, e, i) => acc * (array.length - i), 1);


module.exports = {
    separateByEmptyLine,
    getUniqueValues,
    intersection,
    numberOfPermutations,
    swapByIndex,
    heapsPermutations
}