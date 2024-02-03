import util from "node:util";
import path from "node:path";
import fs from "node:fs/promises";
import Lexer from "./lexer/index.js";
import Parser from "./parser/index.js";
import evaluate from "./evaluation/evaluate.js";
import orderEvaluation from "./evaluation/order.js";

const args = util.parseArgs({
	allowPositionals: true,
});

try {

	const text = (
		await fs.readFile(path.resolve(args.positionals[0]), "utf-8")
	).trim();

	const lexer = new Lexer(text);
	const tokens = lexer.generateTokens();

	const parser = new Parser(tokens);
	const tree = parser.parse();

	console.log(`Expression\n${text}\n`);
	console.log("Tokens");
	console.log(tokens);
	console.log(
		`\nTree\n${util.inspect(tree, { showHidden: false, depth: null })}`,
	);
	console.log(`\nOrder Of Evaluation => ${orderEvaluation(tree)}`);
	console.log(`\nEvaluated Result\n ${evaluate(tree)}`);
} catch (error) {
	if (error.code === "ENOENT") {
		console.error(`File "${args.positionals[0]}" not found`);
	} else {
		console.error(error);
	}
}
