const Instruccion =require('../Instruccion');
const ExecSignal= require('../ExecSignal');

class DeclaracionRecurso extends Instruccion {
    constructor(tipoRecurso, nombre, propiedades, linea, columna) {
        super(linea, columna);
        this.tipoRecurso =tipoRecurso; //'server' |'service'| 'database'
        this.nombre =nombre;
        this.propiedades=propiedades;
    }

    ejecutar(entorno){
        const propsEvaluadas= {};
        for (const p of this.propiedades){
        propsEvaluadas[p.nombre] = p.valor.evaluar(entorno);
        }
        entorno.registrarRecurso(this.tipoRecurso, this.nombre, propsEvaluadas, this.linea, this.columna);
        return {senal: ExecSignal.NORMAL, valor: null};
    }
}
module.exports = DeclaracionRecurso;