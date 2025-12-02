import { readFileSync } from "fs";

const inputFile = "src/2024/day17/day17.txt";
const input = readFileSync(inputFile, "utf-8");
const lines = input.trim().split("\n");

const bigIntPow = (base: bigint, exponent: bigint): bigint => {
  let result = 1n;
  for (let i = 0n; i < exponent; i++) {
    result *= base;
  }
  return result;
};

interface Registers {
  A: bigint;
  B: bigint;
  C: bigint;
}

const emulate1 = (
  operator: number,
  operand: number,
  reg: Registers,
  out: number[],
  ip: number
): number => {
  const getCombo = (operand: number): bigint => {
    if (operand >= 0 && operand <= 3) return BigInt(operand);
    if (operand === 4) return reg.A;
    if (operand === 5) return reg.B;
    if (operand === 6) return reg.C;
    throw new Error("Invalid operand");
  };

  switch (operator) {
    case 0: // adv
      reg.A = reg.A / bigIntPow(2n, getCombo(operand));
      break;
    case 1: // bxl
      reg.B ^= BigInt(operand);
      break;
    case 2: // bst
      reg.B = getCombo(operand) % 8n;
      break;
    case 3: // jnz
      if (reg.A !== 0n) return operand;
      break;
    case 4: // bxc
      reg.B ^= reg.C;
      break;
    case 5: // out
      out.push(Number(getCombo(operand) % 8n));
      break;
    case 6: // bdv
      reg.B = reg.A / bigIntPow(2n, getCombo(operand));
      break;
    case 7: // cdv
      reg.C = reg.A / bigIntPow(2n, getCombo(operand));
      break;
    default:
      throw new Error("Invalid operator");
  }
  return ip + 2;
};

const runProgram = (reg: Registers, program: number[]): number[] => {
  const out: number[] = [];
  let ip = 0;

  while (ip < program.length) {
    const operator = program[ip];
    const operand = program[ip + 1];
    ip = emulate1(operator, operand, reg, out, ip);
  }
  return out;
};

const readInput = (lines: string[]): { reg: Registers; program: number[] } => {
  const reg: Registers = { A: 0n, B: 0n, C: 0n };
  const program: number[] = [];

  for (const line of lines) {
    if (line.startsWith("Register A:")) {
      reg.A = BigInt(parseInt(line.split(": ")[1]));
    } else if (line.startsWith("Register B:")) {
      reg.B = BigInt(parseInt(line.split(": ")[1]));
    } else if (line.startsWith("Register C:")) {
      reg.C = BigInt(parseInt(line.split(": ")[1]));
    } else if (line.startsWith("Program:")) {
      program.push(
        ...line
          .split(": ")[1]
          .split(",")
          .map((x) => parseInt(x, 10))
      );
    }
  }

  return { reg, program };
};

const part1Result = (lines: string[]): string => {
  const { reg, program } = readInput(lines);
  const output = runProgram(reg, program);
  return output.join(",");
};

const part2Result = (lines: string[]): bigint => {
  const { reg, program } = readInput(lines);

  const recu = (
    program: number[],
    reg: Registers,
    level: number,
    base: bigint
  ): bigint | null => {
    for (let i = 0n; i < 8n; i++) {
      const r: Registers = { ...reg };
      r.A = base + bigIntPow(8n, BigInt(level)) * i;

      if (r.A < 0n) continue;

      const out = runProgram(r, program);
      if (out.join(",") === program.join(",")) {
        return base + bigIntPow(8n, BigInt(level)) * i;
      }

      if (
        out.length === program.length &&
        out.slice(level).join(",") === program.slice(level).join(",")
      ) {
        const ans = recu(
          program,
          reg,
          level - 1,
          base + bigIntPow(8n, BigInt(level)) * i
        );
        if (ans !== null) return ans;
      }
    }
    return null;
  };

  const result = recu(program, reg, program.length - 1, 0n);
  if (result === null) throw new Error("No solution found");
  return result;
};

console.log("Part 1:", part1Result(lines));
console.log("Part 2:", part2Result(lines).toString());
