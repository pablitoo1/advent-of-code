import { readFileSync } from "fs";

const inputFile = "src/2024/day25/day25.txt";
const input = readFileSync(inputFile, "utf-8");

const lines = input
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.length > 0);

const locks: number[][] = [];
const keys: number[][] = [];

for (let i = 0; i < lines.length; i += 7) {
  const group = Array.from({ length: 5 }, (_, colIdx) =>
    lines
      .slice(i + 1, i + 7)
      .reduce(
        (sum, line) =>
          sum + (line[colIdx] === (lines[i] === "#####" ? "#" : ".") ? 1 : 0),
        0
      )
  );

  const processedGroup = group.map((x) => (lines[i] === "#####" ? x : 5 - x));

  if (lines[i] === "#####") {
    locks.push(processedGroup);
  } else {
    keys.push(processedGroup);
  }
}

const part1Result = locks.reduce(
  (acc, lock) =>
    acc +
    keys.filter((key) => key.every((k, idx) => lock[idx] + k <= 5)).length,
  0
);

console.log("Part 1:", part1Result);
console.log("Part 2: Merry christmas :)");
