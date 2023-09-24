import { readFileSync } from "node:fs";
import { interpret } from "./interpreter.js";

const AST_FILE_PATH_FLAG = "-f";

const getAstFilePath = () => {
  const index = process.argv.indexOf(AST_FILE_PATH_FLAG);
  return index !== -1 ? process.argv[index + 1] : null;
};

const validateAstFilePath = (path) => {
  return path && path.endsWith(".json");
};

if (!validateAstFilePath(getAstFilePath())) {
  console.error("Invalid file");
  process.exit(1);
}

const getAstJSON = () => {
  const astFilePath = getAstFilePath();
  const astFile = astFilePath ? readFileSync(astFilePath, "utf-8") : null;
  return astFile || readFileSync("/var/rinha/source.rinha.json", "utf-8");
};

const run = () => {
  const astJSON = getAstJSON();
  const ast = JSON.parse(astJSON);
  interpret(ast.expression);
};

run();
