import { Parser } from ".";

export const stringParser: Parser<undefined, string> = ({ str, offset }) => {
    if (!str.startsWith('"', offset)) throw new Error();

    let result = "";
    let encode = false;
    offset++;

    while (str.charAt(offset) != '"' || encode) {
        switch (true) {
            case offset >= str.length: throw new Error();
            case !encode && str.charAt(offset) === "\\":
                encode = true;
                offset++;
                break;
            case encode:
                result += getEncodedCharacter(str.charAt(offset));
                encode = false;
                offset++;
                break;
            default:
                result += str.charAt(offset);
                offset++;
        }
    }

    return {
        str,
        offset: offset + 1,
        result
    };
};

function getEncodedCharacter(char: string): string {
    switch (char) {
        case "b": return "\b";
        case "f": return "\f";
        case "n": return "\n";
        case "r": return "\r";
        case "t": return "\t";
        case '"': return '"';
        case "\\": return "\\";
        default: throw new Error();
    }
}
