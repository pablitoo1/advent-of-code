import { readFileSync } from "fs";

const inputFile = "src/2024/day08/day08.txt";
const input = readFileSync(inputFile, "utf-8");

const grid = input.trim().split("\n");
const n = grid.length;

function inBounds(x: number, y: number): boolean {
  return 0 <= x && x < n && 0 <= y && y < n;
}

function getAntinodes1(a: [number, number], b: [number, number]): [number, number][] {
  const [ax, ay] = a;
  const [bx, by] = b;

  const cx = ax - (bx - ax), cy = ay - (by - ay);
  const dx = bx + (bx - ax), dy = by + (by - ay);

  const antinodes: [number, number][] = [];
  
  if (inBounds(cx, cy)) antinodes.push([cx, cy]);
  if (inBounds(dx, dy)) antinodes.push([dx, dy]);

  return antinodes;
}

function getAntinodes2(a: [number, number], b: [number, number]): [number, number][] {
  const [ax, ay] = a;
  const [bx, by] = b;

  const dx = bx - ax, dy = by - ay;

  const antinodes: [number, number][] = [];
  let i = 0;
  
  while (true) {
    const x = ax - dx * i, y = ay - dy * i;
    if (inBounds(x, y)) {
      antinodes.push([x, y]);
    } else {
      break;
    }
    i++;
  }

  i = 0;
  while (true) {
    const x = bx + dx * i, y = by + dy * i;
    if (inBounds(x, y)) {
      antinodes.push([x, y]);
    } else {
      break;
    }
    i++;
  }

  return antinodes;
}

function processAntinodes(antinodesList: [number, number][][]) {
  const antinodes: Set<string> = new Set();

  for (const nodeList of antinodesList) {
    for (const [x, y] of nodeList) {
      antinodes.add(`${x},${y}`);
    }
  }

  return antinodes;
}

const allLocs: Record<string, [number, number][]> = {};
for (let i = 0; i < n; i++) {
  for (let j = 0; j < n; j++) {
    const char = grid[i][j];
    if (char !== ".") {
      if (!allLocs[char]) allLocs[char] = [];
      allLocs[char].push([i, j]);
    }
  }
}

const antinodes1List: [number, number][][] = [];
const antinodes2List: [number, number][][] = [];

for (const key in allLocs) {
  const locs = allLocs[key];
  for (let i = 0; i < locs.length; i++) {
    for (let j = i + 1; j < locs.length; j++) {
      const a = locs[i];
      const b = locs[j];
      antinodes1List.push(getAntinodes1(a, b));
      antinodes2List.push(getAntinodes2(a, b));
    }
  }
}

const part1Result = processAntinodes(antinodes1List).size;
const part2Result = processAntinodes(antinodes2List).size;

console.log(`Part 1: ${part1Result}`);
console.log(`Part 2: ${part2Result}`);
