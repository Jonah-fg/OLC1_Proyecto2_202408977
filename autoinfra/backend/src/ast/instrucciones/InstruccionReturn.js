const Instruccion = require('../Instruccion');
const ExecSignal=require('../ExecSignal');

class InstruccionReturn extends Instruccion {
    constructor(valor, linea, columna){
        super(linea, columna);
        this.valor = valor;
    }

    ejecutar(entorno){
        const valorEvaluado= this.valor ? this.valor.evaluar(entorno) : null;
        return {senal: ExecSignal.RETURN, valor: valorEvaluado};
    }
}
module.exports = InstruccionReturn;