const fs=require('fs');
const Lexer = require('./src/lexer/Lexer');
const Parser=require('./src/parser/Parser');
const Interpreter = require('./src/interpreter/Interpreter');

const archivo = process.argv[2] || 'con-errores.infra';
const fuente = fs.readFileSync(archivo, 'utf-8');

const lexer= new Lexer(fuente);
const {tokens, errores: erroresLexicos } = lexer.tokenizar();

const parser = new Parser(tokens);
const programa= parser.parsear();
const erroresSintacticos = parser.obtenerErrores();
const interpreter=new Interpreter(programa);
const reporte= interpreter.ejecutarConReporte(tokens, erroresLexicos, erroresSintacticos);

console.log('=================REPORTE DE ERRORES CONSOLIDADOS================================');
console.log('Total:', reporte.errores.length);
console.log('');
console.log('# | Tipo | Código | Descripción | Línea | Columna');
console.log('-'.repeat(90));

reporte.errores.forEach((e, i) =>{
    console.log(
        `${i +1} | ${e.tipo.padEnd(15)} | ${e.codigo.padEnd(10)} | ${e.descripcion.substring(0, 45).padEnd(45)} |${e.linea} | ${e.columna}`
    );
});