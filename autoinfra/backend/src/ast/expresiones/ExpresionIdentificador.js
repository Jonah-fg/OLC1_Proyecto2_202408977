
//epresentacio del uso de una variable o recurso: backend, x, replicas
const Expresion = require('../Expresion');

class ExpresionIdentificador extends Expresion{
    constructor(nombre, linea, columna) {
        super(linea, columna);
        this.nombre = nombre;
    }

    evaluar(entorno){
        return entorno.obtener(this.nombre, this.linea, this.columna);
    }
}
module.exports= ExpresionIdentificador;