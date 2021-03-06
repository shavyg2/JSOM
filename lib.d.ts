export declare type __lexed_object = (string | string[])[];
export declare type _lexed_object = __lexed_object[];
export declare type lexed_object = (_lexed_object | string)[];
export declare class Token {
    key: string;
    type: string;
    ignorable: boolean;
    special: boolean;
    keyword: boolean;
    line: number;
    col: number;
    constructor(key: string);
}
export declare function tokenizer(jsom_string: string, index?: number): Token[];
export declare function tokenizerKeyword(tokens: Token[]): Token[];
export declare class Node {
    parent?: Node;
    open: boolean;
    key: string;
    keyword: Keyword[];
    children: Node[];
    readonly keys: string[];
    constructor();
}
export declare class ArrayNode extends Node {
    constructor();
}
export declare class Keyword {
    token: Token;
}
export declare function LexerAnalysis(tokens: Token[]): Node;
export declare function Lexer(node: Node, object: any): any;
export declare class JSOM {
    constructor();
    static parse(jsom: string, object: any): any;
}
