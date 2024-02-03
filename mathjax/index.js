import NODE from "../constants/nodeType.js";

const treeMapper = {
	[NODE.TYPE.NUMBER]: (tree) => `${tree.value}`,
	[NODE.TYPE.ADD]: (tree) => `${mathJax(tree.node1)} + ${mathJax(tree.node2)}`,
	[NODE.TYPE.SUB]: (tree) => `${mathJax(tree.node1)} - ${mathJax(tree.node2)}`,
	[NODE.TYPE.MULTIPLY]: (tree) =>
		`${mathJax(tree.node1)} * ${mathJax(tree.node2)}`,
	[NODE.TYPE.DIVIDE]: (tree) =>
		`\\frac {${mathJax(tree.node1)}} {${mathJax(tree.node2)}}`,
	[NODE.TYPE.LOGNBASEX]: (tree) =>
		`\\log_${mathJax(tree.node2)} ({${mathJax(tree.node1)}})`,
	[NODE.TYPE.NAT_LOG]: (tree) => {
		if (tree.node.nodeType === NODE.TYPE.NUMBER) {
			return `\\ln {${mathJax(tree.node)}}`;
		}

		return `\\ln {(${mathJax(tree.node)})}`;
	},
	[NODE.TYPE.NTH_ROOT]: (tree) => {
		if (tree.node2.nodeType !== NODE.TYPE.NUMBER) {
			return `\\sqrt[${mathJax(tree.node2)}]{(${mathJax(tree.node1)})}`;
		}

		return tree.node2.value === 2
			? `\\sqrt{${mathJax(tree.node1)}}`
			: `\\sqrt[${mathJax(tree.node2)}]{(${mathJax(tree.node1)})}`;
	},
};

export default function mathJax(tree = {}) {
	const handler = treeMapper[tree.nodeType];

	if (handler) {
		return handler(tree);
	}
}
