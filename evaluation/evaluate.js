import NODE from "../constants/nodeType.js";

const treeMapper = {
	[NODE.TYPE.NUMBER]: (tree) => tree.value,
	[NODE.TYPE.BINARY_STRING]: (tree) => convertBinaryToDecimal(tree.value),
	[NODE.TYPE.HEXADECIMAL_STRING]: (tree) =>
		convertHexaDecimalToDecimal(tree.value),
	[NODE.TYPE.OCTAL_STRING]: (tree) => convertOctalToDecimal(tree.value),
	[NODE.TYPE.ADD]: (tree) => evaluate(tree.node1) + evaluate(tree.node2),
	[NODE.TYPE.SUB]: (tree) => evaluate(tree.node1) - evaluate(tree.node2),
	[NODE.TYPE.MULTIPLY]: (tree) => evaluate(tree.node1) * evaluate(tree.node2),
	[NODE.TYPE.DIVIDE]: (tree) => evaluate(tree.node1) / evaluate(tree.node2),
	[NODE.TYPE.MOD]: (tree) => evaluate(tree.node1) % evaluate(tree.node2),
	[NODE.TYPE.POW]: (tree) => pow(evaluate(tree.node1), evaluate(tree.node2)),
	[NODE.TYPE.INT_DIVIDE]: (tree) =>
		intDivide(evaluate(tree.node1), evaluate(tree.node2)),
	[NODE.TYPE.NTH_ROOT]: (tree) =>
		nthRoot(evaluate(tree.node1), evaluate(tree.node2)),
	[NODE.TYPE.LOGNBASEX]: (tree) =>
		logNBaseX(evaluate(tree.node1), evaluate(tree.node2)),
	[NODE.TYPE.NAT_LOG]: (tree) =>
		naturalLog(evaluate(tree.node1), evaluate(tree.node2)),
	[NODE.TYPE.BINARY]: (tree) =>
		`b${convertDecimalToBinary(evaluate(tree.node))}`,
	[NODE.TYPE.HEXADECIMAL]: (tree) =>
		`h${convertDecimalToHexaDecimal(evaluate(tree.node)).toUpperCase()}`,
	[NODE.TYPE.OCTAL]: (tree) => `o${convertDecimalToOctal(evaluate(tree.node))}`,
	[NODE.TYPE.BITWISE_AND]: (tree) =>
		evaluate(tree.node1) & evaluate(tree.node2),
	[NODE.TYPE.BITWISE_OR]: (tree) => evaluate(tree.node1) | evaluate(tree.node2),
};

function intDivide(a, b) {
	const result = a / b;
	if (result >= 0) return Math.floor(result);

	return Math.ceil(result);
}

function pow(a, b) {
	return a ** b;
}

function nthRoot(a, b) {
	return pow(a, 1 / b);
}

function logNBaseX(n, x) {
	return Math.log(n) / Math.log(x);
}

function naturalLog(n) {
	return Math.log(n);
}

function convertDecimalToBinary(n) {
	return parseInt(n).toString(2);
}

function convertBinaryToDecimal(b) {
	return parseFloat(parseInt(b.toString(), 2).toString());
}

function convertDecimalToHexaDecimal(n) {
	return parseInt(n).toString(16);
}

function convertHexaDecimalToDecimal(b) {
	return parseFloat(parseInt(b.toString(), 16).toString());
}

function convertDecimalToOctal(n) {
	return parseInt(n).toString(8);
}

function convertOctalToDecimal(b) {
	return parseFloat(parseInt(b.toString(), 8).toString());
}

export default function evaluate(tree) {
	const handler = treeMapper[tree.nodeType];

	if (handler) {
		return handler(tree);
	}
}
