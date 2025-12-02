import { readFileSync } from "fs";

const inputFile = "src/2024/day13/day13.txt";
const input = readFileSync(inputFile, "utf-8").trim();
const lines = input.split("\n").map((line) => line.trim());

let x1 = 0,
  y1 = 0,
  x2 = 0,
  y2 = 0;

function parseButtonLine(line: string): void {
  const [_, button, x, y] = line.split(" ");
  const type = button.split(":")[0];
  const valueX = parseInt(x.slice(2, -1), 10);
  const valueY = parseInt(y.slice(2), 10);

  if (type === "A") {
    x1 = valueX;
    y1 = valueY;
  } else {
    x2 = valueX;
    y2 = valueY;
  }
}

function parsePrizeLine(line: string, add: number): number {
  const [_, cRaw, dRaw] = line.split(" ");
  const c = parseInt(cRaw.slice(2, -1), 10) + add;
  const d = parseInt(dRaw.slice(2), 10) + add;

  const a = (c * y2 - d * x2) / (x1 * y2 - y1 * x2);
  const b = (d * x1 - c * y1) / (x1 * y2 - y1 * x2);

  if (Number.isInteger(a) && Number.isInteger(b)) {
    return 3 * a + b;
  }
  return 0;
}

function solve(part: number): number {
  let tokens = 0;
  const add = part === 2 ? 10000000000000 : 0;

  for (const line of lines) {
    if (line.startsWith("Button")) {
      parseButtonLine(line);
    } else if (line.startsWith("Prize")) {
      tokens += parsePrizeLine(line, add);
    }
  }

  return tokens;
}

console.log("Part 1:", solve(1));
console.log("Part 2:", solve(2));
