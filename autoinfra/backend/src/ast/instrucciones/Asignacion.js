const Instruccion = require('../Instruccion');
const ExecSignal=require('../ExecSignal');

class Asignacion extends Instruccion{
    constructor(nombre, valor, linea, columna){
        super(linea, columna);
        this.nombre= nombre;
        this.valor = valor;
    }

    ejecutar(entorno) {
        const valorEvaluado = this.valor.evaluar(entorno);
        entorno.asignar(this.nombre, valorEvaluado, this.linea, this.columna);
        return{senal: ExecSignal.NORMAL, valor: null };
    }
}
module.exports=Asignacion;