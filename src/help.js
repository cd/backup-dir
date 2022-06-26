module.exports = function () {
  console.log();
  console.log("Copies all files and folders from the source directory to the target directory")
  console.log("that do not yet exist or have an older 'Last Modified' timestamp.")
  console.log("\nUsage: backup-dir <source_dir> <target_dir> [options]");
  console.log("\nAvailable options:\n");
  console.log("  --sync                   Deletes files and folders in the target if they don't");
  console.log("                           exist in the source.\n");
  console.log("  --copy-all               Replaces all files in the target - regardless of the");
  console.log("                           timestamp of the last change.\n");
  console.log("  --preview                Doesn't change anything in the file system, just");
  console.log("                           performs a preview.\n");
  console.log("  --do-not-copy <args>     Excludes files in the source that should not be");
  console.log("                           copied.");
  console.log("                           <args> - File/Folder names separated by a space\n");
  console.log("  --do-not-delete <args>   Excludes files in the destination to be replaced or");
  console.log("                           deleted.");
  console.log("                           <args> - File/Folder names separated by a space\n");
  console.log();
};
