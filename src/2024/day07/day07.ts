import { readFileSync } from "fs";

const inputFile = "src/2024/day07/day07.txt";
const input = readFileSync(inputFile, "utf-8");

function parseInput(input: string): { target: number; numbers: number[] }[] {
  return input.split("\n").filter(Boolean).map((line) => {
    const [targetStr, numbersStr] = line.split(": ");
    const target = parseInt(targetStr);
    const numbers = numbersStr.split(" ").map(Number);
    return { target, numbers };
  });
}

function generateOperatorCombinations(length: number, operators: string[]): string[][] {
  const result: string[][] = [];

  function backtrack(current: string[]) {
    if (current.length === length) {
      result.push([...current]);
      return;
    }
    for (const op of operators) {
      current.push(op);
      backtrack(current);
      current.pop();
    }
  }

  backtrack([]);
  return result;
}

function evaluate(numbers: number[], operators: string[]): number {
  let result = numbers[0];
  for (let i = 0; i < operators.length; i++) {
    const nextNumber = numbers[i + 1];
    if (operators[i] === "+") {
      result += nextNumber;
    } else if (operators[i] === "*") {
      result *= nextNumber;
    } else if (operators[i] === "||") {
      result = parseInt(`${result}${nextNumber}`);
    }
  }
  return result;
}

function canReachTarget(target: number, numbers: number[], operators: string[]): boolean {
  const operatorCombinations = generateOperatorCombinations(numbers.length - 1, operators);
  for (const ops of operatorCombinations) {
    if (evaluate(numbers, ops) === target) {
      return true;
    }
  }
  return false;
}

function findCalibrationResult(input: string, operators: string[]): number {
  const equations = parseInput(input);
  let total = 0;

  for (const { target, numbers } of equations) {
    if (canReachTarget(target, numbers, operators)) {
      total += target;
    }
  }

  return total;
}

const part1Operators = ["+", "*"];
const part1Result = findCalibrationResult(input, part1Operators);
console.log("Part 1:", part1Result);

const part2Operators = ["+", "*", "||"];
const part2Result = findCalibrationResult(input, part2Operators);
console.log("Part 2:", part2Result);
