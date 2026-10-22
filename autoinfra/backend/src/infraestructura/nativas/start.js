//Cambia el estado del recurso de stopped a running.
const {validarRecurso }=require('./helpers');

function start(entorno, args, linea, columna) {
    const recurso =args[0];
    validarRecurso(recurso, 'start', 1, linea, columna);

    if(recurso.estaActivo()){
        entorno.registrarBitacora(`[WARN] ${recurso.nombre} ya está running`);
        return false;
    }

    recurso.status ='running';
    entorno.registrarBitacora(`[OK] ${recurso.nombre} started`);
    return true;
}
module.exports=start;