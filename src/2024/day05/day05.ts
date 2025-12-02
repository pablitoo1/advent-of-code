import { readFileSync } from "fs";

const inputFile = "src/2024/day05/day05.txt";
const input = readFileSync(inputFile, "utf-8")
  .split("\n")
  .filter((line) => line.trim() !== "");

const rules: [number, number][] = [];
const updates: number[][] = [];

for (const line of input) {
  if (line.includes("|")) {
    const [x, y] = line.split("|").map(Number);
    rules.push([x, y]);
  } else {
    const update = line.split(",").map(Number);
    updates.push(update);
  }
}

function isValidUpdate(update: number[]): boolean {
  const indexMap: Record<number, number> = {};
  update.forEach((page, index) => {
    indexMap[page] = index;
  });

  for (const [x, y] of rules) {
    if (x in indexMap && y in indexMap) {
      if (indexMap[x] >= indexMap[y]) {
        return false;
      }
    }
  }
  return true;
}

function findMiddlePage(update: number[]): number {
  const midIndex = Math.floor(update.length / 2);
  return update[midIndex];
}

function reorderUpdate(update: number[]): number[] {
  const updatePages = update;

  const pagesAfter: Record<number, number[]> = {};
  const pagesBeforeCounter: Record<number, number> = {};

  for (const page of update) {
    pagesAfter[page] = [];
    pagesBeforeCounter[page] = 0;
  }

  for (const [x, y] of rules) {
    if (updatePages.includes(x) && updatePages.includes(y)) {
      pagesAfter[x].push(y);
      pagesBeforeCounter[y] += 1;
    }
  }

  const queue: number[] = [];
  for (const page of update) {
    if (pagesBeforeCounter[page] === 0) queue.push(page);
  }

  const sorted: number[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);
    for (const neighbor of pagesAfter[current] || []) {
      pagesBeforeCounter[neighbor] -= 1;
      if (pagesBeforeCounter[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  return sorted;
}

let part1Result = 0;
let part2Result = 0;

for (const update of updates) {
  if (isValidUpdate(update)) {
    part1Result += findMiddlePage(update);
  } else {
    const reordered = reorderUpdate(update);
    part2Result += findMiddlePage(reordered);
  }
}

console.log(`Part 1: ${part1Result}`);
console.log(`Part 2: ${part2Result}`);
