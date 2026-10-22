
//Cambia el estado del recurso de running a stopped.
const { validarRecurso } = require('./helpers');

function stop(entorno, args, linea, columna){
    const recurso=args[0];
    validarRecurso(recurso, 'stop', 1, linea, columna);

    if (!recurso.estaActivo()) {
        entorno.registrarBitacora(`[WARN] ${recurso.nombre} ya está detenido`);
        return false;
    }

    recurso.status= 'stopped';
    entorno.registrarBitacora(`[OK] ${recurso.nombre} stopped`);
    return true;
}
module.exports = stop;