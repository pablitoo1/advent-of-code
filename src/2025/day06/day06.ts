import { readFileSync } from "fs";

const inputFile = "src/2025/day06/day06.txt";
const raw = readFileSync(inputFile, "utf-8").replace(/\r/g, "");
const lines = raw.split("\n").filter((l) => l.trim().length > 0);

function operate(numbers: number[], sign: string): number {
  let result = sign === "+" ? 0 : 1;
  for (const n of numbers) {
    if (sign === "+") result += n;
    else result *= n;
  }
  return result;
}

const board: string[][] = [];
const boardStrings: string[] = [];

for (const l of lines) {
  board.push(l.trim().split(/\s+/));
  boardStrings.push(l);
}

let part1Result = 0;
for (let x = 0; x < board[0].length; x++) {
  const column: number[] = [];
  for (let y = 0; y < board.length; y++) {
    column.push(Number(board[y][x]));
  }
  const sign = column.pop()!;

  const op = board[board.length - 1][x];
  const numbers = column.slice(0, board.length - 1);
  part1Result += operate(numbers, op);
}
console.log(`Part 1: ${part1Result}`);

let part2Result = 0;
let calculationsRow: number[] = [];
const numCols = boardStrings[0].length;

for (let x = numCols - 1; x >= 0; x--) {
  const columnChars: string[] = [];
  let sign = "";
  let isEmpty = true;

  for (let y = 0; y < boardStrings.length; y++) {
    const elem = boardStrings[y][x];
    if (elem !== " ") isEmpty = false;

    if (elem === "+") sign = "+";
    else if (elem === "*") sign = "*";
    else columnChars.push(elem);
  }

  if (!isEmpty) {
    calculationsRow.push(Number(columnChars.join("")));
  }

  if (sign !== "") {
    part2Result += operate(calculationsRow, sign);
    calculationsRow = [];
  }
}

console.log(`Part 2: ${part2Result}`);
