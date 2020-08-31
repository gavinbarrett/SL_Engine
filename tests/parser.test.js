import lexical_analysis from '../static/parser.js';

describe('WFF test 1', () => {
	test("P -> Q, P, Q", () => {
		expect(lexical_analysis("P -> Q\n P\n Q")).toBe(1);
	});
});

describe('WFF test 2', () => {
	test("A ^ B, A -> P, B -> Q, P ^ Q", () => {
		expect(lexical_analysis("A ^ B\nA -> P\nB -> Q\nP ^ Q")).toBe(1);
	});
});

describe('WFF test 3', () => {
	test("A v ~A", () => {
		expect(lexical_analysis("A v ~A")).toBe(1);
	});
});

describe('WFF test 4', () => {
	test("A ^ ~A", () => {
		expect(lexical_analysis("A ^ ~A")).toBe(1);
	});
});

describe('WFF test 5', () => {
	test("P -> ~P", () => {
		expect(lexical_analysis("P -> ~P")).toBe(1);
	});
});
