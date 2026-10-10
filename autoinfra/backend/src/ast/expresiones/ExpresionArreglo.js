//representa un arreglo literal: ["docker", "git", "nginx"]
const Expresion=require('../Expresion');

class ExpresionArreglo extends Expresion {
    constructor(elementos, linea, columna) {
        super(linea, columna);
        this.elementos = elementos;//array Expresion
    }

    evaluar(entorno){
        return this.elementos.map(e => e.evaluar(entorno));
    }
}
module.exports= ExpresionArreglo;