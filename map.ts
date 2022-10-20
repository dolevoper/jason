import { Parser } from "./parser";
import { stringParser } from "./string";
import { dropOne, trimStart } from "./utils";

export function mapParser<T>(parser: Parser<undefined, T>): Parser<undefined, Map<string, T>> {
    return ({ str, offset }) => {
        if (str.charAt(offset) !== "{") throw new Error();

        let state = trimStart(dropOne({ str, offset, result: new Map<string, T>() }));

        while (state.offset < str.length) {
            if (str.charAt(state.offset) === "}") return dropOne(state);

            if (state.result.size > 0) {
                if (str.charAt(state.offset) !== ",") throw new Error();

                state = trimStart(dropOne(state));
            }

            const { offset: offsetAfterKey, result: key } = stringParser({ ...state, result: undefined });

            state = trimStart({ ...state, offset: offsetAfterKey });

            if (state.str.charAt(state.offset) !== ":") throw new Error();

            state = trimStart(dropOne(state));

            const { offset: offsetAfterValue, result: value } = parser({ ...state, result: undefined });

            state = trimStart({ ...state, offset: offsetAfterValue });
            state.result.set(key, value);
        }

        throw new Error();
    };
}
