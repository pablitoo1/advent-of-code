import { readFileSync } from "fs";

const inputFile = "src/2025/day04/day04.txt";
const raw = readFileSync(inputFile, "utf8").trim();
const lines = raw.split(/\r?\n/);
const h = lines.length;
const w = lines[0].length;
const grid = lines.map((l) => l.split(""));

const dirs: Array<[number, number]> = [];
for (let dy = -1; dy <= 1; dy++) {
  for (let dx = -1; dx <= 1; dx++) {
    if (dx === 0 && dy === 0) continue;
    dirs.push([dx, dy]);
  }
}

function countAccessible(grid: string[][]): [number, boolean[][]] {
  const accessible: boolean[][] = grid.map((row) => row.map((_) => false));
  let count = 0;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (grid[y][x] !== "@") continue;
      let neighbors = 0;
      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
        if (grid[ny][nx] === "@") neighbors++;
      }
      if (neighbors < 4) {
        accessible[y][x] = true;
        count++;
      }
    }
  }

  return [count, accessible];
}

const [part1Result] = countAccessible(grid);
console.log(`Part 1: ${part1Result}`);

let part2Result = 0;
const gridCopy = grid.map((row) => row.slice());
while (true) {
  const [count, accessible] = countAccessible(gridCopy);
  if (count === 0) break;
  part2Result += count;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (accessible[y][x]) gridCopy[y][x] = ".";
    }
  }
}
console.log(`Part 2: ${part2Result}`);
