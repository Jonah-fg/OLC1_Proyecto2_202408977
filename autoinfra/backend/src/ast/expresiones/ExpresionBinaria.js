class ExpresionBinaria extends Expresion{
    constructor(izquierda, operador, derecha, linea, columna) {
        super(linea, columna);
        this.izquierda= izquierda;
        this.operador =operador;// tipo token
        this.derecha = derecha;
    }
 
    evaluar(entorno){
        const TipoToken= require('../lexer/TokenType');

        if (this.operador=== TipoToken.AND){
            const izq =this.izquierda.evaluar(entorno);
            if (izq === false){
                return false;
            }
            return this.derecha.evaluar(entorno);
        }

        if(this.operador === TipoToken.OR){
            const izq= this.izquierda.evaluar(entorno);
            if (izq === true){
                return true;
            }
            return this.derecha.evaluar(entorno);
        }

        const izq= this.izquierda.evaluar(entorno);
        const der = this.derecha.evaluar(entorno);
        switch(this.operador){
        case TipoToken.PLUS:
            return izq + der;
            
        case TipoToken.MINUS:
            return izq - der;
            
        case TipoToken.STAR:
            return izq * der;

        case TipoToken.SLASH:
            if (der=== 0){
            throw new Error(`División por cero en L${this.linea}:C${this.columna}`);
            }
            return izq / der;
            
        case TipoToken.PERCENT:
            return izq%der;
            
        case TipoToken.EQUAL_EQUAL:
            return izq === der;

        case TipoToken.NOT_EQUAL:
            return izq!== der;

        case TipoToken.LESS:
            return izq < der;
            
        case TipoToken.LESS_EQUAL:
            return izq<=der;

        case TipoToken.GREATER:
            return izq> der;

        case TipoToken.GREATER_EQUAL:
            return izq >= der;
        default:
            throw new Error(`Operador binario desconocido: ${this.operador}`);
        }
    }
}