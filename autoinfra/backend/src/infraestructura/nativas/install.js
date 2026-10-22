
//Instalacion de un paquete en un servidor activo
const { validarServer, validarString } = require('./helpers');
const { ErrorInfraestructura } = require('../../Utils/Errores');

function install(entorno, args, linea, columna) {
    const server =args[0];
    const paquete= args[1];
    validarServer(server, 'install', 1, linea, columna);
    validarString(paquete, 'install', 2, linea, columna);

    if (!server.estaActivo()){
        throw new ErrorInfraestructura('INFRA-004', `No se puede instalar '${paquete}' en '${server.nombre}'. El server está detenido`, linea, columna);
    }

    if (server.packages.includes(paquete)){
        entorno.registrarBitacora(`[WARN] '${paquete}' ya está intalado en '${server.nombre}'`);
        return false;
    }
    server.agregarPaquete(paquete);
    entorno.registrarBitacora(`[OK] ${paquete} installed on ${server.nombre}`);
    return true;
}

module.exports = install;