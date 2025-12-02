import { readFileSync } from "fs";

const inputFile = "src/2024/day10/day10.txt";

const grid = readFileSync(inputFile, "utf-8")
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line: string) => line.trim().split("").map(Number));

const numRows = grid.length;
const numCols = grid[0].length;

function isInBounds(row: number, col: number): boolean {
    return 0 <= row && row < numRows && 0 <= col && col < numCols;
}

function getNeighbours(row: number, col: number): { i: number; j: number }[] {
    const movements = [
        { i: 0, j: 1 }, 
        { i: 0, j: -1 }, 
        { i: 1, j: 0 }, 
        { i: -1, j: 0 }
    ];

    return movements
        .map(move => ({ i: row + move.i, j: col + move.j }))
        .filter(nbr => isInBounds(nbr.i, nbr.j));
}

function dfs(startRow: number, startCol: number): [number, number] {
    const highPointsSet = new Set<string>();
    let peakCount = 0;
    const queue: { i: number; j: number }[] = [{ i: startRow, j: startCol }];

    while (queue.length > 0) {
        const current = queue.pop()!;
        if (grid[current.i][current.j] === 9) {
            peakCount += 1;
            highPointsSet.add(`${current.i},${current.j}`);
        }
        for (const nbr of getNeighbours(current.i, current.j)) {
            if (grid[nbr.i][nbr.j] === 1 + grid[current.i][current.j]) {
                queue.push(nbr);
            }
        }
    }

    return [highPointsSet.size, peakCount];
}

function calculateResults(): [number, number] {
    let totalScore = 0;
    let totalPeakCount = 0;

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            if (grid[row][col] === 0) {
                const [score, peakCount] = dfs(row, col);
                totalScore += score;
                totalPeakCount += peakCount;
            }
        }
    }

    return [totalScore, totalPeakCount];
}

const [part1Result, part2Result] = calculateResults();

console.log(`Part 1: ${part1Result}`);
console.log(`Part 2: ${part2Result}`);
