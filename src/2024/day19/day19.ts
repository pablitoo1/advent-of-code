import { createInterface } from 'readline';
import { createReadStream } from 'fs';
import * as path from 'path';

const inputPath = path.join(__dirname, 'day19.txt');

const MEMO = new Map<string, number>([["", 1]]);

function dfs(steps: string[], target: string): number {
  if (MEMO.has(target)) return MEMO.get(target)!;

  let count = 0;
  for (let step of steps) {
    if (target.startsWith(step)) {
      count += dfs(steps, target.slice(step.length));
    }
  }

  MEMO.set(target, count);
  return count;
}

const inputStream = createReadStream(inputPath, 'utf-8');

const rl = createInterface({
input: inputStream,
output: process.stdout
});

let patterns: string[] = [];
let designs: string[] = [];

rl.once('line', (line: string) => {
patterns = line.split(', ').map(s => s.trim());
rl.once('line', () => {
    rl.on('line', (line: string) => {
    if (line) {
        designs.push(line.trim());
    }
    });
});
});

rl.on('close', () => {
    let numberOfPaths = designs.map(design => dfs(patterns, design));

    const part1Result = numberOfPaths.filter(Boolean).length;
    const part2Result = numberOfPaths.reduce((sum, count) => sum + count, 0);
    
    console.log("Part 1:", part1Result);
    console.log("Part 2:", part2Result);
});
