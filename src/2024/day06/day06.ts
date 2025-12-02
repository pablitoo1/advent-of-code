import { readFileSync } from "fs";

const inputFile = "src/2024/day06/day06.txt";
const input = readFileSync(inputFile, "utf-8");

//Part 1
const lines = input.trim().split("\n");
const DIRECTIONS: ("^" | ">" | "v" | "<")[] = ["^", ">", "v", "<"];
const MOVEMENTS: Record<"^" | ">" | "v" | "<", { x: number; y: number }> = {
    "^": { x: 0, y: -1 },
    ">": { x: 1, y: 0 },
    "v": { x: 0, y: 1 },
    "<": { x: -1, y: 0 }
};
let guardPosition = { x: 0, y: 0 };
let guardDirection: "^" | ">" | "v" | "<" = "^";
const labMap: string[][] = lines.map((line, y) => {
    return line.split("").map((char, x) => {
        if (DIRECTIONS.includes(char as "^" | ">" | "v" | "<")) {
            guardPosition = { x, y };
            guardDirection = char as "^" | ">" | "v" | "<";
            return ".";
        }
        return char;
    });
});
const visitedMap: boolean[][] = Array.from({ length: labMap.length }, () =>
    Array(labMap[0].length).fill(false)
);
visitedMap[guardPosition.y][guardPosition.x] = true;
const isWithinBounds = (x: number, y: number): boolean => {
    return y >= 0 && y < labMap.length && x >= 0 && x < labMap[0].length;
};
while (true) {
    const move = MOVEMENTS[guardDirection];
    const nextX = guardPosition.x + move.x;
    const nextY = guardPosition.y + move.y;
    if (isWithinBounds(nextX, nextY) && labMap[nextY][nextX] === "#") {
        guardDirection = DIRECTIONS[(DIRECTIONS.indexOf(guardDirection) + 1) % 4];
    } else if (isWithinBounds(nextX, nextY)) {
        guardPosition.x = nextX;
        guardPosition.y = nextY;
        visitedMap[nextY][nextX] = true;
    } else {
        break;
    }
}
let part1Result = 0;
for (let y = 0; y < visitedMap.length; y++) {
    for (let x = 0; x < visitedMap[y].length; x++) {
        if (visitedMap[y][x]) {
            part1Result++;
        }
    }
}
console.log("Part 1:", part1Result);

//Part2
const grid = input.trim().split("\n").map(line => line.split(""));

const numRows = grid.length;
const numCols = grid[0].length;

let foundStart = false;
let startRow = 0, startCol = 0;

for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
        if (grid[row][col] === "^") {
            foundStart = true;
            startRow = row;
            startCol = col;
            break;
        }
    }
    if (foundStart) break;
}

const directions = [
    [-1, 0], // top
    [0, 1],  // right
    [1, 0],  // bottom
    [0, -1]  // left
];

let currentDirection = 0;
const visitedPositions = new Set<string>();
let currentRow = startRow, currentCol = startCol;

while (true) {
    visitedPositions.add(`${currentRow},${currentCol}`);

    const nextRow = currentRow + directions[currentDirection][0];
    const nextCol = currentCol + directions[currentDirection][1];

    if (!(0 <= nextRow && nextRow < numRows && 0 <= nextCol && nextCol < numCols)) {
        break;
    }

    if (grid[nextRow][nextCol] === "#") {
        currentDirection = (currentDirection + 1) % 4;
    } else {
        currentRow = nextRow;
        currentCol = nextCol;
    }
}

function causesLoop(obstacleRow: number, obstacleCol: number): boolean {
    if (grid[obstacleRow][obstacleCol] === "#") {
        return false;
    }

    grid[obstacleRow][obstacleCol] = "#";
    let row = startRow, col = startCol;
    let direction = 0;

    const visitedStates = new Set<string>();
    while (true) {
        const stateKey = `${row},${col},${direction}`;
        if (visitedStates.has(stateKey)) {
            grid[obstacleRow][obstacleCol] = ".";
            return true;
        }
        visitedStates.add(stateKey);

        const nextRow = row + directions[direction][0];
        const nextCol = col + directions[direction][1];

        if (!(0 <= nextRow && nextRow < numRows && 0 <= nextCol && nextCol < numCols)) {
            grid[obstacleRow][obstacleCol] = ".";
            return false;
        }

        if (grid[nextRow][nextCol] === "#") {
            direction = (direction + 1) % 4;
        } else {
            row = nextRow;
            col = nextCol;
        }
    }
}

let part2Result = 0;
visitedPositions.forEach(position => {
    const [obstacleRow, obstacleCol] = position.split(",").map(Number);
    if (causesLoop(obstacleRow, obstacleCol)) {
        part2Result++;
    }
});

console.log("Part 2:", part2Result);
