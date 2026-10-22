
//modifica el número de réplicas de un service
const { validarService, validarEntero } = require('./helpers');
const { ErrorInfraestructura }= require('../../Utils/Errores');

function scale(entorno, args, linea, columna){
    const service =args[0];
    const nuevasReplicas = args[1];
    validarService(service, 'scale', 1, linea, columna);
    validarEntero(nuevasReplicas, 'scale', 2, linea, columna);

    if (nuevasReplicas<1){
        throw new ErrorInfraestructura('INFRA-004', `scale requiere al menos una réplica (recibido: ${nuevasReplicas})`, linea, columna);
    }
    const anteriores= service.replicas;
    service.replicas= nuevasReplicas;
    entorno.registrarBitacora(`[OK] ${service.nombre} scaled from ${anteriores} to ${nuevasReplicas} replicas`);
    return true;
}

module.exports = scale;