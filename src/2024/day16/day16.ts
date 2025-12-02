import { readFileSync } from "fs";

const inputFile = "src/2024/day16/day16.txt";
const input = readFileSync(inputFile, "utf-8");

type Direction = (typeof Direction)[keyof typeof Direction];

const map = new Map<string, "." | "#" | "E" | "S">();
let start = { x: -1, y: -1 };

const Direction = {
  East: { left: "North", right: "South", x: 1, y: 0 },
  North: { left: "West", right: "East", x: 0, y: -1 },
  South: { left: "East", right: "West", x: 0, y: 1 },
  West: { left: "South", right: "North", x: -1, y: 0 },
} as const;

for (const [y, row] of input.split(/\r?\n/).entries()) {
  for (const [x, tile] of row.split("").entries()) {
    map.set(`${x},${y}`, tile as "." | "#" | "E" | "S");
    if (tile === "S") start = { x, y };
  }
}

type Point = { x: number; y: number };

let part1Result = Infinity;
const paths: Point[][] = [];
const visited = new Map<string, number>();

type Heap = Point & { d: Direction; p: Point[]; s: number };
const heap: Heap[] = [];

const pushHeap = (value: Heap) => {
  heap.push(value);
  let index = heap.length - 1;
  while (index > 0) {
    const parentIndex = Math.floor((index - 1) / 2);
    if (heap[index].s >= heap[parentIndex].s) break;
    [heap[index], heap[parentIndex]] = [heap[parentIndex], heap[index]];
    index = parentIndex;
  }
};

const popHeap = (): Heap | undefined => {
  if (heap.length === 0) return undefined;
  const root = heap[0];
  const last = heap.pop();
  if (heap.length > 0 && last !== undefined) {
    heap[0] = last;
    let index = 0;
    const length = heap.length;
    while (true) {
      const leftChildIdx = 2 * index + 1;
      const rightChildIdx = 2 * index + 2;
      let swapIdx = -1;

      if (leftChildIdx < length && heap[leftChildIdx].s < heap[index].s)
        swapIdx = leftChildIdx;
      if (
        rightChildIdx < length &&
        heap[rightChildIdx].s <
          (swapIdx === -1 ? heap[index].s : heap[swapIdx].s)
      )
        swapIdx = rightChildIdx;

      if (swapIdx === -1) break;
      [heap[index], heap[swapIdx]] = [heap[swapIdx], heap[index]];
      index = swapIdx;
    }
  }
  return root;
};

pushHeap({ d: Direction.East, p: [start], s: 0, ...start });

while (heap.length) {
  const { d, p, s, x, y } = popHeap()!;

  if (visited.get(`${x},${y},${d.x},${d.y}`)! > 10) continue;

  visited.set(
    `${x},${y},${d.x},${d.y}`,
    (visited.get(`${x},${y},${d.x},${d.y}`) ?? 0) + 1
  );

  if (map.get(`${x},${y}`) === "E") {
    if (s > part1Result) break;
    part1Result = s;
    paths.push(p);
  }

  if (".E".includes(map.get(`${x + d.x},${y + d.y}`)!)) {
    const point = { x: x + d.x, y: y + d.y };
    pushHeap({ d, p: [...p, point], s: s + 1, ...point });
  }

  pushHeap({ d: Direction[d.left], p, s: s + 1000, x, y });
  pushHeap({ d: Direction[d.right], p, s: s + 1000, x, y });
}

const part2Result = new Set(
  paths.flatMap((path) => path.map(({ x, y }) => `${x},${y}`))
).size;

console.log("Part 1:", part1Result);
console.log("Part 2:", part2Result);
