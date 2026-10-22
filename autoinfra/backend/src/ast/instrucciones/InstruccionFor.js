//Representacion for (init; cond; update) y todo esoooo
const Instruccion = require('../Instruccion');
const ExecSignal=require('../ExecSignal');

class InstruccionFor extends Instruccion {
    constructor(inicializacion, condicion, update, body, linea, columna){
        super(linea, columna);
        this.inicializacion= inicializacion;
        this.condicion = condicion;//expresion o null
        this.update=update//instruccion o null
        this.body =body;
    }

    ejecutar(entorno){
        const entornoFor= entorno.crearHijo();
        if (this.inicializacion)
            this.inicializacion.ejecutar(entornoFor);

        let iteraciones=0;
        while (this.condicion ? this.condicion.evaluar(entornoFor)=== true : true){
            const resultado = this.body.ejecutar(entornoFor);
            if (resultado.senal=== ExecSignal.BREAK) {
                break;
            }
            if (resultado.senal=== ExecSignal.RETURN) {
                return resultado;
            }
            if(this.update)
                this.update.ejecutar(entornoFor);

            iteraciones++;
            if (iteraciones> 100000) {
                throw new Error(`Límite de iteraciones excedido en for (L${this.linea}:C${this.columna})`);
            }
        }
        return{senal: ExecSignal.NORMAL, valor: null };
    }
}
module.exports = InstruccionFor;