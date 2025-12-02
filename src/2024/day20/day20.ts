import { readFileSync } from "fs";

const inputFile = "src/2024/day20/day20.txt";
const input = readFileSync(inputFile, "utf-8");

const lines = input.split("\n").filter((line) => line.trim() !== "");
const grid = lines.map((line) => Array.from(line));

// Part 1
function partOne() {
  const minSave = 100;

  let start: [number, number] | undefined;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === "S") {
        start = [row, col];
      }
    }
  }

  if (!start) {
    return;
  }

  const dirs = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  const seen = new Set<string>(JSON.stringify(start));
  const queue: [number, number][] = [start];
  const prevs: Record<string, [number, number]> = {};
  let index = 0;
  let path: [number, number][] | undefined;

  while (index < queue.length) {
    const curr = queue[index];
    if (grid[curr[0]][curr[1]] === "E") {
      path = [];
      let step: [number, number] | undefined = curr;
      while (step) {
        path.push(step);
        step = prevs[JSON.stringify(step)];
      }
      path.reverse();
      break;
    }
    seen.add(JSON.stringify(curr));
    index++;
    for (const [dr, dc] of dirs) {
      const other: [number, number] = [curr[0] + dr, curr[1] + dc];
      const otherKey = JSON.stringify(other);
      if (
        !seen.has(otherKey) &&
        [".", "E"].includes(grid[other[0]]?.[other[1]])
      ) {
        queue.push(other);
        prevs[otherKey] = curr;
        seen.add(otherKey);
      }
    }
  }

  if (!path) {
    return;
  }

  const distance = Object.fromEntries(
    path.map((point, i) => [JSON.stringify(point), i])
  );

  let total = 0;

  for (let i = 0; i < path.length; i++) {
    const cell = path[i];
    const dist = distance[JSON.stringify(cell)];
    for (const [dr, dc] of dirs) {
      if (grid[cell[0] + dr]?.[cell[1] + dc] === "#") {
        const other: [number, number] = [cell[0] + dr * 2, cell[1] + dc * 2];
        const otherDist = distance[JSON.stringify(other)];
        const ifShortcut = otherDist - dist - 2;
        if (ifShortcut >= minSave) {
          total++;
        }
      }
    }
  }

  return total;
}

// Part 2
function partTwo() {
  const minSave = 100;

  let start: [number, number] | undefined;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === "S") {
        start = [row, col];
      }
    }
  }

  if (!start) {
    return;
  }

  const dirs = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];

  const seen = new Set<string>(JSON.stringify(start));
  const queue: [number, number][] = [start];
  const prevs: Record<string, [number, number]> = {};
  let index = 0;
  let path: [number, number][] | undefined;

  while (index < queue.length) {
    const curr = queue[index];
    if (grid[curr[0]][curr[1]] === "E") {
      path = [];
      let step: [number, number] | undefined = curr;
      while (step) {
        path.push(step);
        step = prevs[JSON.stringify(step)];
      }
      path.reverse();
      break;
    }
    seen.add(JSON.stringify(curr));
    index++;
    for (const [dr, dc] of dirs) {
      const other: [number, number] = [curr[0] + dr, curr[1] + dc];
      const otherKey = JSON.stringify(other);
      if (
        !seen.has(otherKey) &&
        [".", "E"].includes(grid[other[0]]?.[other[1]])
      ) {
        queue.push(other);
        prevs[otherKey] = curr;
        seen.add(otherKey);
      }
    }
  }

  if (!path) {
    return;
  }

  const distances: (number | null)[][] = Array(grid.length)
    .fill(null)
    .map(() => Array(grid[0].length).fill(null));
  for (let i = 0; i < path.length; i++) {
    const [row, col] = path[i];
    distances[row][col] = i;
  }

  let total = 0;

  for (let i = 0; i < path.length; i++) {
    for (let j = i + minSave; j < path.length; j++) {
      const rowDist = Math.abs(path[j][0] - path[i][0]);
      const colDist = Math.abs(path[j][1] - path[i][1]);
      const newDist = rowDist + colDist;
      const prevDist = j - i;
      if (newDist <= 20 && prevDist - newDist >= minSave) {
        total++;
      }
    }
  }

  return total;
}

const part1Result = partOne();
const part2Result = partTwo();

console.log("Part 1:", part1Result);
console.log("Part 2:", part2Result);
