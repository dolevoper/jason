import { Parser, ParsingState } from "./parser";
import { dropOne, trimStart } from "./utils";

export function arrayParser<T>(p: Parser<undefined, T>): Parser<undefined, T[]> {
    return ({ str, offset }) => {
        if (str.charAt(offset) !== "[") throw new Error();

        const parser = pushParser(p);
        let state: ParsingState<T[]> = trimStart(dropOne({ str, offset, result: [] }));

        while (state.offset < str.length) {
            if (state.str.charAt(state.offset) === "]") return dropOne(state);
            
            if (state.result.length > 0) {
                if (str.charAt(state.offset) !== ",") throw new Error();

                state = dropOne(state);
                state = trimStart(state);
            }


            state = parser(state);
            state = trimStart(state);
        }

        throw new Error();
    };
}

function pushParser<T>(parser: Parser<undefined, T>): Parser<T[], T[]> {
    return ({ str, offset, result }) => {
        const itemState = parser({ str, offset, result: undefined });

        return { str, offset: itemState.offset, result: [...result, itemState.result] };
    };
}
