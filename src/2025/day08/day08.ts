import { readFileSync } from "fs";

const inputFile = "src/2025/day08/day08.txt";
const points = readFileSync(inputFile, "utf-8")
  .split("\n")
  .filter(Boolean)
  .map(line => line.split(",").map(Number) as [number, number, number]);

const n = points.length;

const parent: number[] = Array.from({ length: n }, (_, i) => i);
const size: number[] = Array(n).fill(1);

function find(x: number): number {
  if (parent[x] !== x) parent[x] = find(parent[x]);
  return parent[x];
}

function union(x: number, y: number): boolean {
  let px = find(x);
  let py = find(y);
  if (px === py) return false;
  if (size[px] < size[py]) [px, py] = [py, px];
  parent[py] = px;
  size[px] += size[py];
  return true;
}

type Edge = { i: number; j: number; dist2: number };
const edges: Edge[] = [];

for (let i = 0; i < n; i++) {
  for (let j = i + 1; j < n; j++) {
    const dx = points[i][0] - points[j][0];
    const dy = points[i][1] - points[j][1];
    const dz = points[i][2] - points[j][2];
    edges.push({ i, j, dist2: dx * dx + dy * dy + dz * dz });
  }
}

edges.sort((a, b) => a.dist2 - b.dist2);

const parentPart1 = parent.slice();
const sizePart1 = size.slice();
let connections = 0;

for (let k = 0; k < Math.min(1000, edges.length); k++) {
  let x = edges[k].i;
  let y = edges[k].j;

  function find1(x: number): number {
    if (parentPart1[x] !== x) parentPart1[x] = find1(parentPart1[x]);
    return parentPart1[x];
  }

  function union1(x: number, y: number): boolean {
    let px = find1(x);
    let py = find1(y);
    if (px === py) return false;
    if (sizePart1[px] < sizePart1[py]) [px, py] = [py, px];
    parentPart1[py] = px;
    sizePart1[px] += sizePart1[py];
    return true;
  }

  union1(x, y);
}

const circuitSizes1: number[] = [];
for (let i = 0; i < n; i++) {
  if (parentPart1[i] === i) circuitSizes1.push(sizePart1[i]);
}
circuitSizes1.sort((a, b) => b - a);
const part1Result = circuitSizes1[0] * (circuitSizes1[1] || 1) * (circuitSizes1[2] || 1);
console.log(`Part 1: ${part1Result}`);

parent.fill(0).forEach((_, i) => (parent[i] = i));
size.fill(1);

let lastPair: [number, number] | null = null;

for (const edge of edges) {
  const connected = union(edge.i, edge.j);
  if (connected) lastPair = [edge.i, edge.j];
  if (size[find(edge.i)] === n) break;
}

const [i, j] = lastPair ?? [0, 0];
const part2Result = points[i][0] * points[j][0];
console.log(`Part 2: ${part2Result}`);
