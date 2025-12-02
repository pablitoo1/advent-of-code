import { readFileSync } from "fs";

const inputFile = "src/2025/day01/day01.txt";

const lines = readFileSync(inputFile, "utf-8")
  .split("\n")
  .filter((line) => line.trim() !== "");

let position = 50;
let part1Result = 0;
let part2Result = 0;

for (const line of lines) {
  const dir = line[0];
  const amount = parseInt(line.slice(1), 10);

  if (dir === "L") {
    position = (position - amount) % 100;
  } else {
    position = (position + amount) % 100;
  }

  if (position < 0) position += 100;

  if (position === 0) {
    part1Result++;
  }

  let dirSign = dir === "L" ? -1 : 1;
  let tempPos = position;

  let fullLoops = Math.floor(amount / 100);
  part2Result += fullLoops;

  let remainder = amount % 100;
  for (let i = 1; i <= remainder; i++) {
    tempPos = (tempPos - dirSign) % 100;
    if (tempPos < 0) tempPos += 100;
    if (tempPos === 0) part2Result++;
  }
}

console.log(`Part 1: ${part1Result}`);
console.log(`Part 2: ${part2Result}`);
