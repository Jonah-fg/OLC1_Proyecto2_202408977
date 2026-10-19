// backend/test-entorno.js
const Entorno = require('./src/entorno/Entorno');
const { ErrorEjecucion} = require('./src/Utils/Errores');
console.log('==================PRUEBA DE ENTORNO===============');

const global=new Entorno();

//declaracion variables globales
global.declarar('x', 10, 'int', 1, 1);
global.declarar('mensaje', 'hola', 'string', 2, 1);

console.log('x =', global.obtener('x', 1, 1));
console.log('mensaje=', global.obtener('mensaje', 2, 1));

const hijo=global.crearHijo();
hijo.declarar('x', 20, 'int', 3, 1);
hijo.declarar('local', true, 'bool', 4, 1);

console.log('x en hijo (shadowing):', hijo.obtener('x', 3, 1));
console.log('x en gloal (sin cambios):', global.obtener('x', 1, 1));
console.log('local en hijo:', hijo.obtener('local', 4, 1));
console.log('global visible desde hijo:', hijo.obtener('mensaje', 4, 1));

//asignación
hijo.asignar('x', 30, 5, 1);
console.log('x en hijo después de asignar:', hijo.obtener('x', 5, 1));
console.log('x en global (sigue igual):', global.obtener('x', 1, 1));

//variable no declarada
try{
    hijo.obtener('noExiste', 6, 1);
} 
catch (e){
    console.log('Error esprado:', e.descripcion);
}

try{
    global.declarar('x', 99, 'int', 7, 1);
} 
catch (e){
    console.log('Error esperado:', e.descripcion);
}
console.log('\nTODO FUNCIONA');