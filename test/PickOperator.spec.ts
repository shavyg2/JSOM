import "source-map-support/register";
import { expect } from "chai";
import { tokenizer, LexerAnalysis, Lexer } from '../lib';


describe("Lexer", () => {

    it("should parse", () => {
        let AST = tokenizer(`{
            name,
            age,
            address{
                number,
                name
            }
        }`).map(x=>{
            return x;
            // return x.key
        })//.join("");
        // let r =JSON.stringify(AST,null,1);
        console.log(AST);
    })



    it.only("should parse",()=>{
        let tokens = tokenizer(`{
            name,
            age,
            address {
                number,
                name,
                bathrooms[],
                devices[{name}]
            }
        }`);


        let root = LexerAnalysis(tokens);
        
        let parsed = Lexer(root,{
            name:"Shavauhn",
            age:30,
            address:{
                number:27,
                name:"10 runner road",
                devices:[{
                    name:"Apple",
                    owner:"shavyg"
                }],
                bathrooms:["upstairs","downstairs"]
            },
            not_needed:true
        });

        // console.log(root.children[0].keys);


        console.log(JSON.stringify(parsed,null,2));

    })

})