import { readFileSync } from "fs";

const inputFile = "src/2024/day03/day03.txt";

const input = readFileSync(inputFile, "utf-8")

const regexMul1 = /mul\(\d+,\d+\)/g;
const regexMul2 = /mul\((\d+),(\d+)\)/;
const regexDo = /^do\(\)$/;
const regexDont = /^don't\(\)$/;

//Part 1
const matchesPart1 = input.match(regexMul1) || [];
let part1Result = 0;
matchesPart1.forEach((match) => {
  const parts = match.match(/\d+/g);
  if (parts && parts.length === 2) {
    const x = parseInt(parts[0], 10);
    const y = parseInt(parts[1], 10);
    part1Result += x * y;
  }
});
console.log("Part 1:", part1Result);

//Part 2
const matchesPart2 = input.match(/(mul\(\d+,\d+\)|do\(\)|don't\(\))/g) || [];
let canMultiply = true;
let part2Result = 0;
matchesPart2.forEach((match) => {
    if (regexDo.test(match)) {
        canMultiply = true;
    } else if (regexDont.test(match)) {
        canMultiply = false;
    } else {
        const mulMatch = match.match(regexMul2);
        if (mulMatch && canMultiply) {
        const x = parseInt(mulMatch[1], 10);
        const y = parseInt(mulMatch[2], 10);
        part2Result += x * y;
        }
    }
});
  
console.log("Part 2:", part2Result);