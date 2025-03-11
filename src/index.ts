// Entry point of the application
import { ConsoleUI } from "./presentation/ConsoleUI";
import { ConsoleIO } from "./presentation/ConsoleIO";
import * as readline from "node:readline";

const startApp = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const consoleIO = new ConsoleIO(rl);
  const consoleUI = new ConsoleUI(consoleIO);
  consoleUI.start();
};

startApp();
