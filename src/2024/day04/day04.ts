import { readFileSync } from "fs";

const inputFile = "src/2024/day04/day04.txt";
const lines = readFileSync(inputFile, "utf-8")
  .split("\n")
  .map((line) => line.replace(/\r$/, ""));

const rows = lines.length;
const cols = lines[0].length;

//Part 1
function countWordOccurrences(grid: string[], word: string) {
  const directions = [
    // v = vertical, h = horizontal
    { v: 0, h: 1 },
    { v: 1, h: 0 },
    { v: 1, h: 1 },
    { v: 1, h: -1 },
    { v: 0, h: -1 },
    { v: -1, h: 0 },
    { v: -1, h: -1 },
    { v: -1, h: 1 },
  ];

  let count = 0;

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      for (const { v, h } of directions) {
        let found = true;

        for (let k = 0; k < word.length; k++) {
          const xPos = x + k * v;
          const yPos = y + k * h;

          if (xPos < 0 || xPos >= rows || yPos < 0 || yPos >= cols || grid[xPos][yPos] !== word[k]) {
            found = false;
            break;
          }
        }

        if (found) count++;
      }
    }
  }

  return count;
}

const part1Result = countWordOccurrences(lines, "XMAS");

console.log(`Part 1: ${part1Result}`);

//Part 2
function countWordOccurrencesXShaped(grid: string[]) {
    let count = 0;

    for (let x = 1; x < rows - 1; x++) {
        for (let y = 1; y < cols - 1; y++) {
            if (grid[x][y] !== 'A') continue;

            const topLeft = grid[x - 1][y - 1];
            const topRight = grid[x - 1][y + 1];
            const bottomLeft = grid[x + 1][y - 1];
            const bottomRight = grid[x + 1][y + 1];

            if (
                ((topLeft === 'M' && bottomRight === 'S') || (topLeft === 'S' && bottomRight === 'M')) &&
                ((bottomLeft === 'M' && topRight === 'S') || (bottomLeft === 'S' && topRight === 'M'))
            ) {
                count++;
            }
        }
    }

    return count;
}

const part2Result = countWordOccurrencesXShaped(lines);

console.log(`Part 2: ${part2Result}`);