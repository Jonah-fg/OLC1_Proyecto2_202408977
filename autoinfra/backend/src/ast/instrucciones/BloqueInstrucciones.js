//{ instruccion1; instruccion2; ... }
const Instruccion= require('../Instruccion');
const ExecSignal =require('../ExecSignal');

class BloqueInstrucciones extends Instruccion {
    constructor(instrucciones, linea, columna){
        super(linea, columna);
        this.instrucciones=instrucciones || [];
    }

    ejecutar(entorno){
        const entornoLocal = entorno.crearHijo();
        for(const instruccion of this.instrucciones){
            entorno.incrementarInstrucciones(instruccion.linea, instruccion.columna);
            //Ejecucion con try/catch indvidual para no aborar todo el bloque
            try{
                const resultado= instruccion.ejecutar(entornoLocal);
                if (resultado && resultado.senal !== ExecSignal.NORMAL){
                    return resultado;
                }
            } 
            catch (e){
                entorno.registrarError(e);
            }
        }
        return {senal: ExecSignal.NORMAL, valor: null };
    }
}
module.exports=BloqueInstrucciones;