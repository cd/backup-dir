const fs = require("fs");
const path = require("path");
const minimatch = require("minimatch");

/**
 * Compare the files and create appropriate instructions.
 * @param {array<obj>} sourceFiles
 * @param {array<obj>} targetFiles
 * @param {obj} options
 * @returns both the instructions generated and directories found.
 */
function createInstructions(sourceFiles, targetFiles, options) {
  const directories = [];
  const instructions = [];

  targetFiles.forEach((targetFile) => {
    const correspondingSourceFile = sourceFiles.find((e) => e.name === targetFile.name);

    // Delete file or folder
    if (
      options.delete &&
      !matchesPattern(targetFile.path, options.doNotDelete) &&
      (!correspondingSourceFile || correspondingSourceFile.isDirectory !== targetFile.isDirectory)
    ) {
      instructions.push({
        action: "delete-" + (targetFile.isDirectory ? "dir" : "file"),
        subject: targetFile.name,
      });
      return;
    }

    // Replace files
    if (
      correspondingSourceFile &&
      !correspondingSourceFile.isDirectory &&
      !targetFile.isDirectory &&
      !matchesPattern(correspondingSourceFile.path, options.doNotCopy) &&
      !matchesPattern(targetFile.path, options.doNotDelete) &&
      (!options.onlyCopyIfNewer || correspondingSourceFile.lastModified > targetFile.lastModified)
    ) {
      instructions.push({
        action: "replace-file",
        subject: correspondingSourceFile.name,
      });
      return;
    }
  });

  sourceFiles.forEach((sourceFile) => {
    const correspondingTargetFile = targetFiles.find((e) => e.name === sourceFile.name);

    if (matchesPattern(sourceFile.path, options.doNotCopy)) return;

    if (
      !correspondingTargetFile ||
      instructions.find((e) => e.action.startsWith("delete-") && e.subject === sourceFile.name)
    ) {
      // Create new folder
      if (sourceFile.isDirectory) {
        instructions.push({
          action: "new-dir",
          subject: sourceFile.name,
        });
        directories.push(sourceFile.name);
        return;
      }

      // Create new file
      instructions.push({
        action: "new-file",
        subject: sourceFile.name,
      });

      return;
    }

    if (correspondingTargetFile.isDirectory && sourceFile.isDirectory) {
      directories.push(sourceFile.name);
      return;
    }
  });

  return { instructions, directories };
}

/**
 * Tests the path against the patterns.
 * @param {string} path
 * @param {array<string>} patterns
 * @returns true if at least one pattern matches
 */
function matchesPattern(path, patterns) {
  for (let i = 0; i < patterns.length; i++) {
    if (minimatch(path, patterns[i])) return true;
  }
  return false;
}

/**
 * Processes all files and folders in the specified paths.
 * @param {string} sourcePath
 * @param {string} targetPath
 * @param {obj} options
 * @returns failures of performed instructions
 */
async function process(sourcePath, targetPath, options) {
  const failed = [];
  const sourceFiles = [];
  const targetFiles = [];

  try {
    // Get file informations from source and target path
    const files = await Promise.all([getFiles(sourcePath), getFiles(targetPath)]);
    sourceFiles.push(...files[0]);
    targetFiles.push(...files[1]);
  } catch (e) {
    // It's ok if an error is thrown if no directory is found in preview mode (because no directories will be created).
    // Otherwise, throw error again.
    if (!options.preview) throw e;
  }

  // Create and perform instructions
  const instructionsResult = createInstructions(sourceFiles, targetFiles, options);
  for (let i = 0; i < instructionsResult.instructions.length; i++) {
    try {
      await performInstruction(sourcePath, targetPath, instructionsResult.instructions[i], options.preview);
    } catch (e) {
      console.error(e);
      failed.push(instructionsResult.instructions[i]);
    }
  }

  // Recursive self-call on found subfolders
  for (let i = 0; i < instructionsResult.directories.length; i++) {
    failed.push(
      ...(await process(
        path.join(sourcePath, instructionsResult.directories[i]),
        path.join(targetPath, instructionsResult.directories[i]),
        options
      ))
    );
  }

  return failed;
}

/**
 * Perform instruction.
 * @param {string} sourcePath
 * @param {string} targetPath
 * @param {obj} instruction
 * @param {boolean} preview
 */
async function performInstruction(sourcePath, targetPath, instruction, preview) {
  if (instruction.action.startsWith("delete-")) {
    const filePathTarget = path.join(targetPath, instruction.subject);
    console.log("\x1b[31m", "[-] " + filePathTarget, "\x1b[0m");
    if (!preview) await fs.promises.rm(filePathTarget, { recursive: true });
  } else if (instruction.action === "replace-file") {
    const filePathSource = path.join(sourcePath, instruction.subject);
    const filePathTarget = path.join(targetPath, instruction.subject);
    console.log("\x1b[0m", "[r] " + filePathTarget);
    if (!preview) await fs.promises.copyFile(filePathSource, filePathTarget);
  } else if (instruction.action === "new-dir") {
    const filePathTarget = path.join(targetPath, instruction.subject);
    console.log("\x1b[32m", "[+] " + filePathTarget, "\x1b[0m");
    if (!preview) await fs.promises.mkdir(filePathTarget);
  } else if (instruction.action === "new-file") {
    const filePathSource = path.join(sourcePath, instruction.subject);
    const filePathTarget = path.join(targetPath, instruction.subject);
    console.log("\x1b[32m", "[+] " + filePathTarget, "\x1b[0m");
    if (!preview) await fs.promises.copyFile(filePathSource, filePathTarget, fs.constants.COPYFILE_EXCL);
  }
}

/**
 * Get all file information of the given path.
 * @param {string} dir Path to directory
 * @returns {array<obj} file information
 */
async function getFiles(dir) {
  const names = await fs.promises.readdir(dir);
  const out = [];
  for (let i = 0; i < names.length; i++) {
    const filePath = path.join(dir, names[i]);
    const fileStat = await fs.promises.lstat(filePath);
    out.push({
      name: names[i],
      path: filePath,
      isDirectory: fileStat.isDirectory(),
      lastModified: fileStat.mtimeMs,
    });
  }
  return out;
}

module.exports = {
  process,
  createInstructions,
};
