import { readFileSync } from "fs";

const inputFile = "src/2025/day02/day02.txt";

const ranges = readFileSync(inputFile, "utf-8")
  .trim()
  .split(",")
  .map(range => {
    const [start, end] = range.split("-").map(Number);
    return { start, end };
  });

function isRepeatedNumber(n: number): boolean {
  const s = n.toString();
  const len = s.length;

  if (len % 2 !== 0) return false;

  const half = len / 2;
  return s.slice(0, half) === s.slice(half);
}

let part1Result = 0;
for (const { start, end } of ranges) {
  for (let n = start; n <= end; n++) {
    if (isRepeatedNumber(n)) {
      part1Result += n;
    }
  }
}
console.log(`Part 1: ${part1Result}`);

function isRepeatedNumberPart2(n: number): boolean {
  const s = n.toString();
  const len = s.length;

  for (let subLen = 1; subLen <= len / 2; subLen++) {
    if (len % subLen !== 0) continue;
    const sub = s.slice(0, subLen);
    const repeated = sub.repeat(len / subLen);
    if (repeated === s && len / subLen >= 2) {
      return true;
    }
  }
  return false;
}

let part2Result = 0;
for (const { start, end } of ranges) {
  for (let n = start; n <= end; n++) {
    if (isRepeatedNumberPart2(n)) {
      part2Result += n;
    }
  }
}

console.log(`Part 2: ${part2Result}`);
