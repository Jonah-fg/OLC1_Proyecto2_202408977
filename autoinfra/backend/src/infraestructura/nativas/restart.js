//reinicia un recurso (lo deja en running)
const {validarRecurso } = require('./helpers');

function restart(entorno, args, linea, columna) {
    const recurso = args[0];
    validarRecurso(recurso, 'restart', 1, linea, columna);

    recurso.status= 'running';
    entorno.registrarBitacora(`[OK] ${recurso.nombre} restated`);
    return true;
}
module.exports = restart;