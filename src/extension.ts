/*
 * @Author: clark874 86122040+clark874@users.noreply.github.com
 * @Date: 2024-05-30 21:15:20
 * @LastEditors: clark874 86122040+clark874@users.noreply.github.com
 * @LastEditTime: 2024-05-30 22:49:59
 * @FilePath: /jump-to-line/src/extension.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "jump-to-line" is now active!');

    // Register the command to copy the file path with line number for internal jump
    const copyInternalDisposable = vscode.commands.registerCommand('extension.copyInternalCodePathWithLine', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const filePath = document.uri.fsPath;
            const lineNumber = selection.active.line + 1; // Convert to one-based index
            const vscodeUri = `${filePath}:${lineNumber}`;
            await vscode.env.clipboard.writeText(vscodeUri);
            vscode.window.showInformationMessage(`Copied: ${vscodeUri}`);
        }
    });

    context.subscriptions.push(copyInternalDisposable);

    // Register the command to copy the file path with line number for external jump
    const copyExternalDisposable = vscode.commands.registerCommand('extension.copyExternalCodePathWithLine', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const filePath = document.uri.fsPath;
            const lineNumber = selection.active.line + 1; // Convert to one-based index
            const vscodeUri = `vscode://file${filePath}:${lineNumber}`;
            await vscode.env.clipboard.writeText(vscodeUri);
            vscode.window.showInformationMessage(`Copied: ${vscodeUri}`);
        }
    });

    context.subscriptions.push(copyExternalDisposable);

    // Register the command to open link from comment
    const openDisposable = vscode.commands.registerCommand('extension.openLinkFromComment', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const text = document.getText();
            const regex = /# (\/.+?):(\d+)/g;
            let match;
            const links = [];

            while ((match = regex.exec(text)) !== null) {
                const filePath = match[1];
                const lineNumber = parseInt(match[2], 10);
                const line = document.positionAt(match.index).line;
                const prevLineText = line > 0 ? document.lineAt(line - 1).text.trim() : '';
                links.push({ filePath, lineNumber, description: prevLineText });
            }

            if (links.length === 0) {
                vscode.window.showInformationMessage('No VSCode links found in the current file.');
                return;
            }

            const selectedLink = await vscode.window.showQuickPick(
                links.map(link => `${link.description} -> ${link.filePath}:${link.lineNumber}`),
                { placeHolder: 'Select a link to open' }
            );

            if (selectedLink) {
                const [description, fileAndLine] = selectedLink.split(' -> ');
                const [filePath, line] = fileAndLine.split(':');
                const uri = vscode.Uri.file(filePath);
                const lineNumber = parseInt(line, 10) - 1;

                const doc = await vscode.workspace.openTextDocument(uri);
                const editor = await vscode.window.showTextDocument(doc);
                const range = editor.document.lineAt(lineNumber).range;
                editor.selection = new vscode.Selection(range.start, range.end);
                editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
            }
        }
    });

    context.subscriptions.push(openDisposable);

    // Register the context menu command
    const contextDisposable = vscode.commands.registerCommand('extension.openSelectedLink', async () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);

            const regex = /(\/.+?):(\d+)/;
            const match = regex.exec(selectedText);

            if (match) {
                const filePath = match[1];
                const lineNumber = parseInt(match[2], 10) - 1;
                const uri = vscode.Uri.file(filePath);

                const doc = await vscode.workspace.openTextDocument(uri);
                const editor = await vscode.window.showTextDocument(doc);
                const range = editor.document.lineAt(lineNumber).range;
                editor.selection = new vscode.Selection(range.start, range.end);
                editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
            } else {
                vscode.window.showInformationMessage('No valid link selected.');
            }
        }
    });

    context.subscriptions.push(contextDisposable);
}

export function deactivate() {}