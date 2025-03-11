import { ConsoleIO } from "./ConsoleIO";

export class ConsoleUI {
  constructor(private consoleIO: ConsoleIO) {}

  start() {
    this.consoleIO.display("App started!");
    this.consoleIO.close();
  }
}
