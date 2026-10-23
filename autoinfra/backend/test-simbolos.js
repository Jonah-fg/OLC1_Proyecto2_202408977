const fs = require('fs');
const Lexer =require('./src/lexer/Lexer');
const Parser= require('./src/parser/Parser');
const Interpreter = require('./src/interpreter/Interpreter');

const archivo =process.argv[2] || 'intermedio.infra';
const fuente = fs.readFileSync(archivo, 'utf-8');

const lexer = new Lexer(fuente);
const {tokens, errores: erroresLexicos } = lexer.tokenizar();

const parser= new Parser(tokens);
const programa= parser.parsear();
const erroresSintacticos = parser.obtenerErrores();

const interpreter= new Interpreter(programa);
const reporte=interpreter.ejecutarConReporte(tokens, erroresLexicos, erroresSintacticos);

console.log('===========TABLA DE SÍMBOLOS=================');
console.log('Identificador| Categoría | Tipo | Ámbito | Valor');
console.log('-'.repeat(80));
reporte.simbolos.forEach((s)=>{
    console.log(`${s.identificador.padEnd(15)} | ${s.categoria.padEnd(10)} | ${String(s.tipo).padEnd(10)} | ${s.ambito.padEnd(10)} | ${s.valor}`);
});