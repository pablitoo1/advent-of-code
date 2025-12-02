import { readFileSync } from "fs";

const inputFile = "src/2024/day02/day02.txt";

const lines = readFileSync(inputFile, "utf-8")
  .split("\n")
  .filter((line) => line.trim() !== "");

function isSafe(report: number[]): boolean {
  const increasing = report.every((value, index) => {
    if (index === 0) return true;
    const prev = report[index - 1];
    return value > prev && value - prev >= 1 && value - prev <= 3;
  });

  const decreasing = report.every((value, index) => {
    if (index === 0) return true;
    const prev = report[index - 1];
    return value < prev && prev - value >= 1 && prev - value <= 3;
  });

  return increasing || decreasing;
}

function canBeSafeWithDampener(report: number[]): boolean {
  for (let i = 0; i < report.length; i++) {
    const modifiedReport = [...report.slice(0, i), ...report.slice(i + 1)];
    if (isSafe(modifiedReport)) {
      return true;
    }
  }
  return false;
}

// Part 1
let part1Result = 0;
for (const line of lines) {
  const report = line.split(" ").map(Number);
  if (isSafe(report)) {
    part1Result++;
  }
}
console.log(`Part 1: ${part1Result}`);

// Part 2
let part2Result = 0;
for (const line of lines) {
  const report = line.split(" ").map(Number);
  if (isSafe(report) || canBeSafeWithDampener(report)) {
    part2Result++;
  }
}
console.log(`Part 2: ${part2Result}`);
