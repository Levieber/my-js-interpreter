import NODE from "../constants/nodeType.js";

const treeMapper = {
	[NODE.TYPE.NUMBER]: (tree) => tree.value,
	[NODE.TYPE.ADD]: (tree) =>
		`(${orderOfEvaluation(tree.node1)} + ${orderOfEvaluation(tree.node2)})`,
	[NODE.TYPE.SUB]: (tree) =>
		`(${orderOfEvaluation(tree.node1)} - ${orderOfEvaluation(tree.node2)})`,
	[NODE.TYPE.DIVIDE]: (tree) =>
		`(${orderOfEvaluation(tree.node1)} / ${orderOfEvaluation(tree.node2)})`,
	[NODE.TYPE.MULTIPLY]: (tree) =>
		`(${orderOfEvaluation(tree.node1)} * ${orderOfEvaluation(tree.node2)})`,
	[NODE.TYPE.MOD]: (tree) =>
		`(${orderOfEvaluation(tree.node1)} % ${orderOfEvaluation(tree.node2)})`,
	[NODE.TYPE.POW]: (tree) =>
		`(${orderOfEvaluation(tree.node1)} ** ${orderOfEvaluation(tree.node2)})`,
	[NODE.TYPE.INT_DIVIDE]: (tree) =>
		`(${orderOfEvaluation(tree.node1)} // ${orderOfEvaluation(tree.node2)})`,
	[NODE.TYPE.NTH_ROOT]: (tree) =>
		`(${orderOfEvaluation(tree.node1)} # ${orderOfEvaluation(tree.node2)})`,
	[NODE.TYPE.LOGNBASEX]: (tree) =>
		`(${orderOfEvaluation(tree.node1)} LB ${orderOfEvaluation(tree.node2)})`,
	[NODE.TYPE.NAT_LOG]: (tree) => `(LN ${orderOfEvaluation(tree.node)})`,
};

export default function orderOfEvaluation(tree = {}) {
	const handler = treeMapper[tree.nodeType];

	if (handler) {
		return handler(tree);
	}
}
