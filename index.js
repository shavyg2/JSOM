"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("./lib");
exports.JSOM = lib_1.JSOM;
var lib_2 = require("./lib");
exports.default = lib_2.JSOM;
function parse(jsom, object) {
    var tokens = lib_2.tokenizer(jsom);
    var nodes = lib_2.LexerAnalysis(tokens);
    return lib_2.Lexer(nodes, object);
}
exports.parse = parse;
//# sourceMappingURL=index.js.map