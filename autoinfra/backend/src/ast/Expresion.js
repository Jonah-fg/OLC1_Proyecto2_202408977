class Expresion{
    constructor(linea, columna){
      this.linea =linea;
      this.columna=columna;
    }

    evaluar(entorno){
      throw new Error('evaluar() no implementado en Expresion');
    }
}
module.exports = Expresion;