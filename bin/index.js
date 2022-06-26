#!/usr/bin/env node

const parseInput = require("../src/input-parser.js");
const showHelp = require("../src/help.js");
const backupDir = require("../src/backup.js");

(async () => {
  try {
    const cmd = parseInput(process.argv);

    if (cmd.type === "help") {
      showHelp();
    } else if (cmd.type === "backup") {
      await backupDir(cmd.options);
    } else {
      console.log("Invalid command. Type 'backup-dir help' for more information.");
    }
  } catch (e) {
    console.error(e.toString());
  }
})();
