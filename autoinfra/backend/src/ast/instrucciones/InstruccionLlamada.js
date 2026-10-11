const Instruccion= require('../Instruccion');
const ExecSignal =require('../ExecSignal');

class InstruccionLlamada extends Instruccion{
    constructor(expresionLlamada, linea, columna){
        super(linea, columna);
        this.expresionLlamada= expresionLlamada;
    }

    ejecutar(entorno){
        this.expresionLlamada.evaluar(entorno);
        return { senal: ExecSignal.NORMAL, valor: null };
    }
}

module.exports= InstruccionLlamada;