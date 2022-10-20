import { trimStart } from "./utils";

export type ParsingState<T> = { str: string, offset: number, result: T };

export type Parser<T, U> = (state: ParsingState<T>) => ParsingState<U>;

export function parse<T>(parser: Parser<undefined, T>, str: string): T {
    const initialState = trimStart({ str, offset: 0, result: undefined });

    if (initialState.offset >= str.length) throw new Error();

    const { offset, result } = trimStart(parser(initialState));

    if (offset < str.length) throw new Error();

    return result;
}
