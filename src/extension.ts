import * as vscode from "vscode";

// register command
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "md2pukiwiki.convert",
    convert
  );
  context.subscriptions.push(disposable);
}

const convert = () => {
  const editor = vscode.window.activeTextEditor;
  const document = editor?.document;
  if (document?.languageId !== "markdown") {
    return;
  }
  const text = document?.getText();
  const lines = text?.split("\n");
  const convertedLines = lines?.map((line) => {
    let tempLine = line;
    // convert bold
    tempLine = tempLine.replace(/\*\*(.*?)\*\*/g, (match, p1) => {
      return "$" + p1 + "$";
    });
    // convert list
    tempLine = tempLine.replace(
      /^(\s*)([\*-\+]+)(.*)$/,
      (match, p1, p2, p3) => {
        const level = p2.length;
        return p1 + "-".repeat(level) + p3;
      }
    );
    // convert header
    tempLine = tempLine.replace(/^(#+)(.*)$/, (match, p1, p2) => {
      const level = p1.length;
      return "*".repeat(level) + p2;
    });
    // convert quote
    tempLine = tempLine.replace(/^(\s*)(>)(.*)$/, (match, p1, p2, p3) => {
      return p1 + "&&" + p3;
    });
    return tempLine;
  });
  console.log(convertedLines?.join("\n"));
  // save txt file
  vscode.workspace.fs.writeFile(
    vscode.Uri.parse(
      document?.fileName.split(".").slice(0, -1).join(".") + ".txt"
    ),
    Buffer.from(convertedLines?.join("\n") ?? "")
  );
};

// This method is called when your extension is deactivated
export function deactivate() {}
