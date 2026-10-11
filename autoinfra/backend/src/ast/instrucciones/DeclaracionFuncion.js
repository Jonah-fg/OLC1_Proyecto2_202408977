
//function nombre(parametros) tipoRetorno{...}
const Instruccion = require('../Instruccion');
const ExecSignal =require('../ExecSignal');
class DeclaracionFuncion extends Instruccion{
    constructor(nombre, params, returnType, body, linea, columna) {
        super(linea, columna);
        this.nombre =nombre;
        this.params = params; 
        this.returnType = returnType;    
        this.body = body;//bloque instruccionmes      
    }

    ejecutar(entorno) {
        entorno.declararFuncion(this.nombre, this);
        return {senal: ExecSignal.NORMAL, valor: null };
    }
}
module.exports= DeclaracionFuncion;