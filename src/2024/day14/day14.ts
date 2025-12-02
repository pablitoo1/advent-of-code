import { readFileSync } from "fs";

const inputFile = "src/2024/day14/day14.txt";
const input = readFileSync(inputFile, "utf-8");

const lines: string[] = input.trim().split("\n");

const n: number = 103;
const m: number = 101;

let p: number[][] = [];
let v: number[][] = [];

for (const line of lines) {
  const [a, b] = line.split(" ");
  const pValues: number[] = a.split("=")[1].split(",").map(Number);
  const vValues: number[] = b.split("=")[1].split(",").map(Number);

  p.push([pValues[1], pValues[0]]);
  v.push([vValues[1], vValues[0]]);
}

const N: number = p.length;

function update(): void {
  for (let i = 0; i < N; i++) {
    p[i][0] = (p[i][0] + v[i][0] + n) % n;
    p[i][1] = (p[i][1] + v[i][1] + m) % m;
  }
}

function countRobots(i0: number, i1: number, j0: number, j1: number): number {
  let ans: number = 0;
  for (let i = i0; i < i1; i++) {
    for (let j = j0; j < j1; j++) {
      for (const [ii, jj] of p) {
        if (i === ii && j === jj) {
          ans++;
        }
      }
    }
  }
  return ans;
}

for (let step = 0; step < 100; step++) {
  update();
}

const q0: number = countRobots(0, Math.floor(n / 2), 0, Math.floor(m / 2));
const q1: number = countRobots(Math.floor(n / 2) + 1, n, 0, Math.floor(m / 2));
const q2: number = countRobots(0, Math.floor(n / 2), Math.floor(m / 2) + 1, m);
const q3: number = countRobots(
  Math.floor(n / 2) + 1,
  n,
  Math.floor(m / 2) + 1,
  m
);

const part1Result = q0 * q1 * q2 * q3;
console.log("Part 1:", part1Result);

// Part 2
function containsCluster(positions: number[][]): boolean {
  const visited = new Set<string>();
  const total = positions.length;
  let largestGroup = 0;

  const bfs = (start: number[]): number => {
    const queue: number[][] = [start];
    const group = new Set<string>();
    group.add(start.join(","));

    while (queue.length > 0) {
      const [x, y] = queue.pop()!;
      const neighbors = [
        [(x + 1 + n) % n, y],
        [(x - 1 + n) % n, y],
        [x, (y + 1 + m) % m],
        [x, (y - 1 + m) % m],
      ];
      for (const [nx, ny] of neighbors) {
        const hash = `${nx},${ny}`;
        if (
          positions.some(([px, py]) => px === nx && py === ny) &&
          !group.has(hash)
        ) {
          group.add(hash);
          queue.push([nx, ny]);
        }
      }
    }
    return group.size;
  };

  for (const pos of positions) {
    const hash = pos.join(",");
    if (!visited.has(hash)) {
      const size = bfs(pos);
      largestGroup = Math.max(largestGroup, size);
      for (const visitedPos of Array.from(visited)) {
        visited.add(visitedPos);
      }
    }
  }
  return largestGroup >= total / 4;
}

let part2Result;
let seconds = 0;
while (true) {
  update();
  seconds++;
  if (containsCluster(p)) {
    part2Result = seconds + 100;
    const uniquePositions = new Set(p.map(([x, y]) => `${x},${y}`));
    for (let i = 0; i < n; i++) {
      let row = "";
      for (let j = 0; j < m; j++) {
        row += uniquePositions.has(`${i},${j}`) ? "#" : ".";
      }
      //   console.log(row);          //uncomment if want to see tree
    }
    break;
  }
}

console.log("Part 2:", part2Result);
