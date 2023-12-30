const util = require("util");
let exec = require("child_process").exec;
exec = util.promisify(exec);
const readline = require("readline");
const commands = require("./commands");

function createList(commands) {
  let list = "";
  let newLine = "\n";
  for (let i = 0; i < commands.length; i++) {
    list = list.concat(`${i}: ${commands[i]}`);
    list = list.concat(newLine);
  }
  list = list.concat("Choose command: ");
  return list;
}

const commandsListQuestion = createList(commands);

async function selectFunction(question = "Type 0 to exit") {
  return new Promise((res) => {
    const input = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });
    input.question(question, function (selection) {
      input.close();
      const value = parseInt(selection);
      if (isNaN(value)) return res(value);
      res(value);
    });
  });
}

async function executeCommand(command) {
  try {
    const { stdout, stderr } = await exec(command);
    return { stdout, stderr };
  } catch (err) {
    throw err;
  }
}

async function validateSelection(question = "Confirm (y/n): ") {
  return new Promise((res) => {
    const input = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });
    input.question(question, function (answer) {
      input.close();
      if (answer === "y" || answer === "yes") return res("y");
      res("n");
    });
  });
}

async function main() {
  while (true) {
    // select bash command
    const selection = await selectFunction(commandsListQuestion);
    if (selection === 0) break;
    if (selection >= commands.length) {
      console.log("Choose a valid option", "\n");
      continue;
    }
    const selectedCommand = commands[selection];
    console.log("Selected: ", selectedCommand);

    // validate selection with y/n
    const validation = await validateSelection();
    console.log();
    if (validation !== "y") continue;

    // run command
    let stdout = "";
    let stderr = "";
    try {
      ({ stdout, stderr } = await executeCommand(selectedCommand));
    } catch (err) {
      stderr = err;
    }
    if (stdout || stderr) console.log(stdout, stderr, "\n");
  }
  process.exit(0);
}

main();
