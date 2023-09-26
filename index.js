import { readFileSync } from "node:fs";
import { interpret } from "./interpreter.js";

const AST_FILE_PATH_FLAG = "-f";
const SHOW_ELAPSED_TIME_FLAG = "-t";

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

const showElapsedTime = () => {
  return process.argv.includes(SHOW_ELAPSED_TIME_FLAG);
};

// This is a really cheap and lazy check to see if a function is pure. Don't rely on it.
const isFunctionPure = (unparsedAst) => {
  return unparsedAst.match(new RegExp('"Print"', "g")).length <= 1;
};

const run = () => {
  const astJSON = getAstJSON();
  const ast = JSON.parse(astJSON);
  const start = Date.now();
  interpret(ast.expression, {}, isFunctionPure(astJSON));
  if (showElapsedTime()) {
    console.log(`Elapsed time: ${Date.now() - start}ms`);
  }
};

run();
