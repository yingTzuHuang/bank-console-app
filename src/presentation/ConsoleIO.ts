import * as readline from "node:readline";

export class ConsoleIO {
  constructor(private rl: readline.Interface) {}

  display(message: string) {
    this.rl.write(`${message}\n`);
  }

  error(message: string) {
    console.error(`ERROR: ${message}\n`);
  }

  promptInput(): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question("> ", (answer) => {
        resolve(answer);
      });
    });
  }

  close() {
    this.rl.close();
  }
}
