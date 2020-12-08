'use strict';

const fs = require("fs");
const path = require('path');

const prepareBags = (rawInput) => {
    return rawInput.split(/\n/).reduce((acc, line) => {
        const explodedLine = line.split(/ bags |contain |, |\./).filter(i => i !== '');
        const content = explodedLine.slice(1, explodedLine.length).reduce((acc, bag) => {
            const explodedBag = bag.split(' ');
            const content = {
                quantity: Number(explodedBag[0]),
                mutation: explodedBag[1],
                color: explodedBag[2]
            };
            return explodedBag[0] !== 'no' ? [...acc, content] : acc;
        }, []);

        return content.length > 0 ? [...acc, {
            rule: {
                mutation: explodedLine[0].split(' ')[0],
                color: explodedLine[0].split(' ')[1]
            },
            content
        }] : acc
    }, []);
}

const findAllBagsContainingInput = (bags, bagToFind = {mutation: 'shiny', color: 'gold'}) => {
    return bags.filter(bag => {
        return bag.content.find(item => {
            return item.mutation === bagToFind.mutation && item.color === bagToFind.color;
        });
    });
}

const getAllBagsContainingInput = (bags, bagsToFind, allBags = []) => {
   while (bagsToFind && bagsToFind.length > 0) {
        const newBagsToFind = bagsToFind.reduce((acc, bag) => {
            return [...acc, ...findAllBagsContainingInput(bags, bag)]
        }, []).map(b => b.rule);
        return getAllBagsContainingInput(bags, newBagsToFind, [...allBags, ...newBagsToFind]);
   }
   return new Set(allBags);
}

const findCurrentBag = (bags, bagToFind = {mutation: 'shiny', color: 'gold'}) => {
    return bags.find(bag => {
        return bag.rule.mutation === bagToFind.mutation && bag.rule.color === bagToFind.color;
    });
}

const getAllBagsInsideInput = (bags, bagToFind, sum = 0) => {
    const currentBag = findCurrentBag(bags, bagToFind);

    if (!currentBag) return 0;

    for (let i = 0; i < currentBag.content.length; i++) {
        const childContent = currentBag.content[i];

        sum += childContent.quantity * (1 + getAllBagsInsideInput(bags, childContent));
    }

    return sum;
}

const day7Solution = () => {
    const rawInput = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8');
    const bags = prepareBags(rawInput);
    const INPUT_BAG = [{mutation: 'shiny', color: 'gold'}];

    const allBagsThatContainInput = getAllBagsContainingInput(bags, INPUT_BAG);
    const allBagsInsideTheInput = getAllBagsInsideInput(bags, INPUT_BAG[0])
    console.log(allBagsInsideTheInput)

    return {
        part1: allBagsThatContainInput.size
    }
}

module.exports = {
    day7Solution
}