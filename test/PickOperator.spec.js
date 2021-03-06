"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
var lib_1 = require("../lib");
describe("Lexer", function () {
    it("should parse", function () {
        var AST = lib_1.tokenizer("{\n            name,\n            age,\n            address{\n                number,\n                name\n            }\n        }").map(function (x) {
            return x;
            // return x.key
        }); //.join("");
        // let r =JSON.stringify(AST,null,1);
        console.log(AST);
    });
    it.only("should parse", function () {
        var tokens = lib_1.tokenizer("{\n            name,\n            age,\n            address {\n                number,\n                name,\n                bathrooms[],\n                devices[{name}]\n            }\n        }");
        var root = lib_1.LexerAnalysis(tokens);
        var parsed = lib_1.Lexer(root, {
            name: "Shavauhn",
            age: 30,
            address: {
                number: 27,
                name: "10 runner road",
                devices: [{
                        name: "Apple",
                        owner: "shavyg"
                    }],
                bathrooms: ["upstairs", "downstairs"]
            },
            not_needed: true
        });
        // console.log(root.children[0].keys);
        console.log(JSON.stringify(parsed, null, 2));
    });
});
//# sourceMappingURL=PickOperator.spec.js.map