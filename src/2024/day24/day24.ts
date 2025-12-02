import { createInterface } from "readline";
import { createReadStream } from "fs";
import * as path from "path";

const inputPath = path.join(__dirname, "day24.txt");

const OPERATORS: Record<string, (a: number, b: number) => number> = {
  AND: (a, b) => a & b,
  OR: (a, b) => a | b,
  XOR: (a, b) => a ^ b,
};

const inputs: Record<string, number> = {};
const gates: Record<string, [string, string, string]> = {};
const edges: Record<string, string[]> = {};
let inputLines: string[] = [];
let gateLines: string[] = [];

const inputStream = createReadStream(inputPath, "utf-8");
const rl = createInterface({
  input: inputStream,
  output: process.stdout,
});

rl.on("line", (line) => {
  if (!line.trim()) {
    rl.on("line", (gateLine) => {
      gateLines.push(gateLine.trim());
    });
  } else {
    inputLines.push(line.trim());
  }
});

rl.on("close", () => {
  for (const line of inputLines) {
    const [x, y] = line.split(": ");
    inputs[x] = parseInt(y, 10);
  }

  for (const line of gateLines) {
    const [left, outputWire] = line.split(" -> ");
    const [wire1, op, wire2] = left.split(" ");
    gates[outputWire] = [wire1, op, wire2];
    edges[wire1] = edges[wire1] || [];
    edges[wire2] = edges[wire2] || [];
    edges[wire1].push(outputWire);
    edges[wire2].push(outputWire);
  }

  const wires = [...Object.keys(inputs), ...Object.keys(gates)];
  const zWires = wires
    .filter((wire) => wire.startsWith("z"))
    .sort()
    .reverse();

  const sortedWires: string[] = [];
  const inDegree: Record<string, number> = {};

  for (const wire of wires) {
    for (const wireTo of edges[wire] || []) {
      inDegree[wireTo] = (inDegree[wireTo] || 0) + 1;
    }
  }

  const stack: string[] = wires.filter((wire) => (inDegree[wire] || 0) === 0);
  while (stack.length > 0) {
    const wire = stack.shift()!;
    sortedWires.push(wire);
    for (const wireTo of edges[wire] || []) {
      inDegree[wireTo] -= 1;
      if (inDegree[wireTo] === 0) {
        stack.push(wireTo);
      }
    }
  }

  if (sortedWires.length !== wires.length) {
    throw new Error("Topological sort failed: cycle detected.");
  }

  const outputs: Record<string, number> = {};
  for (const wire of sortedWires) {
    if (inputs[wire] !== undefined) {
      outputs[wire] = inputs[wire];
    } else {
      const [wire1, op, wire2] = gates[wire];
      outputs[wire] = OPERATORS[op](outputs[wire1], outputs[wire2]);
    }
  }

  //Part2

  const gateAnd: (string | null)[] = Array(45).fill(null);
  const gateXor: (string | null)[] = Array(45).fill(null);
  const gateZ: (string | null)[] = Array(45).fill(null);
  const gateTmp: (string | null)[] = Array(45).fill(null);
  const gateCarry: (string | null)[] = Array(45).fill(null);
  const swaps: string[] = [];

  function findRule(
    wire1: string,
    operation: string,
    wire2: string
  ): string | null {
    for (const [outputWire, [w1, op, w2]] of Object.entries(gates)) {
      if (
        (wire1 === w1 && wire2 === w2 && operation === op) ||
        (wire1 === w2 && wire2 === w1 && operation === op)
      ) {
        return outputWire;
      }
    }
    return null;
  }

  function swap(wire1: string, wire2: string): void {
    const temp = gates[wire1];
    gates[wire1] = gates[wire2];
    gates[wire2] = temp;
    swaps.push(wire1, wire2);
  }

  let i = 0;
  let x = `x${i.toString().padStart(2, "0")}`;
  let y = `y${i.toString().padStart(2, "0")}`;
  gateAnd[i] = findRule(x, "AND", y);
  gateXor[i] = findRule(x, "XOR", y);
  gateZ[i] = gateXor[i];
  gateCarry[i] = gateAnd[i];

  for (i = 1; i < 45; i++) {
    x = `x${i.toString().padStart(2, "0")}`;
    y = `y${i.toString().padStart(2, "0")}`;
    const z = `z${i.toString().padStart(2, "0")}`;
    let check = true;

    while (check) {
      check = false;

      gateAnd[i] = findRule(x, "AND", y);
      gateXor[i] = findRule(x, "XOR", y);

      const [w1, w2] = gates[z] || [];
      if (w1 === gateCarry[i - 1] && w2 !== gateXor[i]) {
        swap(w2, gateXor[i]!);
        check = true;
        continue;
      }
      if (w2 === gateCarry[i - 1] && w1 !== gateXor[i]) {
        swap(w1, gateXor[i]!);
        check = true;
        continue;
      }

      gateZ[i] = findRule(gateXor[i]!, "XOR", gateCarry[i - 1]!);
      if (gateZ[i] !== z) {
        swap(gateZ[i]!, z);
        check = true;
        continue;
      }

      gateTmp[i] = findRule(gateXor[i]!, "AND", gateCarry[i - 1]!);
      gateCarry[i] = findRule(gateTmp[i]!, "OR", gateAnd[i]!);
    }
  }

  const binaryResult = zWires.map((wire) => outputs[wire]).join("");
  const part1Result = parseInt(binaryResult, 2);
  console.log(`Part 1: ${part1Result}`);

  const part2Result = swaps.sort().join(",");
  console.log(`Part 2: ${part2Result}`);
});
