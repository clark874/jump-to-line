
# Jump to Line

This is a VSCode extension to copy file path with line number and open links from comments.

## Features

- Copy internal code path with line number
- Copy external code path with line number
- Open links from comments
- Context menu for selected links

## Usage

- Use the command palette (`Ctrl+Shift+P`) to access the features.
- Right-click on the code editor to see context menu options.

## Commands

- **Copy Internal Code Path with Line**: Copies the current file path with line number in the format `/path/to/file:line`.
- **Copy External Code Path with Line**: Copies the current file path with line number in the format `vscode://file/path/to/file:line`.
- **Open Link From Comment**: Opens a file and jumps to the specified line based on the comment link.
- **Open Selected Link**: Opens the selected link in the file and jumps to the specified line.

## Installation

1. Open the command palette (`Ctrl+Shift+P`).
2. Select `Extensions: Install from VSIX`.
3. Choose the generated `.vsix` file.

## License

MIT
