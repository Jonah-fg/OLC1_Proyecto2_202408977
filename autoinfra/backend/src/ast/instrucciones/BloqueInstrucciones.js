//{ instruccion1; instruccion2; ... }
const Instruccion = require('../Instruccion');
const ExecSignal = require('../ExecSignal');

class BloqueInstrucciones extends Instruccion {
    constructor(instrucciones, linea, columna){
        super(linea, columna);
        this.instrucciones=instrucciones || [];
    }

    ejecutar(entorno){
        const entornoLocal= entorno.crearHijo();
        for (const instr of this.instrucciones){
            const resultado=instr.ejecutar(entornoLocal);
            if(resultado && resultado.senal !== ExecSignal.NORMAL) {
                return resultado;
            }
        }
    return {senal: ExecSignal.NORMAL, valor: null };
    }
}

module.exports=BloqueInstrucciones;