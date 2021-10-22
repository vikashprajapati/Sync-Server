// script to generate model classes
const fs = require('fs').promises;
const path = require('path')

async function readFile(filePath) {
    try {
        let data = await fs.readFile(filePath);
        
        let lines = data.toString().split("\r\n").join("")
        
        if(!matchBalancedBrackets(lines)){
            throw new Error("Invalid Json! unmatched paranthesis")
        }
        
        let bracketCount = 0
        for (const char of lines) {
            if(char == "(" || char == "{" || char == "[") bracketCount++
        }
        
        let res = []
        
        let index = 0
        while(index < lines.length) {
            for (index = 0; index < lines.length; index++){
                let start = index
                if(lines[start] == '(' || lines[start] == '{' || lines[start] == '['){
                    let text = lines.substr(start, lines.length - start)
                    console.log(text);
                    let endIndex = matchingBracketsIndex(text)
                    lines = lines.substr(start, endIndex - start + 1)
                    res.push(lines)
                    console.log(res)
                    break
                }
            }   
        }
    } catch (error) {
        console.error(`Got an error trying to read the file: ${error.message}`);
    }
}

// "currentVideo" : {
//     "title" : "some title",
//     "url" : "url"
// },
// "previousVideo" : {
//     "title" : "some title",
//     "url" : "url"
// },
// "nextVideo" : {
//     "title" : "some title",
//     "url" : "url"
// }

function matchBalancedBrackets(s) {
    if (s.length % 2 !== 0 ) return false;
    
    var stack = [];
    for (let c of s) {
        if (c === ')' && stack[stack.length -1] === '('){
            stack.pop()
        } else if (c === '}' && stack[stack.length -1] === '{'){
            stack.pop()
        } else if (c === ']' && stack[stack.length -1] === '['){
            stack.pop()
        } else if(c == '(' || c == "{" || c == "[") {
            stack.push(c)
        }
    }
    
    return !stack.length
}

function matchingBracketsIndex(text) {
    console.log(text.length);
    let openPos = 0
    let closePos = openPos;
    let counter = 1;
    while (counter > 0 && closePos < text.length) {
        let c = text[++closePos];
        if (c == '(' || c == "{" || c == "[") {
            counter++;
        }
        else if (c == ')' || c == "}" || c == "]") {
            counter--;
        }
    }
    return closePos;
}

// needs path conversion from windows to unix
let filePath = "C:/Users/vikash/Documents/projects/Sync-Server/json/Room.json";
readFile(filePath)

module.exports = (filePath, modelName) => {
    readFile(filePath)
}