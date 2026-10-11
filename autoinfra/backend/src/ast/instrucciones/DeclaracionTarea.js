const Instruccion = require('../Instruccion');
const ExecSignal = require('../ExecSignal');

class DeclaracionTarea extends Instruccion{
    constructor(nombre, cuerpo, linea, columna){
        super(linea, columna);
        this.nombre = nombre;
        this.body=body;
    }

    ejecutar(entorno){
        entorno.declararTarea(this.nombre, this);
        return{senal: ExecSignal.NORMAL, valor: null };
    }
}
module.exports = DeclaracionTarea;