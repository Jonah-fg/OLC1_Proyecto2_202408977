const Expresion = require('../Expresion');
const TokenType= require('../../lexer/TokenType');

class ExpresionBinaria extends Expresion{
    constructor(izquierda, operador, derecha, linea, columna) {
        super(linea, columna);
        this.izquierda= izquierda;
        this.operador =operador;// tipo token
        this.derecha = derecha;
    }
 
    evaluar(entorno){
        if (this.operador=== TokenType.AND){
            const izq =this.izquierda.evaluar(entorno);
            if (izq === false){
                return false;
            }
            return this.derecha.evaluar(entorno);
        }

        if(this.operador === TokenType.OR){
            const izq= this.izquierda.evaluar(entorno);
            if (izq === true){
                return true;
            }
            return this.derecha.evaluar(entorno);
        }

        const izq= this.izquierda.evaluar(entorno);
        const der = this.derecha.evaluar(entorno);
        switch(this.operador){
        case TokenType.PLUS:
            return izq + der;
            
        case TokenType.MINUS:
            return izq - der;
            
        case TokenType.STAR:
            return izq * der;

        case TokenType.SLASH:
            if (der=== 0){
            throw new Error(`División por cero en L${this.linea}:C${this.columna}`);
            }
            return izq / der;
            
        case TokenType.PERCENT:
            return izq%der;
            
        case TokenType.EQUAL_EQUAL:
            return izq === der;

        case TokenType.NOT_EQUAL:
            return izq!== der;

        case TokenType.LESS:
            return izq < der;
            
        case TokenType.LESS_EQUAL:
            return izq<=der;

        case TokenType.GREATER:
            return izq> der;

        case TokenType.GREATER_EQUAL:
            return izq >= der;
        default:
            throw new Error(`Operador binario desconocido: ${this.operador}`);
        }
    }
}
module.exports= ExpresionBinaria;