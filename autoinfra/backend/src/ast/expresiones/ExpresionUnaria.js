const Expresion = require('../Expresion');
const TokenType = require('../../lexer/TokenType');

class ExpresionUnaria extends Expresion{
    constructor(operador, operando, linea, columna){
        super(linea, columna);
        this.operador =operador;
        this.operando = operando;
    }

    evaluar(entorno){
        const valor=this.operando.evaluar(entorno);
        if (this.operador === TokenType.NOT){
            return !valor;
        }

        if (this.operador=== TokenType.MINUS){
            return -valor;
        }
        throw new Error(`Operador unario descnocido: ${this.operador}`);
        
    }
}
module.exports = ExpresionUnaria;