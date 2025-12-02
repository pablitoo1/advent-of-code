import { readFileSync } from "fs";

const inputFile = "src/2024/day15/day15.txt";
const input = readFileSync(inputFile, "utf-8");

const grid = input.split(/(?:\r?\n){2}/);

const MOVES: Map<string, [number, number]> = new Map([
  ["<", [0, -1]],
  [">", [0, 1]],
  ["^", [-1, 0]],
  ["v", [1, 0]],
]);

function solvePart1(grid: string[][], moves: string[]): number {
  let x: number | null = null;
  let y: number | null = null;

  for (let i = 0; x === null && i < grid.length; ++i) {
    for (let j = 0; j < grid[0].length; ++j) {
      if (grid[i][j] === "@") {
        x = j;
        y = i;
        break;
      }
    }
  }

  if (x === null || y === null) {
    return 0;
  }

  for (let move of moves) {
    const [yOff, xOff] = MOVES.get(move)!;

    const newX: number = x + xOff;
    const newY: number = y + yOff;

    if (grid[newY][newX] === ".") {
      grid[newY][newX] = "@";
      grid[y][x] = ".";
      y = newY;
      x = newX;
      continue;
    }

    if (grid[newY][newX] === "#") {
      continue;
    }

    let destX = newX + xOff;
    let destY = newY + yOff;

    while (true) {
      if (grid[destY][destX] === "#") {
        break;
      }

      if (grid[destY][destX] === ".") {
        grid[newY][newX] = "@";
        grid[y][x] = ".";
        grid[destY][destX] = "O";
        y = newY;
        x = newX;
        break;
      }

      destX += xOff;
      destY += yOff;
    }
  }

  let result = 0;

  for (let i = 0; i < grid.length; ++i) {
    for (let j = 0; j < grid[0].length; ++j) {
      if (grid[i][j] === "O") {
        result += i * 100 + j;
      }
    }
  }

  return result;
}

function solvePart2(input: string[]): number {
  const grid: string[][] = input[0]
    .replace(/\#/g, "##")
    .replace(/\O/g, "[]")
    .replace(/\./g, "..")
    .replace(/\@/g, "@.")
    .split(/\r?\n/)
    .map((x) => x.split(""));
  const moves: string[] = input[1].replace(/[\r\n]/g, "").split("");

  let x: number | null = null,
    y: number | null = null;

  for (let i = 0; x === null && i < grid.length; ++i) {
    for (let j = 0; j < grid[0].length; ++j) {
      if (grid[i][j] === "@") {
        x = j;
        y = i;
        break;
      }
    }
  }

  for (let move of moves) {
    const [yOff, xOff] = MOVES.get(move)!;

    const newX = x! + xOff;
    const newY = y! + yOff;

    if (grid[newY][newX] === ".") {
      grid[newY][newX] = "@";
      grid[y!][x!] = ".";
      y = newY;
      x = newX;
      continue;
    }
    if (grid[newY][newX] === "#") {
      continue;
    }

    const [boxL_x, boxL_y, boxR_x, boxR_y] = getBoxBounds(newY, newX);

    if (shiftBox(true, boxL_y, boxL_x, boxR_y, boxR_x, yOff, xOff)) {
      shiftBox(false, boxL_y, boxL_x, boxR_y, boxR_x, yOff, xOff);
      grid[y!][x!] = ".";
      grid[newY][newX] = "@";
      y = newY;
      x = newX;
    }
  }

  let result = 0;

  for (let i = 0; i < grid.length; ++i) {
    for (let j = 0; j < grid[0].length; ++j) {
      if (grid[i][j] === "[") {
        result += i * 100 + j;
      }
    }
  }

  return result;

  function shiftBox(
    dryRun: boolean,
    boxL_y: number,
    boxL_x: number,
    boxR_y: number,
    boxR_x: number,
    yOff: number,
    xOff: number
  ): boolean {
    let q: [number, number, string][] = [
      [boxL_y, boxL_x, "["],
      [boxR_y, boxR_x, "]"],
    ];
    let q2: [number, number, string][] = [];
    const seen = new Set([toDp(boxL_y, boxL_x), toDp(boxR_y, boxR_x)]);
    const placed = new Set<number>();

    while (q.length) {
      const [moveY, moveX, val] = q.pop()!;
      if (!dryRun) {
        if (!placed.has(toDp(moveX, moveY))) grid[moveY][moveX] = ".";
      }

      const newY = moveY + yOff;
      const newX = moveX + xOff;

      if (grid[newY][newX] === ".") {
      } else if (grid[newY][newX] === "#") {
        return false;
      } else {
        const [box2L_x, box2L_y, box2R_x, box2R_y] = getBoxBounds(newY, newX);
        if (!seen.has(toDp(box2L_y, box2L_x))) {
          seen.add(toDp(box2L_y, box2L_x));
          seen.add(toDp(box2R_y, box2R_x));

          q2.push([box2L_y, box2L_x, "["], [box2R_y, box2R_x, "]"]);
        }
      }

      if (!dryRun) {
        placed.add(toDp(newX, newY));
        grid[newY][newX] = val;
      }

      if (!q.length) {
        [q, q2] = [q2, q];
      }
    }
    return true;
  }

  function toDp(x: number, y: number): number {
    return y * grid[0].length + x;
  }

  function getBoxBounds(
    y: number,
    x: number
  ): [number, number, number, number] {
    let box2L_x, box2L_y, box2R_x, box2R_y;
    if (grid[y][x] === "[") {
      box2L_x = x;
      box2L_y = y;
    } else {
      box2L_x = x - 1;
      box2L_y = y;
    }
    box2R_x = box2L_x + 1;
    box2R_y = box2L_y;

    return [box2L_x, box2L_y, box2R_x, box2R_y];
  }
}

const gridPart1: string[][] = grid[0]
  .split(/\r?\n/)
  .map((row) => row.split(""));
const moves: string[] = grid[1].replace(/[\r\n]/g, "").split("");

const part1Result = solvePart1([...gridPart1], [...moves]);

const part2Result = solvePart2(grid);

console.log("Part 1:", part1Result);
console.log("Part 2:", part2Result);
