import { Parser, ParsingState } from "./parser";

export function trimStart<T>({ str, result, offset }: ParsingState<T>): ParsingState<T> {
    return {
        str,
        result,
        offset: str.slice(offset).search(/\S|$/) + offset
    };
}

type ParserReturnType<T extends Parser<undefined, any>> = T extends Parser<undefined, infer U> ? U : never;

export function oneOf<T extends Parser<undefined, any>[]>(...parsers: [...T]): Parser<undefined, ParserReturnType<T[number]>> {
    return (state) => {
        for (const parser of parsers) {
            try {
                return parser(state);
            } catch {}
        }

        throw new Error();
    };
}

export class ParsingError extends Error {
    constructor(public invalidCharacter: string, public position: number) {
        super(`Invalid character "${invalidCharacter}" at position: ${position}`);
    }
}
