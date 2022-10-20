import assert from "node:assert/strict";
import { parse, trueParser, falseParser, booleanParser, stringParser, nullParser, numberParser, arrayParser, oneOf, nullable, mapParser } from ".";

assert.equal(parse(trueParser, "true"), true);
assert.equal(parse(trueParser, "     true  "), true);
assert.throws(() => parse(trueParser, ""));
assert.throws(() => parse(trueParser, "      "));
assert.throws(() => parse(trueParser, "hello"));
assert.throws(() => parse(trueParser, "tru"));
assert.throws(() => parse(trueParser, "true   a"));


assert.equal(parse(falseParser, "false"), false);
assert.equal(parse(falseParser, "     false  "), false);
assert.throws(() => parse(falseParser, ""));
assert.throws(() => parse(falseParser, "      "));
assert.throws(() => parse(falseParser, "hello"));
assert.throws(() => parse(falseParser, "fals"));
assert.throws(() => parse(falseParser, "false   a"));


assert.equal(parse(booleanParser, "true"), true);
assert.equal(parse(booleanParser, "     true  "), true);
assert.equal(parse(booleanParser, "false"), false);
assert.equal(parse(booleanParser, "     false  "), false);
assert.throws(() => parse(booleanParser, ""));
assert.throws(() => parse(booleanParser, "      "));
assert.throws(() => parse(booleanParser, "hello"));
assert.throws(() => parse(booleanParser, "tru"));
assert.throws(() => parse(booleanParser, "fals"));
assert.throws(() => parse(booleanParser, "true   a"));
assert.throws(() => parse(booleanParser, "false   a"));


assert.equal(parse(stringParser, JSON.stringify("hello world")), "hello world");
assert.equal(parse(stringParser, JSON.stringify("foobar")), "foobar");
assert.equal(parse(stringParser, `   ${JSON.stringify("hello world")} `), "hello world");
assert.equal(parse(stringParser, JSON.stringify("")), "");
assert.equal(parse(stringParser, JSON.stringify('"')), '"');
assert.equal(parse(stringParser, JSON.stringify("\b\f\n\r\t\\")), "\b\f\n\r\t\\");
assert.equal(parse(stringParser, JSON.stringify('Here is a text with a "quote"\nAnd a line break')), 'Here is a text with a "quote"\nAnd a line break');
assert.throws(() => parse(stringParser, "hello world"));
assert.throws(() => parse(stringParser, '"hello world'));
assert.throws(() => parse(stringParser, '"'));
assert.throws(() => parse(stringParser, `${JSON.stringify("hello world")}   bla`));
assert.throws(() => parse(stringParser, `${JSON.stringify("hello world")}${JSON.stringify("foobar")}`));
assert.throws(() => parse(stringParser, `${JSON.stringify("hello world")}   ${JSON.stringify("foobar")}`));


assert.equal(parse(nullParser, "null"), null);
assert.equal(parse(nullParser, "    null  "), null);
assert.throws(() => parse(nullParser, ""));
assert.throws(() => parse(nullParser, "      "));
assert.throws(() => parse(nullParser, "hello"));
assert.throws(() => parse(nullParser, "nul"));
assert.throws(() => parse(nullParser, "null   a"));



assert.equal(parse(numberParser, "0"), 0);
assert.equal(parse(numberParser, "-0"), -0);
assert.equal(parse(numberParser, "1"), 1);
assert.equal(parse(numberParser, "12"), 12);
assert.equal(parse(numberParser, "120"), 120);
assert.equal(parse(numberParser, "-501"), -501);
assert.equal(parse(numberParser, "     1024  "), 1024);
assert.equal(parse(numberParser, "  -98765     "), -98765);
assert.equal(parse(numberParser, "0.5"), 0.5);
assert.equal(parse(numberParser, "-0.5"), -0.5);
assert.equal(parse(numberParser, "15.003"), 15.003);
assert.equal(parse(numberParser, "   24.123 "), 24.123);
assert.equal(parse(numberParser, "    -100.50"), -100.5);
assert.equal(parse(numberParser, "0.0"), 0);
assert.equal(parse(numberParser, "-0.0"), -0);
assert.equal(parse(numberParser, "10.000"), 10);
assert.throws(() => parse(numberParser, ""));
assert.throws(() => parse(numberParser, "00"));
assert.throws(() => parse(numberParser, "-00"));
assert.throws(() => parse(numberParser, "  0000 "));
assert.throws(() => parse(numberParser, "  -0000 "));
assert.throws(() => parse(numberParser, "hello"));
assert.throws(() => parse(numberParser, "h15"));
assert.throws(() => parse(numberParser, "15N"));
assert.throws(() => parse(numberParser, "-j1"));
assert.throws(() => parse(numberParser, "-56h7"));
assert.throws(() => parse(numberParser, "77a7"));
assert.throws(() => parse(numberParser, "77    a"));
assert.throws(() => parse(numberParser, "."));
assert.throws(() => parse(numberParser, "    -."));
assert.throws(() => parse(numberParser, "5.1.2"));


assert.deepEqual(parse(arrayParser(numberParser), "[1,2,3,4,5]"), [1, 2, 3, 4, 5]);
assert.deepEqual(parse(arrayParser(numberParser), "[]"), []);
assert.deepEqual(parse(arrayParser(numberParser), "[   5 ]"), [5]);
assert.deepEqual(parse(arrayParser(numberParser), "      [5] "), [5]);
assert.deepEqual(parse(arrayParser(numberParser), "[   5, 10,   0]"), [5, 10, 0]);
assert.throws(() => parse(arrayParser(numberParser), ""));
assert.throws(() => parse(arrayParser(numberParser), "["));
assert.throws(() => parse(arrayParser(numberParser), "]"));
assert.throws(() => parse(arrayParser(numberParser), "[]    s"));
assert.throws(() => parse(arrayParser(numberParser), "hello"));
assert.throws(() => parse(arrayParser(numberParser), "d[]"));
assert.throws(() => parse(arrayParser(numberParser), "[5"));
assert.throws(() => parse(arrayParser(numberParser), "[1,2"));
assert.throws(() => parse(arrayParser(numberParser), "[3,   "));
assert.throws(() => parse(arrayParser(numberParser), JSON.stringify(["hello", "world"])));
assert.throws(() => parse(arrayParser(numberParser), JSON.stringify([5, "hello"])));



assert.deepEqual(parse(mapParser(numberParser), JSON.stringify({ foo: 1, bar: 2 })), new Map<string, number>([["foo", 1], ["bar", 2]]));
assert.deepEqual(parse(mapParser(numberParser), "{}"), new Map<string, number>());
assert.deepEqual(parse(mapParser(booleanParser), '  {   "foo"  :     true }    '), new Map<string, boolean>([["foo", true]]));
assert.throws(() => parse(mapParser(booleanParser), ""));
assert.throws(() => parse(mapParser(booleanParser), "{}    h"));
assert.throws(() => parse(mapParser(booleanParser), "{"));
assert.throws(() => parse(mapParser(booleanParser), "}"));
assert.throws(() => parse(mapParser(booleanParser), "{,}"));
assert.throws(() => parse(mapParser(booleanParser), "{foo: true}"));



const parser1 = arrayParser(oneOf(numberParser, booleanParser));

assert.deepEqual(parse(parser1, JSON.stringify([])), []);
assert.deepEqual(parse(parser1, JSON.stringify([1, 2, 3])), [1, 2, 3]);
assert.deepEqual(parse(parser1, JSON.stringify([true, true])), [true, true]);
assert.deepEqual(parse(parser1, JSON.stringify([1, false])), [1, false]);
assert.throws(() => parse(parser1, "5"));
assert.throws(() => parse(parser1, "true"));
assert.throws(() => parse(parser1, '"hello world"'));
assert.throws(() => parse(parser1, JSON.stringify(["one", "two", false])));
assert.throws(() => parse(parser1, JSON.stringify(["true", "1"])));

const parser2 = arrayParser(oneOf(booleanParser, numberParser));
const val1 = JSON.stringify([1, 2, true, false, 5]);

assert.deepEqual(parse(parser1, val1), parse(parser2, val1));
assert.throws(() => parse(parser2, "5"));
assert.throws(() => parse(parser2, "true"));
assert.throws(() => parse(parser2, '"hello world"'));
assert.throws(() => parse(parser2, JSON.stringify(["one", "two", false])));
assert.throws(() => parse(parser2, JSON.stringify(["true", "1"])));

const parser3 = oneOf(numberParser, arrayParser(nullable(arrayParser(stringParser))));

assert.equal(parse(parser3, "5"), 5);
assert.deepEqual(parse(parser3, JSON.stringify([])), []);
assert.deepEqual(parse(parser3, JSON.stringify([[], []])), [[], []]);
assert.deepEqual(parse(parser3, JSON.stringify([null])), [null]);
assert.deepEqual(parse(parser3, JSON.stringify([null, ["hello", "world"]])), [null, ["hello", "world"]]);
assert.throws(() => parse(parser3, '"hello world"'));
assert.throws(() => parse(parser3, "null"));
assert.throws(() => parse(parser3, JSON.stringify([1, 2, null])));

const parser4 = mapParser(nullable(arrayParser(oneOf(stringParser, mapParser(booleanParser)))));

assert.deepEqual(parse(parser4, JSON.stringify({})), new Map());
assert.deepEqual(parse(parser4, JSON.stringify({ foo: null })), new Map([["foo", null]]));
assert.deepEqual(parse(parser4, JSON.stringify({ foo: null, bar: [] })), new Map([["foo", null], ["bar", []]]));
assert.deepEqual(parse(parser4, JSON.stringify({ foo: null, bar: ["hello"] })), new Map([["foo", null], ["bar", ["hello"]]]));
assert.deepEqual(parse(parser4, JSON.stringify({ foo: null, bar: ["hello", { baz: true, qoux: false }] })), new Map([["foo", null], ["bar", ["hello", new Map([["baz", true], ["qoux", false]])]]]));
