const Instruccion = require('../Instruccion');
const ExecSignal=require('../ExecSignal');

class DeclaracionVariable extends Instruccion{
    constructor(tipo, nombre, valor, linea, columna) {
        super(linea, columna);
        this.tipo=tipo; //'int', 'float', 'string', 
        this.nombre =nombre;
        this.valor = valor;  
    }

    ejecutar(entorno){
        const valorEvaluado = this.valor ? this.valor.evaluar(entorno) : this.valorPorDefecto();
        entorno.declarar(this.nombre, valorEvaluado, this.tipo, this.linea, this.columna);
        return {senal: ExecSignal.NORMAL, valor: null };
    }

    valorPorDefecto() {
        switch (this.tipo){
        case 'int':    
            return 0;

        case 'float': 
            return 0.0;

        case 'string': 
            return '';

        case 'bool':  
            return false;

        default:      
            return null;
        }
    }
}
module.exports= DeclaracionVariable;