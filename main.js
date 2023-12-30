const util = require("util");
let exec = require("child_process").exec;
exec = util.promisify(exec);
const readline = require("readline");
const commands = require("./commands");

async function executeCommand(command) {
  try {
    const { stdout, stderr } = await exec(command);
    return { stdout, stderr };
  } catch (err) {
    throw err;
  }
}

async function setPassword(question = "Enter password: ") {
  const input = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
  const stdin = process.stdin;
  const inputHandler = function (char) {
    char = char + "";
    switch (char) {
      case "\n":
      case "\r":
      case "\u0004":
        stdin.removeListener("data", inputHandler);
        break;
      default:
        process.stdout.write("\x1B[2K\x1B[200D" + question); // Clear the input line
        break;
    }
  };
  return new Promise((res) => {
    process.stdin.on("data", inputHandler);
    input.question(question, (pass) => {
      input.close();
      input.history = input.history.slice(1);
      res(pass);
    });
  });
}

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

// async function executeSelection(command) {
//   return new Promise(async (res) => {
//     try {
//       const { stdout, stderr } = await executeCommand(command);
//       console.log(stdout, stderr);
//     } catch (err) {
//       console.error("Command execution failed:", err);
//     }
//     res(true);
//   });
// }

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
  // Set password
  const password = await setPassword();
  const res1 = await executeCommand(`export SSHPASS=${password}`);
  console.log(res1);
  const res2 = await executeCommand(`echo $SSHPASS`);
  // console.log(process.env.SSHPASS);

  while (true) {
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
