const fs = require('fs');
const path= require('path');
const Lexer= require('./src/lexer/Lexer');
const Parser=require('./src/parser/Parser');

const archivo = process.argv[2] || path.join(__dirname, 'Pruebas.infra');
const codigoFuente=fs.readFileSync(archivo, 'utf-8');

const lexer = new Lexer(codigoFuente);
const { tokens, errores } = lexer.tokenizar();

console.log('=========ERRORES LÉXICOS===============');
if (errores.length === 0) {
    console.log('Sin errores.');
} 
else{
    errores.forEach((e)=>{
        console.log(`[${e.tipo} ${e.codigo}] ${e.descripcion} (L${e.linea}:C${e.columna})`);
    });
}

const parser = new Parser(tokens);
const programa= parser.parsear();

console.log('\n==========ESTRUCTURA DEL PROGRAMA=====');
console.log(`Declaraciones globales: ${programa.declaraciones.length}`);
programa.declaraciones.forEach((decl, i) => {
    console.log(`  ${i+1}. ${decl.constructor.name}${decl.nombre ? ': ' +decl.nombre : ''}`);
});
console.log(`Bloque main: ${programa.bloqueMain ? 'presente (' + programa.bloqueMain.instrucciones.length + ' instrucciones)' : 'AUSENTE'}`);

console.log('\n=========ERRORES SINTÁCTICOS==============');
const errs = parser.obtenerErrores();
if (errs.length===0) {
    console.log('Sin erores.');
} 
else {
    errs.forEach((e) =>{
        console.log(`[${e.tipo} ${e.codigo}] ${e.descripcion} (L${e.linea}:C${e.columna})`);
    });
}