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

module.exports = setPassword;
