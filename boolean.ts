import { Parser, oneOf } from ".";

export const trueParser: Parser<undefined, true> = ({ str, offset }) => {
    if (str.startsWith("true", offset)) return {
        str,
        result: true,
        offset: offset + "true".length
    };

    throw new Error();
};

export const falseParser: Parser<undefined, false> = ({ str, offset }) => {
    if (str.startsWith("false", offset)) return {
        str,
        result: false,
        offset: offset + "false".length
    };

    throw new Error();
};

export const booleanParser = oneOf(trueParser, falseParser);
