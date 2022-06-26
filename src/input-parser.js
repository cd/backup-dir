/**
 * Parses user input
 * @param {array<string>} input Raw input strings
 * @returns {obj}
 */
module.exports = function (input) {
  // Command type
  let type = null;

  // Default options
  let options = {
    source: null,
    target: null,
    onlyCopyIfNewer: true,
    delete: false,
    doNotCopy: [],
    doNotDelete: [],
    preview: false,
  };

  if (input.length === 3 && input[2] === "help") {
    type = "help";
  } else if (input.length > 3) {
    type = "backup";
    options.source = input[2];
    options.target = input[3];

    // Parse options
    for (let i = 4; i < input.length; i++) {
      if (input[i] === "--copy-all") {
        options.onlyCopyIfNewer = false;
        continue;
      }
      if (input[i] === "--sync") {
        options.delete = true;
        continue;
      }
      if (input[i] === "--do-not-copy") {
        for (i++; i < input.length; i++) {
          if (input[i].startsWith("-")) {
            i--;
            break;
          }
          options.doNotCopy.push(input[i]);
        }
        continue;
      }
      if (input[i] === "--do-not-delete") {
        for (i++; i < input.length; i++) {
          if (input[i].startsWith("-")) {
            i--;
            break;
          }
          options.doNotDelete.push(input[i]);
        }
        continue;
      }
      if (input[i] === "--preview") {
        options.preview = true;
        continue;
      }
      throw new Error("Invalid option argument");
    }
  } else {
    throw new Error("Invalid input");
  }

  return {
    type,
    options,
  };
};
