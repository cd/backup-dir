# backup-dir

Simple command line tool to backup and sync folders without footprint.

This tool copies all files and folders from a source directory to a target directory that do not yet exist or have an older 'Last Modified' timestamp.

- Based on Node.js
- Tested with Windows only. Use with caution on Linux and macOS.

## Installation

TODO

## Usage

### Examples

Simply backup your folder:

```bash
backup-dir C:\my-data E:\backup\my-data
```

Test it without any risk in a preview:

```bash
backup-dir C:\my-data E:\backup\my-data --preview
```

Use of relative paths, multiple options and log output to a file:

```bash
backup-dir relative/src relative/target --do-not-copy **/*.env **/node_modules relative/src/secret.key --copy-all > out.txt
```

### Commands

```
backup-dir help
backup-dir <source_dir> <target_dir> [options]
```

### Options

`--sync` Deletes files and folders in the target if they don't exist in the source.

`--copy-all` Replaces all files in the target - regardless of the timestamp of the last change.

`--preview` Doesn't change anything in the file system, just performs a preview.

`--do-not-copy <glob_expressions>` Excludes files and folders in the source that should not be copied.

`--do-not-delete <glob_expressions>` Excludes files and folders in the destination to be replaced or deleted.
