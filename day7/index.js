'use strict';

const fs = require("fs");
const path = require('path');

function convertData(data) {
    let entries = data.split("\n")

    return entries.filter(e => e !== "")
        .map(e => {
            let [container, content] = e.replace(/bags|\./g, "").split("contain")
            let [mutation, color] = container.trim().split(" ")

            container = {mutation,color}

            content = content.split(",")
                .map(c => {
                    let [quantity, mutation, color] = c.trim().split(" ")
                    if (quantity !== "no") {
                        return {
                            quantity: parseInt(quantity),
                            mutation,
                            color
                        }
                    }
                    else 
                        null

                }).filter(c => c !== undefined)

            return {
                container: container,
                content
            }
        })
}

function findBag(bags, mutation, color) {
    return bags.find(bag => bag.container.mutation === mutation && bag.container.color === color)
}


function recursiveBagFinding(bags, bag) {    
    bag = findBag(bags, bag.mutation, bag.color)

    if (!bag) return 0

    let contentCount = 0;
    
    //for for every bag in this bag, get the countCount
    for (let i = 0; i < bag.content.length; i++) {
        let content = bag.content[i]

        //add the count of this bag's content to the big counter (plus 1 for itself)
        contentCount += content.quantity * (1 + recursiveBagFinding(bags, content))
    }

    return contentCount;

}

function partTwo(bags) {
    let shinyBag = {mutation:"shiny", color:"gold"}
    return recursiveBagFinding(bags, shinyBag)
} 

function findContent(bags, mutation, color) {
    return bags.filter(bag => {
        let canHold = false
        bag.content.forEach(c => {
            if (c.mutation === mutation && c.color === color)
                canHold = true
        })
        return canHold
    })
}

const day7Solution = () => {
    const data = fs.readFileSync(path.join(__dirname + '/input.txt'), 'utf8');
    const bags = convertData(data)
    
    let shinyHoldingBags = findContent(bags, "shiny", "gold")

    let allShinyHoldingBags = [...shinyHoldingBags]
    let oldSize = -1
    let newSize = -2
    do {
        oldSize = allShinyHoldingBags.length

        let moreShinyHoldingBags = [] //find the next layer of bags,
        allShinyHoldingBags.forEach(bag => {
            let moreBags = findContent(bags, bag.container.mutation, bag.container.color)
            moreShinyHoldingBags = [...moreShinyHoldingBags, ...moreBags]
        })

        //remove duplicates (there shouldn't be any dupes if I was any good from the first place)
        allShinyHoldingBags = Array.from(new Set([...allShinyHoldingBags, ...moreShinyHoldingBags]))

        newSize = allShinyHoldingBags.length

        //if no more new bags are found, head out
    } while (oldSize != newSize)

    return {
        part1: allShinyHoldingBags.length,
        part2: partTwo(bags)
    }
}

module.exports = {
    day7Solution
}