const Expresion = require('../Expresion');
class ExpresionIndice extends Expresion {

    constructor(arreglo, indice, linea, columna) {
        super(linea, columna);
        this.arreglo= arreglo;
        this.indice =indice;
    }

    evaluar(entorno){
        const arr= this.arreglo.evaluar(entorno);
        const idx= this.indice.evaluar(entorno);

        if (!Array.isArray(arr)){
            throw new Error(`No es un arreglo (L${this.linea}:C${this.columna})`);
        }

        if(idx < 0 || idx >= arr.length){
            throw new Error(`Índice fuera de rango: ${idx} (L${this.linea}:C${this.columna})`);
        }
        return arr[idx];
    }

}
module.exports=ExpresionIndice;