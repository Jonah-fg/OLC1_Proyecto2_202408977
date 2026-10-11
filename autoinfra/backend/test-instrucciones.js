const instrucciones = require('./src/ast/instrucciones');

console.log('Instrucciones cargadas:');
Object.keys(instrucciones).forEach(nombre =>{
    console.log('  -', nombre);
});