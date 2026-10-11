const Instruccion=require('../Instruccion');

class InstruccionEjecutar extends Instruccion {
    constructor(nombreTarea, linea, columna) {
        super(linea, columna);
        this.nombreTarea = nombreTarea;
    }

    ejecutar(entorno) {
        return entorno.ejecutarTarea(this.nombreTarea, this.linea, this.columna);
    }
}
module.exports = InstruccionEjecutar;