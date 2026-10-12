
//una llamada a función nativa o de usuario: start(backend)
const Expresion = require('../Expresion');

class ExpresionLlamada extends Expresion {
    constructor(nombre, args, linea, columna) {
        super(linea, columna);
        this.nombre = nombre;
        this.args=args;//array expresion
    }

    evaluar(entorno){
        const valoresArgs =this.args.map(a => a.evaluar(entorno));
        return entorno.llamarFuncion(this.nombre, valoresArgs, this.linea, this.columna);
    }
}
module.exports = ExpresionLlamada;