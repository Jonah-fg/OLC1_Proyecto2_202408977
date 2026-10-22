const { validarRecurso } = require('./helpers');
function disconnect(entorno, args, linea, columna) {
    const origen = args[0];
    const destino = args[1];
    validarRecurso(origen, 'disconnect', 1, linea, columna);
    validarRecurso(destino, 'disconnect', 2, linea, columna);

    if(!origen.conexiones.includes(destino.nombre)){
        entorno.registrarBitacora(`[WARN] ${origen.nombre} no está conectado a ${destino.nombre}`);
        return false;
    }
    origen.eliminarConexion(destino);
    entorno.registrarBitacora(`[OK] ${origen.nombre} disconnected from ${destino.nombre}`);
    return true;
}

module.exports = disconnect;