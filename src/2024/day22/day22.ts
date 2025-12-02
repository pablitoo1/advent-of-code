import { readFileSync } from "fs";

const inputFile = "src/2024/day22/day22.txt";
const input = readFileSync(inputFile, "utf-8").trim().split(/\r?\n/);

function part1(): bigint {
  let totalSum = 0n;
  for (const line of input) {
    let number = BigInt(line);

    for (let i = 0; i < 2000; ++i) {
      number = (number ^ (number * 64n)) % 16777216n;
      number = (number ^ (number / 32n)) % 16777216n;
      number = (number ^ (number * 2048n)) % 16777216n;
    }

    totalSum += number;
  }

  return totalSum;
}

function part2(): number {
  const BIT_MASK = (1 << 24) - 1;

  let dpArray = new Uint32Array(19 ** 4);
  let dpLineTracker = new Uint16Array(19 ** 4);
  let recentPriceDifferences = new Int16Array(4);

  let currentLine = 0;
  for (const line of input) {
    ++currentLine;
    let number = Number(line);

    let previousPrice = number % 10;
    let priceBufferIndex = 0;

    for (let iteration = 0; iteration < 2000; ++iteration) {
      number = (number ^ (number << 6)) & BIT_MASK;
      number = number ^ (number >>> 5);
      number = (number ^ (number << 11)) & BIT_MASK;

      let currentPrice = number % 10;

      recentPriceDifferences[priceBufferIndex] = currentPrice - previousPrice;
      priceBufferIndex = ++priceBufferIndex & 3;

      previousPrice = currentPrice;

      if (iteration >= 3) {
        let dpIndex = computeDpIndex(recentPriceDifferences, priceBufferIndex);

        if (dpLineTracker[dpIndex] !== currentLine) {
          dpArray[dpIndex] = dpArray[dpIndex] || 0;
          dpArray[dpIndex] += currentPrice;
          dpLineTracker[dpIndex] = currentLine;
        }
      }
    }
  }

  let maxValue = 0;
  for (const value of dpArray) {
    if (value > maxValue) {
      maxValue = value;
    }
  }

  return maxValue;
}

function computeDpIndex(
  priceDifferences: Int16Array,
  bufferStartIndex: number
): number {
  let index = 0;
  let baseMultiplier = 1;
  for (let offset = 0; offset < 4; ++offset) {
    index +=
      baseMultiplier * (priceDifferences[(offset + bufferStartIndex) & 3] + 9);
    baseMultiplier *= 19;
  }

  return index;
}

const part1Result = part1();
const part2Result = part2();

console.log("Part 1:", part1Result);
console.log("Part 2:", part2Result);
