const { validarServer, validarString } = require('./helpers');
function uninstall(entorno, args, linea, columna) {
    const server = args[0];
    const paquete = args[1];
    validarServer(server, 'uninstall', 1, linea, columna);
    validarString(paquete, 'uninstall', 2, linea, columna);

    if(!server.packages.includes(paquete)){
        entorno.registrarBitacora(`[WARN]'${paquete}' no está instalado en '${server.nombre}'`);
        return false;
    }
    server.eliminarPaquete(paquete);
    entorno.registrarBitacora(`[OK] ${paquete} uninstalled from ${server.nombre}`);
    return true;
}
module.exports = uninstall;