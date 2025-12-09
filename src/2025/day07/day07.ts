import { readFileSync } from "fs";

const inputFile = "src/2025/day07/day07.txt";
const grid = readFileSync(inputFile, "utf-8").split("\n").map(line => line.split(""));

const height = grid.length;
const width = grid[0].length;
const startX = grid[0].indexOf("S");

let active = new Set<number>();
active.add(startX);

let part1Result = 0;

for (let y = 0; y < height; y++) {
  const nextActive = new Set<number>();
  for (const x of active) {
    const cell = grid[y][x];
    if (cell === "^") {
      part1Result++;
      if (x - 1 >= 0) nextActive.add(x - 1);
      if (x + 1 < width) nextActive.add(x + 1);
    } else {
      nextActive.add(x);
    }
  }
  active = nextActive;
}

console.log(`Part 1: ${part1Result}`);

const memo: number[][] = Array.from({ length: height }, () => Array(width).fill(-1));

function countTimelines(y: number, x: number): number {
  if (y >= height || x < 0 || x >= width) return 1;
  if (memo[y][x] !== -1) return memo[y][x];

  const cell = grid[y][x];
  let total = 0;

  if (cell === "^") {
    total += countTimelines(y + 1, x - 1);
    total += countTimelines(y + 1, x + 1);
  } else {
    total += countTimelines(y + 1, x);
  }

  memo[y][x] = total;
  return total;
}

const part2Result = countTimelines(0, startX);
console.log(`Part 2: ${part2Result}`);
