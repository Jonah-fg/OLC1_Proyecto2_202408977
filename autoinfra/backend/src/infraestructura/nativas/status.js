
//devuelve el estado actual de un recurso
const {validarRecurso} = require('./helpers');

function status(entorno, args, linea, columna) {
    const recurso= args[0];
    validarRecurso(recurso, 'status', 1, linea, columna);
    return recurso.status;
}
module.exports = status;