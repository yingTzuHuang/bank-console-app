import * as readline from "node:readline";

export class ConsoleIO {
  //   private rl: readline.Interface;

  constructor(private rl: readline.Interface) {}

  display(message: string) {
    this.rl.write(`${message}\n`);
  }

  promptInput(handleInput: (input: string) => void) {
    this.rl.question(">", (input) => handleInput(input));
  }

  close() {
    this.rl.close();
  }
}
