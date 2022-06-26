const fs = require("fs");
const path = require("path");
const { process } = require("./backup-helper");

module.exports = async function (options) {
  const sourcePath = path.resolve(options.source);
  const targetPath = path.resolve(options.target);

  const sourceStat = await fs.promises.lstat(sourcePath);
  if (!sourceStat.isDirectory()) throw new Error("Source is not a directory");

  const targetStat = await fs.promises.lstat(targetPath);
  if (!targetStat.isDirectory()) throw new Error("Target is not a directory");

  console.log(`\nStart ${options.preview ? "backup preview" : "backup"}...\n`);

  const faults = await process(sourcePath, targetPath, options);

  console.log(`\nFinished with ${faults.length} errors.\n`);
};
