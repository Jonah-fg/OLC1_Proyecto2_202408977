// backend/test-nativas.js
const Entorno = require('./src/entorno/Entorno');
const {Server, Service, Database, funcionesNativas}= require('./src/infraestructura');

console.log('=============PRUEBA DE FUNCIONES NATIVAS==================');

const entorno= new Entorno();

//creacion recursos
const backend =new Server('backend', { cpu: 4, memory: 8, disk: 100, os: 'ubuntu' }, 1, 1);
const api= new Service('api', { port: 8080, replicas: 2 }, 2, 1);
const postgres=new Database('postgres', {engine: 'postgresql', version: '16', port: 5432}, 3, 1);
api.dependsOn=['postgres'];

//registro recursos
entorno.registrarRecurso('backend', backend);
entorno.registrarRecurso('api', api);
entorno.registrarRecurso('postgres', postgres);

console.log('\n----------Flujo correcto------');
funcionesNativas.start(entorno, [postgres], 4, 1);
funcionesNativas.start(entorno, [backend], 5, 1);
funcionesNativas.install(entorno, [backend, 'docker'], 6, 1);
funcionesNativas.install(entorno, [backend, 'nginx'], 7, 1);
funcionesNativas.deploy(entorno, [backend, api], 8, 1);
funcionesNativas.scale(entorno, [api, 3], 9, 1);
funcionesNativas.print(entorno, ['API desplegada en', backend.nombre], 10, 1);

console.log('Consola:', entorno.obtenerConsola());
console.log('Bitácora:');
entorno.obtenerBitacora().forEach((b) => console.log('  '+ b));

console.log('\n-----------------Casos de error-----------------------');

//start sobre algo activo
try{
    const r= funcionesNativas.start(entorno, [backend], 11, 1);
    console.log('start sobre activo retorna:', r);
} 
catch (e){
    console.log('Error inesperado:', e.descripcion);
}

//install en server detenido
const db2=new Database('db2', { engine: 'postgresql', version: '16', port: 5432 }, 12, 1);
entorno.registrarRecurso('db2', db2);
try{
    funcionesNativas.install(entorno, [db2, 'algo'], 13, 1);
} 
catch (e) {
    console.log('Error esperado 1:', e.codigo, '-', e.descripcion);
}

funcionesNativas.stop(entorno, [postgres], 14, 1);
try{
    funcionesNativas.deploy(entorno, [backend, api], 15, 1);
} 
catch (e){
    console.log('Error esprado 2:', e.codigo, '-', e.descripcion);
}

//scale con 0 replicas
try{
    funcionesNativas.scale(entorno, [api, 0], 16, 1);
} 
catch (e) {
    console.log('Error esperado 3:', e.codigo, '-', e.descripcion);
}

//length sobre no arreglo
try{
    funcionesNativas.length(entorno, [42], 17, 1);
}
catch (e){
    console.log('Error esperado 4:', e.descripcion);
}

console.log('\nstatus(backend) =', funcionesNativas.status(entorno, [backend], 18, 1));
console.log('status(api) =', funcionesNativas.status(entorno, [api], 19, 1));
console.log('length(backend.packages) =', funcionesNativas.length(entorno, [backend.packages], 20, 1));
console.log('\nTODO FUNCIONA');