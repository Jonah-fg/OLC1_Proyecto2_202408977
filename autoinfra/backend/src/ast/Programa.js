
//Contenedor del AST completo que se supone que guarda todas las declaraciones globales
class Programa{
    constructor(declaraciones, bloqueMain, linea, columna) {
        this.declaraciones = declaraciones;  
        this.bloqueMain=bloqueMain;         
        this.linea = linea;
        this.columna = columna;
    }
}
module.exports= Programa;