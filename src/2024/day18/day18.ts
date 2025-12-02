import { readFileSync } from "fs";

const inputFile = "src/2024/day18/day18.txt";
const input = readFileSync(inputFile, "utf-8");
const lines = input.split("\n");

const bfs = (grid: string[][], start: number[], end: number[]) => {
  const queue = [start];
  const visited = new Set<string>();
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  let steps = 0;

  while (queue.length) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const [x, y] = queue.shift() || [];
      if (x === end[0] && y === end[1]) {
        return steps;
      }

      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          nx < 0 ||
          nx >= grid.length ||
          ny < 0 ||
          ny >= grid[0].length ||
          grid[nx][ny] === "#" ||
          visited.has(`${nx},${ny}`)
        ) {
          continue;
        }
        queue.push([nx, ny]);
        visited.add(`${nx},${ny}`);
      }
    }
    steps++;
  }

  return -1;
};

const DIM = 71;
const BYTES_TO_SIMULATE = 1024;
const GRID = Array.from({ length: DIM }, () =>
  Array.from({ length: DIM }, () => ".")
);
const bytes = lines.map((line) => line.split(",").map((x) => Number(x)));

const start = [0, 0];
const end = [DIM - 1, DIM - 1];

for (let i = 0; i < BYTES_TO_SIMULATE; i++) {
  const [y, x] = bytes[i];
  if (x < 0 || x >= DIM || y < 0 || y >= DIM) {
    continue;
  }
  GRID[x][y] = "#";
}

const part1Result = bfs(GRID, start, end);

let part2Result: string | null = null;
for (let i = 0; i < bytes.length; i++) {
  const [y, x] = bytes[i];
  if (x < 0 || x >= DIM || y < 0 || y >= DIM) {
    continue;
  }
  GRID[x][y] = "#";

  const path = bfs(GRID, start, end);

  if (path === -1) {
    part2Result = `${y},${x}`;
    break;
  }
}

console.log("Part 1:", part1Result);
console.log("Part 2:", part2Result);
