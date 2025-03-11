import * as readline from "node:readline";

export class ConsoleIO {
  //   private rl: readline.Interface;

  constructor(private rl: readline.Interface) {}

  display(message: string) {
    this.rl.write(`${message}`);
  }

  promptInput(handleInput: (input: string) => void) {
    this.rl.question(">", handleInput);
  }

  close() {
    this.rl.close();
  }
}
