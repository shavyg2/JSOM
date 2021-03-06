export { JSOM } from './lib';
import { JSOM, tokenizer, LexerAnalysis, Lexer } from './lib';
export default JSOM;



export function parse(jsom:string,object:any){
    let tokens = tokenizer(jsom);
    let nodes = LexerAnalysis(tokens);
    return Lexer(nodes,object);
}

