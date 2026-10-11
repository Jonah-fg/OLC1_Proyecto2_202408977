const fs = require('fs');
const path=require('path');
const Lexer = require('./src/lexer/Lexer');
const Parser= require('./src/parser/Parser');

const archivo=process.argv[2] || path.join(__dirname, 'Pruebas.infra');
const codigoFuente=fs.readFileSync(archivo, 'utf-8');

const lexer =new Lexer(codigoFuente);
const { tokens, errores} = lexer.tokenizar();

console.log('===========ERRORES LEXICOS=======');
if(errores.length=== 0){
    console.log('Sin errores.');
} 
else{
    errores.forEach((e) =>{
        console.log(`[${e.tipo} ${e.codigo}] ${e.descripcion} (L${e.linea}:C${e.columna})`);
    });
}

const parser=new Parser(tokens);
console.log('\n===============AST ============');
try{
    const programa= parser.parsear();
    console.log(programa);
} 
catch (e){
    console.log('Error:', e.message);
}

console.log('\n=========ERRORES SINTÁCTICOS=======================');
const erroresSintacticos= parser.obtenerErrores();
if(erroresSintacticos.length === 0){
    console.log('Sin errores.');
} 
else{
    erroresSintacticos.forEach((e) =>{
        console.log(`[${e.tipo} ${e.codigo}] ${e.descripcion} (L${e.linea}:C${e.columna})`);
    });
}