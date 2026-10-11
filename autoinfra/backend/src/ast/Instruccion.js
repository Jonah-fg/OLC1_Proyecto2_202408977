//clase base abstracta para todas las instrucciones del AST
class Instruccion{
    constructor(linea, columna) {
        this.linea =linea;
        this.columna= columna;
    }

    ejecutar(entorno) {
        throw new Error('ejecutar() no implementado en Instruccion');
    }
}
module.exports=Instruccion;