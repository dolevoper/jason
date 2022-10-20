import { Parser, oneOf } from ".";

export const nullParser: Parser<undefined, null> = ({ str, offset }) => {
    if (str.startsWith("null", offset)) return {
        str,
        result: null,
        offset: offset + "null".length
    };

    throw new Error();
};

export function nullable<T>(parser: Parser<undefined, T>): Parser<undefined, T | null> {
    return oneOf(nullParser, parser);
}
