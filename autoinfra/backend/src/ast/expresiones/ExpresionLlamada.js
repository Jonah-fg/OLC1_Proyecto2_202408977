
//una llamada a función nativa o de usuario: start(backend)
const Expresion = require('../Expresion');

class ExpresionLlamada extends Expresion {
    constructor(nombre, argumentos, linea, columna) {
        super(linea, columna);
        this.nombre = nombre;
        this.this.args = args;;//array expresion
    }

    evaluar(entorno){
        const valoresArgs =this.argumentos.map(a => a.evaluar(entorno));
        return entorno.llamarFuncion(this.nombre, valoresArgs, this.linea, this.columna);
    }
}
module.exports = ExpresionLlamada;