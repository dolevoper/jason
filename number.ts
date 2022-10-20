import { Parser } from "./parser";

export const numberParser: Parser<undefined, number> = ({ str, offset }) => {
    const isNegative = str.charAt(offset) === "-";
    let result = 0;
    let exp = 0;

    if (isNegative) offset++;

    if (str.startsWith("00", offset) || !isDigit(str.charAt(offset))) throw new Error();
    
    for (; offset < str.length; offset++) {
        switch (true) {
            case str.charAt(offset) === "." && exp === 0:
                exp = 10;
                break;

            case str.charAt(offset) === ".":
                throw new Error();

            case !isDigit(str.charAt(offset)):
                return { str, offset, result: isNegative ? -result : result };

            case exp === 0:
                result = (result * 10) + toDigit(str.charAt(offset));
                break;

            default:
                result += toDigit(str.charAt(offset)) / exp;
                exp *= 10;
        }
    }

    if (exp === 10) throw new Error();

    return { str, offset, result: isNegative ? -result : result };
};

const isDigit = (char: string) => char.charCodeAt(0) >= "0".charCodeAt(0) && char.charCodeAt(0) <= "9".charCodeAt(0);
const toDigit = (char: string) => char.charCodeAt(0) - "0".charCodeAt(0);
