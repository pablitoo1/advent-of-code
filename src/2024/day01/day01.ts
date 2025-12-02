import { readFileSync } from "fs";

const inputFile = "src/2024/day01/day01.txt";

const a: number[] = [];
const b: number[] = [];

const lines = readFileSync(inputFile, "utf-8")
  .split("\n")
  .filter((line) => line.trim() !== "");

for (const line of lines) {
  const [x, y] = line.split(/\s+/).map(Number);
  a.push(x);
  b.push(y);
}

a.sort((x, y) => x - y);
b.sort((x, y) => x - y);

const n = a.length;

// Part 1
let part1Result = 0;
for (let i = 0; i < n; i++) {
  const diff = Math.abs(a[i] - b[i]);
  part1Result += diff;
}
console.log(`Part 1: ${part1Result}`);

// Part 2
const bCounter: Record<number, number> = {};
for (const value of b) {
  bCounter[value] = (bCounter[value] || 0) + 1;
}

let part2Result = 0;
for (let i = 0; i < n; i++) {
  const count = bCounter[a[i]] || 0;
  const contribution = a[i] * count;
  part2Result += contribution;
}
console.log(`Part 2: ${part2Result}`);
