
import { Switch } from "switchjs";

class StringBuilder {

    string = [] as string[];
    add(str: string) {
        this.string.push(str)
    }

    toString() {
        return this.string.join("");
    }
}



export type __lexed_object = (string | string[])[];
export type _lexed_object = __lexed_object[];
export type lexed_object = (_lexed_object | string)[];

const TYPE_SCOPE_OPEN = "{";
const TYPE_SCOPE_CLOSE = "}";

const TYPE_SCOPE_ARRAY_OPEN = "[";
const TYPE_SCOPE_ARRAY_CLOSE = "]";

const TYPE_WHITE_SPACE = " ";
const TYPE_TAB = "\t"
// const TYPE_SPACE_ALT = "\s";
const TYPE_NEWLINE = "\n";
const TYPE_RETURN = "\r";
const TYPE_CHAR = "CHAR";
const TYPE_COMMA = ","
const TYPE_DOUBLE_QUOTE = "\"";
const TYPE_SINGLE_QUOTE = "'";

export class Token {

    type: string;
    ignorable: boolean = false;
    special: boolean = false;
    keyword: boolean = false

    line = -1;
    col = -1;
    constructor(public key: string) {
        switch (key) {
            case TYPE_SCOPE_OPEN:
            case TYPE_SCOPE_CLOSE:
            case TYPE_COMMA:
            case TYPE_SCOPE_ARRAY_OPEN:
            case TYPE_SCOPE_ARRAY_CLOSE:
                this.special = true;
                this.type = key;
                break;

            case TYPE_SINGLE_QUOTE:
            case TYPE_DOUBLE_QUOTE:
                this.special = true;
                this.type = key;
                this.keyword = true;
                break;
            case TYPE_WHITE_SPACE:
            case TYPE_TAB:
            // case TYPE_SPACE_ALT:
            case TYPE_NEWLINE:
            case TYPE_RETURN:
                this.ignorable = true;
                this.type = key;
                break;

            default:
                this.type = TYPE_CHAR
                this.special = false;
                this.keyword = true;
        }
    }
}

export function tokenizer(jsom_string: string, index = 0) {
    let tokens: Token[] = [];
    let jsom = jsom_string.split("");
    let current_char: string;
    let last_char: string;
    let next = () => {
        return current_char = jsom.shift();
    }
    let last = () => {
        return last_char = jsom.pop();
    }

    let col = 0;
    let line = 0;
    const move_position = () => {
        col++;
    }
    const newline = () => {
        col = 0;
        line++;
    }

    const tokenAdvance = (token: Token) => {
        token.col = col;
        token.line = line;
        if (token.key === TYPE_NEWLINE) {
            newline();
        }

    }
    while (next()) {
        let token = new Token(current_char);
        tokenAdvance(token);
        tokens.push(token);
    }

    return tokenizerKeyword(tokens);


}

export function tokenizerKeyword(tokens: Token[]) {



    let current_position = 0;

    const next_position = () => {
        return current_position + 1;
    }

    const next = () => {
        return tokens[current_position + 1];
    }

    const current = () => {
        return tokens[current_position];
    }

    const hasNext = () => {
        return !!next();
    }

    const moveNext = () => {

        current_position++;
    }

    const length = () => {
        return tokens.length;
    }

    const remove = (index: number) => {
        let item = tokens.splice(index, 1);
        return item[0];
    }

    const removeNext = () => {
        return remove(next_position());
    }

    const collapse_keyword = () => {

        if (hasNext() && next().keyword) {
            let token = removeNext();
            current().key += token.key
            return true;
        } else return false;
    }

    const is_keyword_character = () => {
        return current().keyword;
    }

    const remove_this = () => {
        return remove(current_position);
    }

    while (hasNext()) {
        if (current().keyword) {
            while (collapse_keyword()) {
            }
        }


        //Not going to do this maybe.
        //might be worth it to keep these things
        while (next().ignorable) {
            removeNext();
        }

        moveNext();

    }


    return tokens;
}





export class Node {
    parent?: Node;

    open: boolean;
    key: string;
    keyword: Keyword[] = [];
    children: Node[] = [];

    get keys() {
        return this.keyword.map(x => x.token.key)
    }

    constructor() {

    }
}

export class ArrayNode extends Node {
    constructor() {
        super();
    }
}


export class Keyword {
    token: Token;
}

export function LexerAnalysis(tokens: Token[]) {

    let position = 0;

    const token = () => {
        return tokens[position];
    }

    const has_next = () => {
        return (tokens.length - 1) > position
    }

    const hasPrevious = () => {
        return position !== 0;
    }

    const previous = () => {
        return tokens[position - 1];
    }

    const next = () => {
        return tokens[position + 1]
    }

    const move_next = () => {
        position++;
    }




    let node: Node;

    let stack: Node[] = [];

    const push = () => {

        if (node)
            stack.push(node);

        let parent = node;
        node = new Node();

        node.parent = parent;

        if (parent) {
            parent.children.push(node);
        }
    }

    const pull = () => {
        // if (stack.length > 1) {
        node = stack.pop();
        return node;
        // } else {
        // return stack[0];
        // }
    }


    const array_push = () => {
        push();
        let parent = node.parent;

        if (parent) {
            parent.children.pop();
            node = new ArrayNode();
            parent.children.push(node);
            node.parent = parent;
        }
    }

    const array_pull = () => {
        pull();
    }






    while (has_next()) {

        let t = token();

        let { _switch, _case } = new Switch();

        _switch(t.key, () => {



            _case(TYPE_SCOPE_OPEN, () => {
                push();

                node.open = true;

                if (hasPrevious()) {
                    let p = previous();
                    node.key = p.key
                }

            })

            _case(TYPE_SCOPE_CLOSE, () => {
                node.open = false;
                pull();
            })

            _case(TYPE_SCOPE_ARRAY_OPEN, () => {
                if (has_next() && next().type === TYPE_SCOPE_ARRAY_CLOSE) {
                    let n = next();
                    //move_next();
                } else if (next().type === TYPE_SCOPE_OPEN) {
                    // array_push()
                }
                array_push();
                
                if (hasPrevious()) {
                    let p = previous();
                    node.key = p.key
                }

            })

            _case(TYPE_SCOPE_ARRAY_CLOSE, () => {
                if (hasPrevious() && previous().type === TYPE_SCOPE_ARRAY_OPEN) {
                    //move_next();
                }
                array_pull();
                // pull();

            })


            _case(() => {
                return t.type === TYPE_CHAR;
            }, () => {
                let k = new Keyword();
                k.token = t;
                node.keyword.push(k);
            })

        })

        move_next();
    }

    return node;
}

export function Lexer(node: Node, object) {

    let { _switch, _case } = new Switch();








    function internal(node: Node, object: any) {

        // console.log(node);

        if (!node) {
            return undefined;
        }

        if (object === undefined) {
            return object;
        }


        let keys = node.keys;
        let clone: any = node instanceof ArrayNode ? [] : {};


        let { _switch, _case } = new Switch<Node>({
            compareFunction: (input, test) => {
                let result = input.constructor === test[0]
                if (result) {
                    // console.log(input.constructor.name,test[0].name);
                } else {

                }

                return result;
            }
        });


        _switch(node, () => {


            _case([ArrayNode], () => {



                keys.forEach(key => {
                    clone[key] = object[key];
                })

                let index = 0;
                object.forEach(n => {
                    try {
                        if(node.children.length===0){
                            clone[index]=object[index];
                        }else
                        clone[index] = internal(node.children[0], object[index]);
                    } catch (e) {

                    }
                    index++;
                })

            })

            _case([Node], () => {



                keys.forEach(key => {
                     clone[key] = object[key];
                })

                node.children.forEach(n => {
                    try {
                        clone[n.key] = internal(n, object[n.key]);
                    } catch (e) {

                    }
                })

            })

            return () => {
                // console.log(node.constructor.name);
            }
        })





        return clone;

    }

    return internal(node, object);

}




export class JSOM {
    constructor(){
        throw new Error("Cannot instanciate a static class");
    }


    static parse(jsom:string,object:any){
        if(object){
            let tokens = tokenizer(jsom)
            let nodes = LexerAnalysis(tokens);
            return Lexer(nodes,object);
        }
    }
}