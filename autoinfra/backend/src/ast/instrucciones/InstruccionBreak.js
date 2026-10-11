const Instruccion = require('../Instruccion');
const ExecSignal =require('../ExecSignal');

class InstruccionBreak extends Instruccion {
    constructor(linea, columna){
        super(linea, columna);
    }

    ejecutar(entorno){
        return {senal: ExecSignal.BREAK, valor: null };
    }
}

module.exports = InstruccionBreak;