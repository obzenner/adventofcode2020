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

module.exports = {
    separateByEmptyLine
}