//Contenedor del AST complto que se supone que guarda todas las decaraciones globales
class Programa{
    constructor(declaraciones, bloqueMain, linea, columna) {
        this.declaraciones = declaraciones;  
        this.bloqueMain=bloqueMain;         
        this.linea = linea;
        this.columna = columna;
    }
}
module.exports= Programa;