//identificador backend, x, replicas
class ExpresionIdentificador extends Expresion{

    constructor(nombre, linea, columna){

        super(linea, columna);
        this.nombre=nombre;
    }

    evaluar(entorno){
        return entorno.obtener(this.nombre, this.linea, this.columna);
    }
}