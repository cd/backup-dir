const fs = require("fs");
const path = require("path");
const { process } = require("./backup-helper");

module.exports = async function (options) {
  const sourceStat = await fs.promises.lstat(options.source);
  if (!sourceStat.isDirectory()) throw new Error("Source is not a directory");

  const targetStat = await fs.promises.lstat(options.target);
  if (!targetStat.isDirectory()) throw new Error("Target is not a directory");

  console.log(`\nStart ${options.preview ? "backup preview" : "backup"}...\n`);

  const faults = await process(options.source, options.target, options);

  console.log(`\nFinished with ${faults.length} errors.\n`);
};
