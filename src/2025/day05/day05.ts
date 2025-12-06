import { readFileSync } from "fs";

const inputFile = "src/2025/day05/day05.txt";

const raw = readFileSync(inputFile, "utf-8").trim();

const parts = raw.split(/\r?\n\r?\n/);

const rangesRaw = parts[0];
const idsRaw = parts[1];

const ranges = rangesRaw.split(/\r?\n/).map((line) => {
  const [a, b] = line.trim().split("-").map(Number);
  return { start: a, end: b };
});

const ids = idsRaw.split(/\r?\n/).map((x) => Number(x.trim()));

function isFresh(id: number): boolean {
  return ranges.some((r) => id >= r.start && id <= r.end);
}

let part1Result = 0;
for (const id of ids) {
  if (isFresh(id)) part1Result++;
}

console.log(`Part 1: ${part1Result}`);

ranges.sort((a, b) => a.start - b.start);

const merged: { start: number; end: number }[] = [];
let current = { ...ranges[0] };

for (let i = 1; i < ranges.length; i++) {
  const r = ranges[i];

  if (r.start <= current.end + 1) {
    current.end = Math.max(current.end, r.end);
  } else {
    merged.push(current);
    current = { ...r };
  }
}

merged.push(current);

let part2Result = 0;

for (const r of merged) {
  part2Result += r.end - r.start + 1;
}

console.log(`Part 2: ${part2Result}`);
