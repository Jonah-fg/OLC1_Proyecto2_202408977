const Instruccion= require('../Instruccion');
const ExecSignal = require('../ExecSignal');

class InstruccionWhile extends Instruccion{

    constructor(condicion, body, linea, columna){
        super(linea, columna);
        this.condicion =condicion;
        this.body= body;
    }

    ejecutar(entorno){
        let iteraciones= 0;
        while(this.condicion.evaluar(entorno)=== true){
        const resultado = this.body.ejecutar(entorno);
        if (resultado.senal=== ExecSignal.BREAK) 
            break;

        if (resultado.senal === ExecSignal.RETURN) {
            return resultado;
        }

        iteraciones++;
        if (iteraciones>100000){
            throw new Error(`Límite de iteraciones excedido en while (L${this.linea}:C${this.columna})`);
        }
        }
        return { senal: ExecSignal.NORMAL, valor: null };
    }
}
module.exports = InstruccionWhile;