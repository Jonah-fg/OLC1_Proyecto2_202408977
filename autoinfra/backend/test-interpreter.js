//Prueba integral: lexer → parser → interpreter
const fs = require('fs');
const path =require('path');
const Lexer = require('./src/lexer/Lexer');
const Parser=require('./src/parser/Parser');
const Interpreter= require('./src/interpreter/Interpreter');

const archivo =process.argv[2] || path.join(__dirname, 'Pruebas.infra');
const codigoFuente=fs.readFileSync(archivo, 'utf-8');

const lexer= new Lexer(codigoFuente);
const {tokens, errores: erroresLexicos }= lexer.tokenizar();

if(erroresLexicos.length > 0){
    console.log('===========ERRORES LÉXICOS==============');
    erroresLexicos.forEach((e) => console.log(`[${e.tipo} ${e.codigo}] ${e.descripcion} (L${e.linea}:C${e.columna})`));
    process.exit(1);
}

const parser=new Parser(tokens);
const programa= parser.parsear();

const erroresSintacticos= parser.obtenerErrores();
if (erroresSintacticos.length > 0){
    console.log('========================ERRORES SINTÁCTICOS===========');
    erroresSintacticos.forEach((e)=> console.log(`[${e.tipo} ${e.codigo}] ${e.descripcion} (L${e.linea}:C${e.columna})`));
    process.exit(1);
}

const interpreter= new Interpreter(programa);
const resultado =interpreter.ejecutar();

console.log('===========================CONSOLA================');
if (resultado.consola.length ===0) {
    console.log('(vacía)');
} 
else{
    resultado.consola.forEach((linea) => console.log(linea));
}

console.log('\n==================BITACORA ====================================');
resultado.bitacora.forEach((linea) => console.log(linea));

console.log('\n===ERRORES===');
if (resultado.errores.length=== 0){
    console.log('Sin errores.');
} 
else{
    resultado.errores.forEach((e) =>console.log(`[${e.tipo} ${e.codigo}] ${e.descripcion} (L${e.linea}:C${e.columna})`));
}
console.log('\n==================ESTADO FINAL DE INFRAESTRUCTURA=====================');
console.log('\nServidores:');
resultado.infraestructura.servidores.forEach((s) => {console.log(`  ${s.nombre}: ${s.status} | ${s.cpu} CPU, ${s.memory} GB, ${s.disk} GB, OS=${s.os}`);console.log(`  packages: [${s.packages.join(', ')}]`);});

console.log('\nServicios:');
resultado.infraestructura.servicios.forEach((s) =>{
    console.log(`  ${s.nombre}: ${s.status} | port=${s.port}, replicas=${s.replicas}`);
    if(s.host) 
        console.log(`  host: ${s.host}`);

    if (s.dependsOn.length> 0){
        console.log(`    dependsOn: [${s.dependsOn.join(', ')}]`);
    }
});

console.log('\nDatabases:');
resultado.infraestructura.databases.forEach((d) =>{
    console.log(`  ${d.nombre}: ${d.status} | ${d.engine} ${d.version} :${d.port}`);
});