const { ErrorEjecucion } = require('../../Utils/Errores');
function length(entorno, args, linea, columna) {
    const arreglo=args[0];

    if(!Array.isArray(arreglo)){
        throw new ErrorEjecucion('length: el argumento debe ser un arreglo', linea, columna);
    }
    return arreglo.length;
}
module.exports=length;