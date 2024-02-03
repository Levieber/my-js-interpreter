import util from "node:util";

import mathJax from "./index.js";

import Lexer from "../lexer/index.js";
import Parser from "../parser/index.js";

const text = "LN 9 + 128 LB 2";

const tree = new Parser(new Lexer(text).generateTokens()).parse();

console.log(`${util.inspect(tree, { showHidden: false, depth: null })}\n`);
console.log(mathJax(tree));
