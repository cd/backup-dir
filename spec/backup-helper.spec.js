const { createInstructions } = require("../src/backup-helper");
const sourceFiles = require("./test-source-files.json");
const targetFiles = require("./test-target-files.json");

describe("createInstructions", function () {
  it("with default settings", function () {
    const result = createInstructions(sourceFiles, targetFiles, {
      source: "test/src",
      target: "test/target",
      onlyCopyIfNewer: true,
      delete: false,
      doNotCopy: [],
      doNotDelete: [],
    });
    expect(result).toEqual({
      instructions: [
        { action: "replace-file", subject: "1.txt" },
        { action: "new-file", subject: "4.txt" },
      ],
      directories: ["dir_1", "dir_2"],
    });
  });

  it("with --copy-all", function () {
    const result = createInstructions(sourceFiles, targetFiles, {
      source: "test/src",
      target: "test/target",
      onlyCopyIfNewer: false,
      delete: false,
      doNotCopy: [],
      doNotDelete: [],
    });
    expect(result).toEqual({
      instructions: [
        { action: "replace-file", subject: "1.txt" },
        { action: "replace-file", subject: "2.txt" },
        { action: "replace-file", subject: "3.txt" },
        { action: "new-file", subject: "4.txt" },
      ],
      directories: ["dir_1", "dir_2"],
    });
  });

  it("with --sync", function () {
    const result = createInstructions(sourceFiles, targetFiles, {
      source: "test/src",
      target: "test/target",
      onlyCopyIfNewer: true,
      delete: true,
      doNotCopy: [],
      doNotDelete: [],
    });
    expect(result).toEqual({
      instructions: [
        { action: "replace-file", subject: "1.txt" },
        { action: "delete-file", subject: "5.txt" },
        { action: "delete-file", subject: "dir_file_1" },
        { action: "delete-file", subject: "dir_file_2" },
        { action: "delete-file", subject: "dir_file_3" },
        { action: "delete-dir", subject: "dir_file_4" },
        { action: "delete-dir", subject: "dir_file_5" },
        { action: "delete-dir", subject: "dir_file_6" },
        { action: "new-file", subject: "4.txt" },
        { action: "new-dir", subject: "dir_file_1" },
        { action: "new-dir", subject: "dir_file_2" },
        { action: "new-dir", subject: "dir_file_3" },
        { action: "new-file", subject: "dir_file_4" },
        { action: "new-file", subject: "dir_file_5" },
        { action: "new-file", subject: "dir_file_6" },
      ],
      directories: ["dir_1", "dir_2", "dir_file_1", "dir_file_2", "dir_file_3"],
    });
  });

  it("with --sync --copy-all", function () {
    const result = createInstructions(sourceFiles, targetFiles, {
      source: "test/src",
      target: "test/target",
      onlyCopyIfNewer: false,
      delete: true,
      doNotCopy: [],
      doNotDelete: [],
    });
    expect(result).toEqual({
      instructions: [
        { action: "replace-file", subject: "1.txt" },
        { action: "replace-file", subject: "2.txt" },
        { action: "replace-file", subject: "3.txt" },
        { action: "delete-file", subject: "5.txt" },
        { action: "delete-file", subject: "dir_file_1" },
        { action: "delete-file", subject: "dir_file_2" },
        { action: "delete-file", subject: "dir_file_3" },
        { action: "delete-dir", subject: "dir_file_4" },
        { action: "delete-dir", subject: "dir_file_5" },
        { action: "delete-dir", subject: "dir_file_6" },
        { action: "new-file", subject: "4.txt" },
        { action: "new-dir", subject: "dir_file_1" },
        { action: "new-dir", subject: "dir_file_2" },
        { action: "new-dir", subject: "dir_file_3" },
        { action: "new-file", subject: "dir_file_4" },
        { action: "new-file", subject: "dir_file_5" },
        { action: "new-file", subject: "dir_file_6" },
      ],
      directories: ["dir_1", "dir_2", "dir_file_1", "dir_file_2", "dir_file_3"],
    });
  });

  it("with --sync --copy-all --do-not-copy", function () {
    const result = createInstructions(sourceFiles, targetFiles, {
      source: "test/src",
      target: "test/target",
      onlyCopyIfNewer: false,
      delete: true,
      doNotCopy: ["**/2.txt", "test/src/4.txt", "*/src/dir_file_1"],
      doNotDelete: [],
    });
    expect(result).toEqual({
      instructions: [
        { action: "replace-file", subject: "1.txt" },
        { action: "replace-file", subject: "3.txt" },
        { action: "delete-file", subject: "5.txt" },
        { action: "delete-file", subject: "dir_file_1" },
        { action: "delete-file", subject: "dir_file_2" },
        { action: "delete-file", subject: "dir_file_3" },
        { action: "delete-dir", subject: "dir_file_4" },
        { action: "delete-dir", subject: "dir_file_5" },
        { action: "delete-dir", subject: "dir_file_6" },
        { action: "new-dir", subject: "dir_file_2" },
        { action: "new-dir", subject: "dir_file_3" },
        { action: "new-file", subject: "dir_file_4" },
        { action: "new-file", subject: "dir_file_5" },
        { action: "new-file", subject: "dir_file_6" },
      ],
      directories: ["dir_1", "dir_2", "dir_file_2", "dir_file_3"],
    });
  });

  it("with --sync --do-not-delete", function () {
    const result = createInstructions(sourceFiles, targetFiles, {
      source: "test/src",
      target: "test/target",
      onlyCopyIfNewer: true,
      delete: true,
      doNotCopy: [],
      doNotDelete: ["**/1.txt", "test/target/5.txt", "*/target/dir_file_4"],
    });
    expect(result).toEqual({
      instructions: [
        { action: "delete-file", subject: "dir_file_1" },
        { action: "delete-file", subject: "dir_file_2" },
        { action: "delete-file", subject: "dir_file_3" },
        { action: "delete-dir", subject: "dir_file_5" },
        { action: "delete-dir", subject: "dir_file_6" },
        { action: "new-file", subject: "4.txt" },
        { action: "new-dir", subject: "dir_file_1" },
        { action: "new-dir", subject: "dir_file_2" },
        { action: "new-dir", subject: "dir_file_3" },
        { action: "new-file", subject: "dir_file_5" },
        { action: "new-file", subject: "dir_file_6" },
      ],
      directories: ["dir_1", "dir_2", "dir_file_1", "dir_file_2", "dir_file_3"],
    });
  });
});
