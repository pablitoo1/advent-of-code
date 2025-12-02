import { readFileSync } from "fs";

const inputFile = "src/2024/day11/day11.txt";
const input = readFileSync(inputFile, "utf-8").trim();

const initialStoneValues: number[] = input.split(/\s+/).map(Number);

const memoizationCache: Record<string, number> = {};

function generateCacheKey(stoneValue: number, blinksRemaining: number): string {
  return `${stoneValue},${blinksRemaining}`;
}

function simulateStoneEvolution(
  stoneValue: number,
  blinksRemaining: number
): number {
  const cacheKey = generateCacheKey(stoneValue, blinksRemaining);

  if (cacheKey in memoizationCache) {
    return memoizationCache[cacheKey];
  }

  let resultingStoneCount: number;

  if (blinksRemaining === 0) {
    resultingStoneCount = 1;
  } else if (stoneValue === 0) {
    resultingStoneCount = simulateStoneEvolution(1, blinksRemaining - 1);
  } else if (String(stoneValue).length % 2 === 0) {
    const stoneString = String(stoneValue);
    const leftPart = parseInt(stoneString.slice(0, stoneString.length / 2), 10);
    const rightPart = parseInt(stoneString.slice(stoneString.length / 2), 10);

    resultingStoneCount =
      simulateStoneEvolution(leftPart, blinksRemaining - 1) +
      simulateStoneEvolution(rightPart, blinksRemaining - 1);
  } else {
    resultingStoneCount = simulateStoneEvolution(
      stoneValue * 2024,
      blinksRemaining - 1
    );
  }

  memoizationCache[cacheKey] = resultingStoneCount;
  return resultingStoneCount;
}

function calculateTotalStones(
  totalBlinks: number,
  stoneValues: number[]
): number {
  return stoneValues.reduce(
    (total, stoneValue) =>
      total + simulateStoneEvolution(stoneValue, totalBlinks),
    0
  );
}

const part1Result = calculateTotalStones(25, initialStoneValues);
const part2Result = calculateTotalStones(75, initialStoneValues);

console.log(`Part 1 : ${part1Result}`);
console.log(`Part 2 : ${part2Result}`);
