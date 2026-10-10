
//Representacion del acceso a una propiedad: backend.cpu, api.status
const Expresion =require('../Expresion');
class ExpresionAccesoPropiedad extends Expresion {
    constructor(objeto, propiedad, linea, columna) {
        super(linea, columna);
        this.objeto =objeto;  //Expresion
        this.propiedad= propiedad;
    }

    evaluar(entorno){
        const obj =this.objeto.evaluar(entorno);
        if (obj ===null || obj === undefined){
        throw new Error(`No se puede acceder a '${this.propiedad}' de un valor nulo (L${this.linea}:C${this.columna})`);
        }
        return obj[this.propiedad];
    }
}
module.exports= ExpresionAccesoPropiedad;