import assert from "node:assert/strict";
import { parse, trueParser, falseParser, booleanParser, stringParser, nullParser } from ".";

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
