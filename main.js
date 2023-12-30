const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function executeCommand(command) {
  try {
    const { stdout, stderr } = await exec(command);
    return { stdout, stderr };
  } catch (err) {
    throw err;
  }
}

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("close", function () {
  console.log("Goodbye!");
  process.exit(0);
});

function askQuestion() {
  rl.question("Please enter a command (enter '0' to exit): ", async function (answer) {
    if (answer === "0") {
      rl.close();
      return;
    }

    console.log("You entered: " + answer);
    try {
      const { stdout, stderr } = await executeCommand(answer);
      console.log(stdout, stderr);
    } catch (err) {
      console.error("Command execution failed:", err);
    }
    askQuestion();
  });
}

askQuestion(); // Start the loop
