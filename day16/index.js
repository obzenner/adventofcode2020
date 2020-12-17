'use strict';

const fs = require("fs");
const path = require('path');

const getSetOfNumbers = (n, k) => {
    let newSet = new Set();
    for (let i = n; i <= k; i++) {
        newSet.add(i);
    };
    return newSet;
}


// PART 1
const isValueValid = (v, ticketsRules) => {
    let isValid = false;
    ticketsRules.forEach((set) => {
        if (set.has(v)) {
            isValid = true;
            return;
        }
    });
    return isValid;
}

const getInvalidValues = (ticket, ticketsRules) => {
    return ticket.reduce((acc, v) => {
        if (!isValueValid(v, ticketsRules)) {
            return [...acc, v];
        }
        return acc;
    }, [])
};

const getScanningErrorRate = (tickets, ticketsRules) => {
    let invalidValues = [];
    let invalidTicketKeys = [];

    tickets.forEach((ticket, k) => {
        const invalid = getInvalidValues(ticket, ticketsRules);
        if (invalid.length) {
            invalidTicketKeys = [...invalidTicketKeys, k]
        }
        invalidValues = [...invalidValues, ...invalid]
    });
    
    return {
        invalidTicketKeys,
        scanningErrorRate: invalidValues.length ? invalidValues.reduce((acc, cur) => acc + cur) : 0
    };
};

// PART 2
const findCorrRules = (column, ticketsRules) => {
    let corrRules = [];

    ticketsRules.forEach((ruleSet, k) => {
        const hasAllValues = column.reduce((acc, v) => {
            if (ruleSet.has(v)) {
                return [...acc, v];
            }
            return acc;
        }, []).length === column.length;

        if (hasAllValues) {
            corrRules = [...corrRules, k];
        }
    });

    return corrRules;
};

/**
Example input array:
[
    [ 'arrivalstation', 'zone' ],
    [
      'departuretime',
      'arrivalstation',
      'price',
      'route',
      'row',
      'train',
      'zone'
    ],
    [
      'departurelocation',
      'departureplatform',
      'departuretrack',
      'departuretime',
      'arrivalstation',
      'price',
      'route',
      'row',
      'train',
      'zone'
    ],
    [ 'arrivalstation', 'price', 'route', 'row', 'train', 'zone' ],
    [
      'departurelocation', 'departurestation',
      'departureplatform', 'departuretrack',
      'departuredate',     'departuretime',
      'arrivalstation',    'arrivaltrack',
      'class',             'price',
      'route',             'row',
      'seat',              'train',
      'wagon',             'zone'
    ]
]

HOW THIS WORKS:
- 1. the reducer takes the input array as the accumulator.
- 2. for each current value it finds all items in the accumulator that have less elements than the current value and makes an array of them
- 3. it removes all the items from the current value that exist in the array from step 2
- 4. it updates the current value in the accumulater with filtered out one
- 5. re-runs this for the updated accumulator until all values only have unique keys
 */
const filterOutDuplicates = (array) => {
    return array.reduce((acc, v, index) => {
        const shorter = acc.filter(l => l.length < v.length).flatMap(i => i); // step 2
        const filtered = v.filter(j => !shorter.includes(j)); // step 3
        acc[index] = filtered; // step 4
        return acc; // step 5
    }, [...array]).flatMap(i => i)
}

const getOrderOfRulesInTickets = (tickets, ticketsRules) => {
    let possibleRuleValuesMap = new Map();

    tickets.forEach((v, k) => {
        v.forEach((v, i) => {
            if (k !== 'my') {
                const curr = possibleRuleValuesMap.get(i);
                possibleRuleValuesMap.set(i, curr ? [...curr, v] : [v]);
            }
        });
    });

    let corrRulesAcc = [];
    possibleRuleValuesMap.forEach((column) => {
        const corrRules = findCorrRules(column, ticketsRules, corrRulesAcc);
        corrRulesAcc = [...corrRulesAcc, corrRules];
    });

    console.log(corrRulesAcc, filterOutDuplicates(corrRulesAcc))

    return filterOutDuplicates(corrRulesAcc);
}

const day16Solution = () => {
    const ticketsRaw = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8').split(/\n/);
    const rulesRaw = fs.readFileSync(path.join(__dirname + '/rules.txt'), 'utf8').split(/\n/);

    const ticketsRules = rulesRaw.reduce((acc, rule) => {
        const ruleName = rule.match(/[^\s\d:-]+/g).filter(v => v !== 'or').join('');
        const ruleValues = rule.match(/[\d]+/g).map(v => Number(v));
        return acc.set(ruleName, new Set([...getSetOfNumbers(ruleValues[0], ruleValues[1]), ...getSetOfNumbers(ruleValues[2], ruleValues[3])]));
    }, new Map());

    const tickets = ticketsRaw.reduce((acc, t, i) => {
        const values = t.split(',').map(v => Number(v));
        if (i === 0) acc.set('my', values);
        else acc.set(i, values)
        return acc;
    }, new Map())

    // Part 1
    const {invalidTicketKeys, scanningErrorRate} = getScanningErrorRate(tickets, ticketsRules);
    const filteredTickets = invalidTicketKeys.reduce((acc, key) => {
        acc.delete(key);
        return acc;
    }, tickets);

    // Part 2
    const myTicket = tickets.get('my');
    const indexesOfDepartureRules = getOrderOfRulesInTickets(filteredTickets, ticketsRules)
    const multDepartureRuleValues = indexesOfDepartureRules.reduce((acc, rule, i) => {
            if (rule.includes('departure')) {
                acc *= myTicket[i];
            }
            return acc;
        }, 1);

    return {
        part1: scanningErrorRate,
        part2: multDepartureRuleValues
    }
}

module.exports = {
    day16Solution
}