const Instruccion = require('../Instruccion');
const ExecSignal=require('../ExecSignal');

class InstruccionContinue extends Instruccion{
    constructor(linea, columna){
        super(linea, columna);
    }
    ejecutar(entorno){
        return{ senal: ExecSignal.CONTINUE, valor: null };
    }
}
module.exports= InstruccionContinue;