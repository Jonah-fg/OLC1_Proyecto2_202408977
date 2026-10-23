
//Recorre el AST y ejecuta el programa completo
const Entorno= require('../entorno/Entorno');
const { generarTablaSimbolos} = require('../reportes/GeneradorSimbolos');

class Interpreter{
    constructor(programa){
        this.programa = programa;
        this.entorno =null;
    }

    ejecutar(){
        //creacion entorno global
        this.entorno= new Entorno();
        //registro todas las declaraciones globales
        for(const declaracion of this.programa.declaraciones) {
            try {
                declaracion.ejecutar(this.entorno);
            } 
            catch (e){
                this.entorno.registrarError(e);
            }
        }

        //bloque main
        if (this.programa.bloqueMain){
            try{
                this.programa.bloqueMain.ejecutar(this.entorno);
            } 
            catch (e){
                this.entorno.registrarError(e);
            }
        }
        return{consola: this.entorno.obtenerConsola(), bitacora: this.entorno.obtenerBitacora(), errores: this.entorno.obtenerErrores(), infraestructura: this.construirEstadoInfraestructura(),};
    }

    construirEstadoInfraestructura(){
        const servidores = [];
        const servicios= [];
        const databases =[];

        const recursos=this.entorno.obtenerRecursosGlobales();
        for (const [nombre, recurso] of recursos.entries()) {
            const resumen= recurso.resumen();

            switch (recurso.tipo){
                case 'server':
                    servidores.push(resumen);
                    break;
                case 'service':
                    servicios.push(resumen);
                    break;
                case 'database':
                    databases.push(resumen);
                    break;
            }
        }
        return {servidores, servicios, databases };
    }

    ejecutarConReporte(tokens=[], erroresLexicos =[], erroresSintacticos= []){
        const resultado=this.ejecutar();

        const ResultadoEjecucion = require('../reportes/ResultadoEjecucion');
        const reporte= new ResultadoEjecucion();

        reporte.tokens=tokens.map((t)=> ({
            tipo: t.tipo,
            lexema: t.lexema,
            linea: t.linea,
            columna: t.columna,
        }));
        reporte.agregarErrores(erroresLexicos);
        reporte.agregarErrores(erroresSintacticos);
        reporte.agregarErrores(resultado.errores);

        reporte.consola= resultado.consola;
        reporte.bitacora=resultado.bitacora;
        reporte.infraestructura = resultado.infraestructura;

        reporte.simbolos=generarTablaSimbolos(this.entorno);
  
        const {serializarAST, generarDot }=require('../reportes/GeneradorAST');
        reporte.ast = serializarAST(this.programa);
        reporte.astDot= generarDot(this.programa);

        reporte.calcularExito();
        return reporte;
    }
}
module.exports= Interpreter;