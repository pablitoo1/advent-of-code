import { readFileSync } from "fs";

const inputFile = "src/2025/day03/day03.txt";

function maxTwoDigitFromLine(line: string): number {
  const s = line.trim();
  if (s.length < 2) return 0;

  const n = s.length;
  const digits: number[] = new Array(n);
  for (let i = 0; i < n; i++) {
    digits[i] = s.charCodeAt(i) - 48;
  }

  const suffixMax: number[] = new Array(n);
  suffixMax[n - 1] = digits[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    suffixMax[i] = Math.max(digits[i], suffixMax[i + 1]);
  }

  let best = 0;
  for (let i = 0; i < n - 1; i++) {
    const val = digits[i] * 10 + suffixMax[i + 1];
    if (val > best) best = val;
    if (best === 99) break;
  }

  return best;
}

function computeTotal(inputPath: string): number {
  const raw = readFileSync(inputPath, "utf8");
  const lines = raw.split(/\r?\n/).filter(l => l.length > 0);
  let sum = 0;
  for (const line of lines) {
    sum += maxTwoDigitFromLine(line);
  }
  return sum;
}

const part1Result = computeTotal(inputFile);
console.log(`Part 1: ${part1Result}`);

function maxKDigitFromLine(line: string, k: number): bigint {
  const s = line.trim();
  const n = s.length;
  const stack: number[] = [];

  let toRemove = n - k;

  for (let i = 0; i < n; i++) {
    const d = s.charCodeAt(i) - 48;
    while (stack.length > 0 && stack[stack.length - 1] < d && toRemove > 0) {
      stack.pop();
      toRemove--;
    }
    stack.push(d);
  }

  const resultDigits = stack.slice(0, k);
  const resultStr = resultDigits.join('');
  return BigInt(resultStr);
}

function computeTotalPart2(inputPath: string, k: number): bigint {
  const raw = readFileSync(inputPath, "utf8");
  const lines = raw.split(/\r?\n/).filter(l => l.length > 0);
  let sum = 0n;
  for (const line of lines) {
    sum += maxKDigitFromLine(line, k);
  }
  return sum;
}

const part2Result = computeTotalPart2(inputFile, 12);
console.log(`Part 2: ${part2Result}`);
