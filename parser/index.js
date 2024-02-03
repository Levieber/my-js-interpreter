import TOKEN from "../constants/tokenType.js";
import NODE from "../constants/nodeType.js";

const treeMapper = {
	[TOKEN.TYPE.LPAREN]: function () {
		this.advance();
		const result = this.expr();
		if (this.currentToken.type !== TOKEN.TYPE.RPAREN) this.raiseError();
		this.advance();

		return result;
	},
	[TOKEN.TYPE.NUMBER]: function () {
		const value = this.currentToken.value;
		this.advance();
		return {
			nodeType: NODE.TYPE.NUMBER,
			value: value,
		};
	},
	[TOKEN.TYPE.BINARY_STRING]: function () {
		const value = this.currentToken.value;
		this.advance();
		return {
			nodeType: NODE.TYPE.BINARY_STRING,
			value: value,
		};
	},
	[TOKEN.TYPE.HEXADECIMAL_STRING]: function () {
		const value = this.currentToken.value;
		this.advance();
		return {
			nodeType: NODE.TYPE.HEXADECIMAL_STRING,
			value: value,
		};
	},
	[TOKEN.TYPE.OCTAL_STRING]: function () {
		const value = this.currentToken.value;
		this.advance();
		return {
			nodeType: NODE.TYPE.OCTAL_STRING,
			value: value,
		};
	},
	[TOKEN.TYPE.PLUS]: function () {
		this.advance();
		return {
			nodeType: NODE.TYPE.PLUS,
			node: this.factor(),
		};
	},
	[TOKEN.TYPE.MINUS]: function () {
		this.advance();
		return {
			nodeType: NODE.TYPE.MINUS,
			node: this.factor(),
		};
	},
	[TOKEN.TYPE.NAT_LOG]: function () {
		this.advance();
		return {
			nodeType: NODE.TYPE.NAT_LOG,
			node: this.factor(),
		};
	},
	[TOKEN.TYPE.BINARY]: function () {
		this.advance();
		return {
			nodeType: NODE.TYPE.BINARY,
			node: this.factor(),
		};
	},
	[TOKEN.TYPE.HEXADECIMAL]: function () {
		this.advance();
		return {
			nodeType: NODE.TYPE.HEXADECIMAL,
			node: this.factor(),
		};
	},
	[TOKEN.TYPE.OCTAL]: function () {
		this.advance();
		return {
			nodeType: NODE.TYPE.OCTAL,
			node: this.factor(),
		};
	},
};

export default class Parser {
	constructor(tokens) {
		this.tokens = tokens;
		this.index = 0;
		this.currentToken = undefined;
		this.advance();
	}

	advance() {
		try {
			this.currentToken = this.tokens[this.index++];
		} catch (e) {
			console.log(e);
			this.currentToken = undefined;
		}
	}

	raiseError() {
		throw new Error("Invalid Syntax");
	}

	parse() {
		if (this.currentToken === undefined) return undefined;
		const result = this.expr();
		if (this.currentToken !== undefined) this.raiseError();

		return result;
	}

	expr() {
		let result = this.term();

		while (
			this.currentToken !== undefined &&
			[TOKEN.TYPE.PLUS, TOKEN.TYPE.MINUS].includes(this.currentToken.type)
		) {
			if (this.currentToken.type === TOKEN.TYPE.PLUS) {
				this.advance();
				result = {
					nodeType: NODE.TYPE.ADD,
					node1: result,
					node2: this.term(),
				};
			} else if (this.currentToken.type === TOKEN.TYPE.MINUS) {
				this.advance();
				result = {
					nodeType: NODE.TYPE.SUB,
					node1: result,
					node2: this.term(),
				};
			}
		}

		return result;
	}

	term() {
		let result = this.factor();

		while (
			this.currentToken !== undefined &&
			[
				TOKEN.TYPE.MULTIPLY,
				TOKEN.TYPE.DIVIDE,
				TOKEN.TYPE.MOD,
				TOKEN.TYPE.INT_DIVIDE,
				TOKEN.TYPE.POW,
				TOKEN.TYPE.NTH_ROOT,
				TOKEN.TYPE.LOGNBASEX,
				TOKEN.TYPE.BITWISE_AND,
				TOKEN.TYPE.BITWISE_OR,
			].includes(this.currentToken.type)
		) {
			if (this.currentToken.type === TOKEN.TYPE.MULTIPLY) {
				this.advance();
				result = {
					nodeType: NODE.TYPE.MULTIPLY,
					node1: result,
					node2: this.factor(),
				};
			} else if (this.currentToken.type === TOKEN.TYPE.DIVIDE) {
				this.advance();
				result = {
					nodeType: NODE.TYPE.DIVIDE,
					node1: result,
					node2: this.factor(),
				};
			} else if (this.currentToken.type === TOKEN.TYPE.MOD) {
				this.advance();
				result = {
					nodeType: NODE.TYPE.MOD,
					node1: result,
					node2: this.factor(),
				};
			} else if (this.currentToken.type === TOKEN.TYPE.INT_DIVIDE) {
				this.advance();
				result = {
					nodeType: NODE.TYPE.INT_DIVIDE,
					node1: result,
					node2: this.factor(),
				};
			} else if (this.currentToken.type === TOKEN.TYPE.POW) {
				this.advance();
				result = {
					nodeType: NODE.TYPE.POW,
					node1: result,
					node2: this.expr(),
				};
			} else if (this.currentToken.type === TOKEN.TYPE.NTH_ROOT) {
				this.advance();
				result = {
					nodeType: NODE.TYPE.NTH_ROOT,
					node1: result,
					node2: this.factor(),
				};
			} else if (this.currentToken.type === TOKEN.TYPE.LOGNBASEX) {
				this.advance();
				result = {
					nodeType: NODE.TYPE.LOGNBASEX,
					node1: result,
					node2: this.factor(),
				};
			} else if (this.currentToken.type === TOKEN.TYPE.BITWISE_AND) {
				this.advance();
				result = {
					nodeType: NODE.TYPE.BITWISE_AND,
					node1: result,
					node2: this.factor(),
				};
			} else if (this.currentToken.type === TOKEN.TYPE.BITWISE_OR) {
				this.advance();
				result = {
					nodeType: NODE.TYPE.BITWISE_OR,
					node1: result,
					node2: this.factor(),
				};
			}
		}

		return result;
	}

	factor() {
		const handler = treeMapper[this.currentToken.type].bind(this);

		if (handler) {
			return handler();
		}

		this.raiseError();
	}
}
