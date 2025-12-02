const { exec } = require("child_process");

const dayArg = process.argv[2];

const yearArg = process.argv[3];

if (yearArg && isNaN(parseInt(yearArg, 10))) {
  console.error("The year argument must be a number.");
  process.exit(1);
}

if (yearArg && (yearArg !== "2025" && yearArg !== "2024")) {
  console.error("The year is not valid.");
  process.exit(1);
}

if (yearArg) {
  console.log("You have choosen to run year", yearArg, "instead of current year.");
}

if (!dayArg) {
  console.error("Set day number: npm run day 1");
  process.exit(1);
}

const day = parseInt(dayArg, 10);
if (isNaN(day) || day < 1 || day > 25) {
  console.error("The day number must be a number between 1 and 25.");
  process.exit(1);
}

const paddedDay = day.toString().padStart(2, "0");

const command = `npx ts-node src/${yearArg ?? '2025'}/day${paddedDay}/day${paddedDay}.ts`;

console.log(`[${yearArg ?? '2025'}] Starting day ${day}...`);

exec(command, (err, stdout, stderr) => {
  if (err) {
    console.error(`Error during starting day ${day}:`, stderr);
    process.exit(err.code);
  }
  console.log(stdout);
});
