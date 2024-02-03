import TOKEN from "../constants/tokenType.js";

const WHITESPACE = " \n\t";
const DIGITS = "0123456789";
const BINARY_DIGITS = "01";
const HEXADECIMAL_DIGITS = `${DIGITS}ABCDEF`;
const OCTAL_DIGITS = "01234567";

class Token {
	constructor(type, value = undefined) {
		this.type = type;
		this.value = value;
	}
}

const tokensMapper = {
	// Left Parenthesis
	[TOKEN.OPERATOR.LPAREN]: function () {
		this.advance();
		this.tokens.push(new Token(TOKEN.TYPE.LPAREN, TOKEN.OPERATOR.LPAREN));
	},
	// Right Parenthesis
	[TOKEN.OPERATOR.RPAREN]: function () {
		this.advance();
		this.tokens.push(new Token(TOKEN.TYPE.RPAREN, TOKEN.OPERATOR.RPAREN));
	},
	// Plus
	[TOKEN.OPERATOR.PLUS[0]]: function () {
		this.advance();
		this.tokens.push(new Token(TOKEN.TYPE.PLUS, TOKEN.OPERATOR.PLUS[0]));
	},
	// Minus
	[TOKEN.OPERATOR.MINUS[0]]: function () {
		this.advance();
		this.tokens.push(new Token(TOKEN.TYPE.MINUS, TOKEN.OPERATOR.MINUS[0]));
	},
	// Multiply
	[TOKEN.OPERATOR.MULTIPLY[0]]: function () {
		this.advance();
		// Pow
		if (this.currentChar === TOKEN.OPERATOR.MULTIPLY[0]) {
			this.advance();
			this.tokens.push(new Token(TOKEN.TYPE.POW, TOKEN.OPERATOR.POW[0]));
		} else {
			this.tokens.push(
				new Token(TOKEN.TYPE.MULTIPLY, TOKEN.OPERATOR.MULTIPLY[0]),
			);
		}
	},
	// Divide
	[TOKEN.OPERATOR.DIVIDE[0]]: function () {
		this.advance();
		// Int Divide
		if (this.currentChar === TOKEN.OPERATOR.DIVIDE[0]) {
			this.advance();
			this.tokens.push(
				new Token(TOKEN.TYPE.INT_DIVIDE, TOKEN.OPERATOR.INT_DIVIDE),
			);
		} else {
			this.tokens.push(new Token(TOKEN.TYPE.DIVIDE, TOKEN.OPERATOR.DIVIDE[0]));
		}
	},
	// Plus Other Operator
	[TOKEN.OPERATOR.PLUS[1]]: function () {
		this.advance();
		this.tokens.push(new Token(TOKEN.TYPE.PLUS, TOKEN.OPERATOR.PLUS[1]));
	},
	// Minus Other Operator
	[TOKEN.OPERATOR.MINUS[1]]: function () {
		this.advance();
		this.tokens.push(new Token(TOKEN.TYPE.MINUS, TOKEN.OPERATOR.MINUS[1]));
	},
	// Multiply Other Operator
	[TOKEN.OPERATOR.MULTIPLY[1]]: function () {
		this.advance()
		this.tokens.push(
			new Token(TOKEN.TYPE.MULTIPLY, TOKEN.OPERATOR.MULTIPLY[1]),
		);
	},
	// Divide Other Operator
	[TOKEN.OPERATOR.DIVIDE[1]]: function () {
		this.advance()
		this.tokens.push(
			new Token(TOKEN.TYPE.MULTIPLY, TOKEN.OPERATOR.DIVIDE[1]),
		);
	},
	// Mod
	[TOKEN.OPERATOR.MOD]: function () {
		this.advance();
		this.tokens.push(new Token(TOKEN.TYPE.MOD, TOKEN.OPERATOR.MOD));
	},
	// Nth Root
	[TOKEN.OPERATOR.NTH_ROOT]: function () {
		this.advance();
		this.tokens.push(new Token(TOKEN.TYPE.NTH_ROOT, TOKEN.OPERATOR.NTH_ROOT));
	},
	// Binary String
	[TOKEN.OPERATOR.BINARY_STRING]: function () {
		this.advance();
		this.tokens.push(this.generateString(TOKEN.OPERATOR.BINARY_STRING));
	},
	// HexaDecimal String
	[TOKEN.OPERATOR.HEXADECIMAL_STRING]: function () {
		this.advance();
		this.tokens.push(this.generateString(TOKEN.OPERATOR.HEXADECIMAL_STRING));
	},
	// Octal String
	[TOKEN.OPERATOR.OCTAL_STRING]: function () {
		this.advance();
		this.tokens.push(this.generateString(TOKEN.OPERATOR.OCTAL_STRING));
	},
	// Binary Conversion
	[TOKEN.OPERATOR.BINARY]: function () {
		this.advance();
		this.tokens.push(new Token(TOKEN.TYPE.BINARY, TOKEN.OPERATOR.BINARY));
	},
	// HexaDecimal Conversion
	[TOKEN.OPERATOR.HEXADECIMAL]: function () {
		this.advance();
		this.tokens.push(
			new Token(TOKEN.TYPE.HEXADECIMAL, TOKEN.OPERATOR.HEXADECIMAL),
		);
	},
	// Octal Conversion
	[TOKEN.OPERATOR.OCTAL]: function () {
		this.advance();
		this.tokens.push(new Token(TOKEN.TYPE.OCTAL, TOKEN.OPERATOR.OCTAL));
	},
	// Constant E
	[TOKEN.OPERATOR.E]: function () {
		this.advance();
		this.tokens.push(new Token(TOKEN.TYPE.NUMBER, Math.exp(1)));
	},
	// Bitwise AND
	[TOKEN.OPERATOR.BITWISE_AND]: function () {
		this.advance();
		this.tokens.push(
			new Token(TOKEN.TYPE.BITWISE_AND, TOKEN.OPERATOR.BITWISE_AND),
		);
	},
	// Bitwise OR
	[TOKEN.OPERATOR.BITWISE_OR]: function () {
		this.advance();
		this.tokens.push(
			new Token(TOKEN.TYPE.BITWISE_OR, TOKEN.OPERATOR.BITWISE_OR),
		);
	},
};

export default class Lexer {
	constructor(text) {
		this.currentChar = "";
		this.index = 0;
		this.text = text;
		this.tokens = [];

		this.advance();
	}

	updateCurrentCharIfOperator() {
		const operators = [
			TOKEN.OPERATOR.PLUS[1],
			TOKEN.OPERATOR.MINUS[1],
			TOKEN.OPERATOR.MULTIPLY[1],
			TOKEN.OPERATOR.DIVIDE[1],
		];

		for (const operator of operators) {
			if (this.currentChar === operator[0]) {
				const portion = this.text.slice(
					this.index - 1,
					this.index + (operator.length - 1),
				);

				if (portion !== operator) continue;

				this.currentChar = operator;
				this.index += operator.length - 1;
			}
		}
	}

	advance() {
		try {
			this.currentChar = this.text[this.index++];
			this.updateCurrentCharIfOperator()
		} catch (e) {
			console.log(e);
			this.currentChar = undefined;
		}
	}

	generateTokens() {
		while (this.currentChar !== undefined) {
			// Whitespaces
			if (WHITESPACE.includes(this.currentChar)) this.advance();
			// Decimal and Integers
			else if (this.currentChar === "." || DIGITS.includes(this.currentChar)) {
				this.tokens.push(this.generateNumber());
			} else if (tokensMapper[this.currentChar]) {
				const handler = tokensMapper[this.currentChar].bind(this);
				handler();
			}
			// Logarithm
			else if (this.currentChar === "L") {
				this.advance();
				// Custom Base
				if (this.currentChar === "B") {
					this.advance();
					this.tokens.push(
						new Token(TOKEN.TYPE.LOGNBASEX, TOKEN.OPERATOR.LOGNBASEX),
					);
				}
				// Natural Log
				else if (this.currentChar === "N") {
					this.advance();
					this.tokens.push(
						new Token(TOKEN.TYPE.NAT_LOG, TOKEN.OPERATOR.NAT_LOG),
					);
				}
			}
			// Constant PI
			else if (this.currentChar === "p") {
				this.advance();
				if (this.currentChar === "i") {
					this.advance();
					this.tokens.push(new Token(TOKEN.TYPE.NUMBER, Math.PI));
				}
			}
		}

		return this.tokens;
	}

	generateString(TYPE) {
		let ACCEPTED_CHARS = "";
		let targetTokenType = "";

		switch (TYPE) {
			case TOKEN.OPERATOR.BINARY_STRING:
				ACCEPTED_CHARS = BINARY_DIGITS;
				targetTokenType = TOKEN.TYPE.BINARY_STRING;
				break;
			case TOKEN.OPERATOR.HEXADECIMAL_STRING:
				ACCEPTED_CHARS = HEXADECIMAL_DIGITS.toLowerCase();
				targetTokenType = TOKEN.TYPE.HEXADECIMAL_STRING;
				break;
			case TOKEN.OPERATOR.OCTAL_STRING:
				ACCEPTED_CHARS = OCTAL_DIGITS;
				targetTokenType = TOKEN.TYPE.OCTAL_STRING;
				break;
			default:
				return;
		}

		let currentString = this.currentChar;
		this.advance();

		while (
			this.currentChar !== undefined &&
			ACCEPTED_CHARS.includes(this.currentChar)
		) {
			currentString += this.currentChar;
			this.advance();
		}

		return new Token(
			targetTokenType,
			TYPE === TOKEN.OPERATOR.HEXADECIMAL
				? currentString.toUpperCase()
				: currentString,
		);
	}

	generateNumber() {
		let decimalPointCount = 0;
		let currentNumber = this.currentChar;

		this.advance();

		while (
			this.currentChar !== undefined &&
			(this.currentChar === "." || DIGITS.includes(this.currentChar))
		) {
			if (this.currentChar === ".") {
				decimalPointCount++;
				if (decimalPointCount > 1) break;
			}

			currentNumber += this.currentChar;
			this.advance();
		}

		if (currentNumber.startsWith(".")) currentNumber = `0${currentNumber}`;
		if (currentNumber.endsWith(".")) currentNumber += "0";

		return new Token(
			TOKEN.TYPE.NUMBER,
			decimalPointCount === 0
				? parseInt(currentNumber)
				: parseFloat(currentNumber),
		);
	}
}
