
const fs = require('fs');
const path =require('path');
const Lexer =require('./src/lexer/Lexer');

const archivo=process.argv[2] || path.join(__dirname, 'Pruebas.infra');
const codigoFuente =fs.readFileSync(archivo, 'utf-8');

const lexer=new Lexer(codigoFuente);
const {tokens, errores}= lexer.tokenizar();

console.log('=======TOKENS===?=======');
tokens.forEach(t =>console.log(t.toString()));

console.log('\n============ ERRORES =========');
if (errores.length=== 0) {
  console.log('Sin errores lexicos.');
} 
else{
  errores.forEach(e =>{
    console.log(`[${e.tipo} ${e.codigo}] ${e.descripcion} (L${e.linea}:C${e.columna})`);
  });
}