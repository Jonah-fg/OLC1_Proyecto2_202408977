const { validarServer, validarService } = require('./helpers');
const { ErrorInfraestructura } = require('../../Utils/Errores');

function deploy(entorno, args, linea, columna) {
    const server = args[0];
    const service=args[1];
    validarServer(server, 'deploy', 1, linea, columna);
    validarService(service, 'deploy', 2, linea, columna);

    //server en running
    if (!server.estaActivo()){
        throw new ErrorInfraestructura('INFRA-004', `No se puede desplegar '${service.nombre}'. El server '${server.nombre}' está detenido`, linea, columna);
    }

    //todas las dependencias deben existir y estar running
    for (const nombreDependencia of service.dependsOn){
        const dependencia = entorno.obtenerRecurso(nombreDependencia);
        if (!dependencia){
            throw new ErrorInfraestructura('INFRA-004', `No se puede desplegar '${service.nombre}'. Dependencia '${nombreDependencia}' no existe`, linea, columna);
        }
        if(!dependencia.estaActivo()){
            throw new ErrorInfraestructura('INFRA-004', `No se puede desplegar '${service.nombre}'. Dependencia '${nombreDependencia}' se encuentra en estado stopped`, linea, columna);
        }
    }
    service.host= server;
    service.status='running';
    entorno.registrarBitacora(`[OK] ${service.nombre} deployed on ${server.nombre}`);
    return true;
}
module.exports = deploy;