const { Server, Service, Database } = require('./src/infraestructura');
console.log('=================PRUEBA DE INFRAESTRUCTURA=======================');

//Server válido
const backend= new Server('backend', {cpu: 4, memory: 8, disk: 100, os: 'ubuntu',}, 1, 1);

console.log('\nServer:');
console.log(' nombre:', backend.nombre);
console.log(' status:', backend.status); 
console.log(' cpu:', backend.cpu);
console.log('  packages:', backend.packages);

backend.agregarPaquete('docker');
backend.agregarPaquete('nginx');
backend.agregarPaquete('docker');//no se debe duplicar
console.log(' packages tras instalar:', backend.packages);

//Service válido
const api=new Service('api', {port: 8080,replicas: 2,}, 2, 1);

console.log('\nService:');
console.log('  nombre:', api.nombre);
console.log('  status:', api.status);      //debe ser 'undeployed'
console.log('  port:', api.port);
console.log('  replicas:', api.replicas);

//database valida
const postgres = new Database('postgres', { engine: 'postgresql', version: '16', port: 5432,}, 3, 1);

console.log('\nDatabase:');
console.log('  nombre:', postgres.nombre);
console.log('  status:', postgres.status); 
console.log(' engine:', postgres.engine);
console.log('  version:', postgres.version);

console.log('\n============CASOS INVÁLIDOS============');

try{
    new Server('malo', { cpu: 0, memory: 8, disk: 100, os: 'ubuntu'}, 4, 1);
} 
catch (e){
    console.log('Error esperado 1:', e.descripcion);
}

try{
    new Service('malo', {port: 99999 }, 5, 1);
} 
catch (e){
    console.log('Error esperado 2:', e.descripcion);
}

try {
    new Database('malo', {engine: 'oracle'}, 6, 1);
}
catch (e){
    console.log('Error eserado 3:', e.descripcion);
}

try{
    new Server('malo', { status: 'running' }, 7, 1);
} 
catch (e){
    console.log('Eror esperado 4:', e.descripcion);
}

try{
    new Service('malo', {inexistente: 1}, 8, 1);
} 
catch (e){
    console.log('Error esprado 5:', e.descripcion);
}
console.log('\nTODO FUNCIONA');