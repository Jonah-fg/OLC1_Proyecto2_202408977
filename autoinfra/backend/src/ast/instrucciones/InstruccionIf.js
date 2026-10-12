const Instruccion = require('../Instruccion');
const ExecSignal= require('../ExecSignal');

class InstruccionIf extends Instruccion{
    constructor(condicion, bloqueThen, bloqueElse, linea, columna) {
        super(linea, columna);
        this.condicion = condicion;
        this.bloqueThen =bloqueThen;
        this.bloqueElse=bloqueElse; 
    } 

    ejecutar(entorno) {
        const cond=this.condicion.evaluar(entorno);
        if(cond=== true){
            return this.bloqueEntonces.ejecutar(entorno);
        } 
        else if(this.bloqueSino){
            return this.bloqueSino.ejecutar(entorno);
        }
        return { senal: ExecSignal.NORMAL, valor: null };
    }
}
module.exports = InstruccionIf;