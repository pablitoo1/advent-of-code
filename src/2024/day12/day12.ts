import { readFileSync } from "fs";

const inputFilePath = "src/2024/day12/day12.txt";
const input = readFileSync(inputFilePath, "utf-8");

//Part 1
const grid = input.split(/\r?\n/).filter((line) => line.length > 0);

const DIRECTIONS: [number, number][] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

function exploreRegionDFS(
  grid: string[],
  visited: boolean[][],
  gridWidth: number,
  gridHeight: number,
  startX: number,
  startY: number
): Set<string> {
  if (visited[startX][startY]) return new Set();

  visited[startX][startY] = true;
  const region = new Set<string>();
  region.add(`${startX},${startY}`);

  for (const [dx, dy] of DIRECTIONS) {
    const nextX = startX + dx;
    const nextY = startY + dy;

    if (
      nextX >= 0 &&
      nextX < gridWidth &&
      nextY >= 0 &&
      nextY < gridHeight &&
      grid[startX][startY] === grid[nextX][nextY] &&
      !visited[nextX][nextY]
    ) {
      const adjacentRegion = exploreRegionDFS(
        grid,
        visited,
        gridWidth,
        gridHeight,
        nextX,
        nextY
      );
      for (const point of adjacentRegion) {
        region.add(point);
      }
    }
  }
  return region;
}

function calculateRegionPerimeter(region: Set<string>): number {
  let perimeter = 0;
  for (const point of region) {
    const [x, y] = point.split(",").map(Number);
    perimeter += 4;
    for (const [dx, dy] of DIRECTIONS) {
      const neighbor = `${x + dx},${y + dy}`;
      if (region.has(neighbor)) {
        perimeter -= 1;
      }
    }
  }
  return perimeter;
}

function calculateTotalPerimeter(grid: string[]): number {
  const gridWidth = grid.length;
  const gridHeight = grid[0].length;
  const visited: boolean[][] = Array.from({ length: gridWidth }, () =>
    Array(gridHeight).fill(false)
  );
  let totalPerimeter = 0;

  for (let x = 0; x < gridWidth; x++) {
    for (let y = 0; y < gridHeight; y++) {
      if (!visited[x][y]) {
        const region = exploreRegionDFS(
          grid,
          visited,
          gridWidth,
          gridHeight,
          x,
          y
        );
        totalPerimeter += region.size * calculateRegionPerimeter(region);
      }
    }
  }
  return totalPerimeter;
}

//Part 2
const gardenMap: string[][] = [];
for (const line of input.split("\n")) {
  if (line.trim()) {
    gardenMap.push(line.trim().split(""));
  }
}

function getArea(regionCells: [number, number][]): number {
  return regionCells.length;
}

function getPerimeterSides(
  regionCells: [number, number][],
  gardenMap: string[][]
): Set<{ coord: [number, number]; direction: string }> {
  const fenceCoords = new Set<{ coord: [number, number]; direction: string }>();
  const rows = gardenMap.length;
  const cols = gardenMap[0]?.length || 0;

  for (const [r, c] of regionCells) {
    if (r === 0 || gardenMap[r - 1][c] !== gardenMap[r][c]) {
      fenceCoords.add({ coord: [r, c], direction: "U" });
    }
    if (r === rows - 1 || gardenMap[r + 1][c] !== gardenMap[r][c]) {
      fenceCoords.add({ coord: [r, c], direction: "D" });
    }
    if (c === 0 || gardenMap[r][c - 1] !== gardenMap[r][c]) {
      fenceCoords.add({ coord: [r, c], direction: "L" });
    }
    if (c === cols - 1 || gardenMap[r][c + 1] !== gardenMap[r][c]) {
      fenceCoords.add({ coord: [r, c], direction: "R" });
    }
  }
  return fenceCoords;
}

function fenceToSides(
  fenceCoords: Set<{ coord: [number, number]; direction: string }>
): number {
  const edges: Map<string, [number, number]> = new Map();

  for (const {
    coord: [row, col],
    direction,
  } of fenceCoords) {
    let neighborRow = row;
    let neighborCol = col;

    if (direction === "U") neighborRow -= 1;
    else if (direction === "D") neighborRow += 1;
    else if (direction === "L") neighborCol -= 1;
    else if (direction === "R") neighborCol += 1;

    const edgeRow = (row + neighborRow) / 2;
    const edgeCol = (col + neighborCol) / 2;
    const edgeKey = `${edgeRow},${edgeCol}`;

    edges.set(edgeKey, [edgeRow - row, edgeCol - col]);
  }

  const visitedEdges = new Set<string>();
  let sideCount = 0;

  for (const edgeKey of edges.keys()) {
    if (visitedEdges.has(edgeKey)) continue;
    visitedEdges.add(edgeKey);
    sideCount++;

    const [edgeRow, edgeCol] = edgeKey.split(",").map(Number);
    const direction = edges.get(edgeKey) as [number, number];

    if (edgeRow % 1 === 0) {
      for (const deltaRow of [-1, 1]) {
        let currentRow = edgeRow + deltaRow;
        let nextEdgeKey = `${currentRow},${edgeCol}`;
        while (edges.get(nextEdgeKey)?.toString() === direction.toString()) {
          visitedEdges.add(nextEdgeKey);
          currentRow += deltaRow;
          nextEdgeKey = `${currentRow},${edgeCol}`;
        }
      }
    } else {
      for (const deltaCol of [-1, 1]) {
        let currentCol = edgeCol + deltaCol;
        let nextEdgeKey = `${edgeRow},${currentCol}`;
        while (edges.get(nextEdgeKey)?.toString() === direction.toString()) {
          visitedEdges.add(nextEdgeKey);
          currentCol += deltaCol;
          nextEdgeKey = `${edgeRow},${currentCol}`;
        }
      }
    }
  }

  return sideCount;
}

function findRegions(gardenMap: string[][]): [number, number][][] {
  const visitedCells = new Set<string>();
  const allRegions: [number, number][][] = [];
  const totalRows = gardenMap.length;
  const totalCols = gardenMap[0]?.length || 0;

  function dfs(
    startRow: number,
    startCol: number,
    cropType: string
  ): [number, number][] {
    const stack: [number, number][] = [[startRow, startCol]];
    const currentRegion: [number, number][] = [];

    while (stack.length) {
      const [row, col] = stack.pop()!;
      const cellKey = `${row},${col}`;
      if (visitedCells.has(cellKey)) continue;

      visitedCells.add(cellKey);
      currentRegion.push([row, col]);

      for (const [deltaRow, deltaCol] of DIRECTIONS) {
        const neighborRow = row + deltaRow;
        const neighborCol = col + deltaCol;
        const neighborKey = `${neighborRow},${neighborCol}`;

        if (
          neighborRow >= 0 &&
          neighborRow < totalRows &&
          neighborCol >= 0 &&
          neighborCol < totalCols &&
          gardenMap[neighborRow][neighborCol] === cropType &&
          !visitedCells.has(neighborKey)
        ) {
          stack.push([neighborRow, neighborCol]);
        }
      }
    }
    return currentRegion;
  }

  for (let row = 0; row < totalRows; row++) {
    for (let col = 0; col < totalCols; col++) {
      const cellKey = `${row},${col}`;
      if (!visitedCells.has(cellKey)) {
        allRegions.push(dfs(row, col, gardenMap[row][col]));
      }
    }
  }
  return allRegions;
}

const part1Result = calculateTotalPerimeter(grid);
console.log("Part 1:", part1Result);

const regions = findRegions(gardenMap);
let part2Result = 0;
for (const region of regions) {
  const area = getArea(region);
  const fenceCoords = getPerimeterSides(region, gardenMap);
  const sidesAmount = fenceToSides(fenceCoords);
  part2Result += area * sidesAmount;
}

console.log("Part 2:", part2Result);
