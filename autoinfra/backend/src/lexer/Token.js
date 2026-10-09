
//Representa un token reconocido por el lexer.
class Token{
  constructor(tipo, lexema, linea, columna) {
    this.tipo =tipo;
    this.lexema= lexema;
    this.linea =linea;
    this.columna = columna;
  }

  toString(){
    return `Token(${this.tipo}, "${this.lexema}", L${this.linea}:C${this.columna})`;
  }
}
module.exports = Token;