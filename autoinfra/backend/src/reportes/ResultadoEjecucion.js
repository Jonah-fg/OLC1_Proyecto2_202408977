class ResultadoEjecucion{
    constructor(){
        this.exito=false;
        this.tokens= []; 
        this.errores= []; //errores léxicos + sintácticos + ejecución + infraestructura
        this.simbolos =[]; //tabla de símbolos
        this.ast = null;         
        this.astDot= '';  //representación en formato Graphviz DOT
        this.consola = [];       
        this.bitacora=[]; //bitácora de acciones
        this.infraestructura ={  
            servidores: [],
            servicios: [],
            databases:[],
        };
    }

    agregarErrores(listaErrores){
        for (const error of listaErrores){
            this.errores.push({tipo: error.tipo, codigo: error.codigo, descripcion: error.descripcion, linea: error.linea, columna: error.columna,
            });
        }
    }


    calcularExito() {
        this.exito= this.errores.length=== 0;
    }

    //Devuelve un objeto JSON listo
    toJSON(){
        return{exito: this.exito, tokens: this.tokens, errores: this.errores, simbolos: this.simbolos, ast: this.ast, astDot: this.astDot, consola: this.consola, bitacora: this.bitacora, infraestructura: this.infraestructura,
        };
    }
}
module.exports = ResultadoEjecucion;