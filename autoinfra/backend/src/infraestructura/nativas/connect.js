
//registra una conexión lógica entre dos recursos
const { validarRecurso}=require('./helpers');

function connect(entorno, args, linea, columna) {
    const origen= args[0];
    const destino=args[1];
    validarRecurso(origen, 'connect', 1, linea, columna);
    validarRecurso(destino, 'connect', 2, linea, columna);

    if(origen.conexiones.includes(destino.nombre)){
        entorno.registrarBitacora(`[WARN] ${origen.nombre} ya está conecado a ${destino.nombre}`);
        return false;
    }
    origen.agregarConexion(destino);
    entorno.registrarBitacora(`[OK] ${origen.nombre} conneted to ${destino.nombre}`);
    return true;
}
module.exports = connect;