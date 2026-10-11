const Instruccion=require('../Instruccion');

class InstruccionRun extends Instruccion {
    constructor(nombreTarea, linea, columna) {
        super(linea, columna);
        this.nombreTarea = nombreTarea;
    }

    ejecutar(entorno){
        return entorno.ejecutarTarea(this.nombreTarea, this.linea, this.columna);
    }
}
module.exports = InstruccionRun;