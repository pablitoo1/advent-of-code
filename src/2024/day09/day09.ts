import { readFileSync } from "fs";

const inputFile = "src/2024/day09/day09.txt";
const input = readFileSync(inputFile, "utf-8");

const diskMap = input.trim();

function calculateChecksum(shouldMoveFiles: boolean, diskMap: string): number {
    const files: Array<[number, number, number]> = [];      //[position, size, file's ID]
    const freeSpaces: Array<[number, number]> = [];         //[position, size]
    const diskState: (number | null)[] = [];
    let fileID = 0;
    let position = 0;

    for (let i = 0; i < diskMap.length; i++) {
        const currentChar = diskMap[i];
        if (i % 2 === 0) {
            if (shouldMoveFiles) {
                files.push([position, parseInt(currentChar), fileID]);
            }
            for (let j = 0; j < parseInt(currentChar); j++) {
                diskState.push(fileID);
                if (!shouldMoveFiles) {
                    files.push([position, 1, fileID]);
                }
                position += 1;
            }
            fileID += 1;
        } else {
            freeSpaces.push([position, parseInt(currentChar)]);
            for (let j = 0; j < parseInt(currentChar); j++) {
                diskState.push(null);
                position += 1;
            }
        }
    }

    for (let [position, fileSize, fileID] of files.reverse()) {
        for (let freeSpaceIdx = 0; freeSpaceIdx < freeSpaces.length; freeSpaceIdx++) {
            const [freeSpacePosition, freeSpaceSize] = freeSpaces[freeSpaceIdx];
            if (freeSpacePosition < position && fileSize <= freeSpaceSize) {
                for (let i = 0; i < fileSize; i++) {
                    if (diskState[position + i] !== fileID) {
                        throw new Error(`Assertion failed at position ${position + i}`);
                    }
                    diskState[position + i] = null;
                    diskState[freeSpacePosition + i] = fileID;
                }
                freeSpaces[freeSpaceIdx] = [freeSpacePosition + fileSize, freeSpaceSize - fileSize];
                break;
            }
        }
    }

    let checksum = 0;
    for (let i = 0; i < diskState.length; i++) {
        const currentFileID = diskState[i];
        if (currentFileID !== null) {
            checksum += i * currentFileID;
        }
    }

    return checksum;
}

const part1Checksum = calculateChecksum(false, diskMap);
const part2Checksum = calculateChecksum(true, diskMap);

console.log("Part 1:", part1Checksum);
console.log("Part 2:", part2Checksum);
