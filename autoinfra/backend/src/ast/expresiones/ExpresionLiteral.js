const Expresion = require('../Expresion');

class ExpresionLiteral extends Expresion{
    constructor(valor, tipoValor, linea, columna) {
        super(linea, columna);
        this.valor = valor;
        this.tipoValor = tipoValor;//'int', 'float', 'string',
    }

    evaluar(entorno) {
        return this.valor;
    }
}
module.exports= ExpresionLiteral;