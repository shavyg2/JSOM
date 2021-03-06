"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var switchjs_1 = require("switchjs");
var StringBuilder = (function () {
    function StringBuilder() {
        this.string = [];
    }
    StringBuilder.prototype.add = function (str) {
        this.string.push(str);
    };
    StringBuilder.prototype.toString = function () {
        return this.string.join("");
    };
    return StringBuilder;
}());
var TYPE_SCOPE_OPEN = "{";
var TYPE_SCOPE_CLOSE = "}";
var TYPE_SCOPE_ARRAY_OPEN = "[";
var TYPE_SCOPE_ARRAY_CLOSE = "]";
var TYPE_WHITE_SPACE = " ";
var TYPE_TAB = "\t";
// const TYPE_SPACE_ALT = "\s";
var TYPE_NEWLINE = "\n";
var TYPE_RETURN = "\r";
var TYPE_CHAR = "CHAR";
var TYPE_COMMA = ",";
var TYPE_DOUBLE_QUOTE = "\"";
var TYPE_SINGLE_QUOTE = "'";
var Token = (function () {
    function Token(key) {
        this.key = key;
        this.ignorable = false;
        this.special = false;
        this.keyword = false;
        this.line = -1;
        this.col = -1;
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
                this.type = TYPE_CHAR;
                this.special = false;
                this.keyword = true;
        }
    }
    return Token;
}());
exports.Token = Token;
function tokenizer(jsom_string, index) {
    if (index === void 0) { index = 0; }
    var tokens = [];
    var jsom = jsom_string.split("");
    var current_char;
    var last_char;
    var next = function () {
        return current_char = jsom.shift();
    };
    var last = function () {
        return last_char = jsom.pop();
    };
    var col = 0;
    var line = 0;
    var move_position = function () {
        col++;
    };
    var newline = function () {
        col = 0;
        line++;
    };
    var tokenAdvance = function (token) {
        token.col = col;
        token.line = line;
        if (token.key === TYPE_NEWLINE) {
            newline();
        }
    };
    while (next()) {
        var token = new Token(current_char);
        tokenAdvance(token);
        tokens.push(token);
    }
    return tokenizerKeyword(tokens);
}
exports.tokenizer = tokenizer;
function tokenizerKeyword(tokens) {
    var current_position = 0;
    var next_position = function () {
        return current_position + 1;
    };
    var next = function () {
        return tokens[current_position + 1];
    };
    var current = function () {
        return tokens[current_position];
    };
    var hasNext = function () {
        return !!next();
    };
    var moveNext = function () {
        current_position++;
    };
    var length = function () {
        return tokens.length;
    };
    var remove = function (index) {
        var item = tokens.splice(index, 1);
        return item[0];
    };
    var removeNext = function () {
        return remove(next_position());
    };
    var collapse_keyword = function () {
        if (hasNext() && next().keyword) {
            var token = removeNext();
            current().key += token.key;
            return true;
        }
        else
            return false;
    };
    var is_keyword_character = function () {
        return current().keyword;
    };
    var remove_this = function () {
        return remove(current_position);
    };
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
exports.tokenizerKeyword = tokenizerKeyword;
var Node = (function () {
    function Node() {
        this.keyword = [];
        this.children = [];
    }
    Object.defineProperty(Node.prototype, "keys", {
        get: function () {
            return this.keyword.map(function (x) { return x.token.key; });
        },
        enumerable: true,
        configurable: true
    });
    return Node;
}());
exports.Node = Node;
var ArrayNode = (function (_super) {
    tslib_1.__extends(ArrayNode, _super);
    function ArrayNode() {
        return _super.call(this) || this;
    }
    return ArrayNode;
}(Node));
exports.ArrayNode = ArrayNode;
var Keyword = (function () {
    function Keyword() {
    }
    return Keyword;
}());
exports.Keyword = Keyword;
function LexerAnalysis(tokens) {
    var position = 0;
    var token = function () {
        return tokens[position];
    };
    var has_next = function () {
        return (tokens.length - 1) > position;
    };
    var hasPrevious = function () {
        return position !== 0;
    };
    var previous = function () {
        return tokens[position - 1];
    };
    var next = function () {
        return tokens[position + 1];
    };
    var move_next = function () {
        position++;
    };
    var node;
    var stack = [];
    var push = function () {
        if (node)
            stack.push(node);
        var parent = node;
        node = new Node();
        node.parent = parent;
        if (parent) {
            parent.children.push(node);
        }
    };
    var pull = function () {
        // if (stack.length > 1) {
        node = stack.pop();
        return node;
        // } else {
        // return stack[0];
        // }
    };
    var array_push = function () {
        push();
        var parent = node.parent;
        if (parent) {
            parent.children.pop();
            node = new ArrayNode();
            parent.children.push(node);
            node.parent = parent;
        }
    };
    var array_pull = function () {
        pull();
    };
    var _loop_1 = function () {
        var t = token();
        var _a = new switchjs_1.Switch(), _switch = _a._switch, _case = _a._case;
        _switch(t.key, function () {
            _case(TYPE_SCOPE_OPEN, function () {
                push();
                node.open = true;
                if (hasPrevious()) {
                    var p = previous();
                    node.key = p.key;
                }
            });
            _case(TYPE_SCOPE_CLOSE, function () {
                node.open = false;
                pull();
            });
            _case(TYPE_SCOPE_ARRAY_OPEN, function () {
                if (has_next() && next().type === TYPE_SCOPE_ARRAY_CLOSE) {
                    var n = next();
                    //move_next();
                }
                else if (next().type === TYPE_SCOPE_OPEN) {
                    // array_push()
                }
                array_push();
                if (hasPrevious()) {
                    var p = previous();
                    node.key = p.key;
                }
            });
            _case(TYPE_SCOPE_ARRAY_CLOSE, function () {
                if (hasPrevious() && previous().type === TYPE_SCOPE_ARRAY_OPEN) {
                    //move_next();
                }
                array_pull();
                // pull();
            });
            _case(function () {
                return t.type === TYPE_CHAR;
            }, function () {
                var k = new Keyword();
                k.token = t;
                node.keyword.push(k);
            });
        });
        move_next();
    };
    while (has_next()) {
        _loop_1();
    }
    return node;
}
exports.LexerAnalysis = LexerAnalysis;
function Lexer(node, object) {
    var _a = new switchjs_1.Switch(), _switch = _a._switch, _case = _a._case;
    function internal(node, object) {
        // console.log(node);
        if (!node) {
            return undefined;
        }
        if (object === undefined) {
            return object;
        }
        var keys = node.keys;
        var clone = node instanceof ArrayNode ? [] : {};
        var _a = new switchjs_1.Switch({
            compareFunction: function (input, test) {
                var result = input.constructor === test[0];
                if (result) {
                    // console.log(input.constructor.name,test[0].name);
                }
                else {
                }
                return result;
            }
        }), _switch = _a._switch, _case = _a._case;
        _switch(node, function () {
            _case([ArrayNode], function () {
                keys.forEach(function (key) {
                    clone[key] = object[key];
                });
                var index = 0;
                object.forEach(function (n) {
                    try {
                        if (node.children.length === 0) {
                            clone[index] = object[index];
                        }
                        else
                            clone[index] = internal(node.children[0], object[index]);
                    }
                    catch (e) {
                    }
                    index++;
                });
            });
            _case([Node], function () {
                keys.forEach(function (key) {
                    clone[key] = object[key];
                });
                node.children.forEach(function (n) {
                    try {
                        clone[n.key] = internal(n, object[n.key]);
                    }
                    catch (e) {
                    }
                });
            });
            return function () {
                // console.log(node.constructor.name);
            };
        });
        return clone;
    }
    return internal(node, object);
}
exports.Lexer = Lexer;
var JSOM = (function () {
    function JSOM() {
        throw new Error("Cannot instanciate a static class");
    }
    JSOM.parse = function (jsom, object) {
        if (object) {
            var tokens = tokenizer(jsom);
            var nodes = LexerAnalysis(tokens);
            return Lexer(nodes, object);
        }
    };
    return JSOM;
}());
exports.JSOM = JSOM;
//# sourceMappingURL=lib.js.map