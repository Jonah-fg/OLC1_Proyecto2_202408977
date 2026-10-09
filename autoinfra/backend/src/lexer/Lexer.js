const TokenType =require('./TokenType');
const Token=require('./Token');
const { ErrorLexico } =require('../Utils/Errores');


//Palabras reservadas mapeo texto → tipo de token
const KEYWORDS ={
  int:   TokenType.INT,
  float: TokenType.FLOAT,
  string: TokenType.STRING,
  bool:   TokenType.BOOL,
  server:  TokenType.SERVER,
  service: TokenType.SERVICE,
  database: TokenType.DATABASE,
  if:     TokenType.IF,
  else:   TokenType.ELSE,
  while:  TokenType.WHILE,
  for:   TokenType.FOR,
  break:  TokenType.BREAK,
  continue: TokenType.CONTINUE,
  return:   TokenType.RETURN,
  function: TokenType.FUNCTION,
  task:   TokenType.TASK,
  main:  TokenType.MAIN,
  run:   TokenType.RUN,
  true:  TokenType.TRUE,
  false:  TokenType.FALSE,
};

class Lexer{
  constructor(codigoFuente) {
    this.codigoFuente =codigoFuente;
    this.posicion =0;       
    this.linea=1;    
    this.columna = 1;    
    this.tokens=[]; //lista de tokens producidos
    this.errores =[]; //lista de errores léxicos
  }

  //caracter actual, o null si llegamos al final
  mirar(desplazamiento =0){
    const i=this.posicion+ desplazamiento;
    return i<this.codigoFuente.length ? this.codigoFuente[i]: null;
  }

  //Avanza un caracter y actualizacion linea/columna
  avanzar(){
    const caracter=this.codigoFuente[this.posicion];
    this.posicion++;
    if(caracter ==='\n'){
      this.linea++;
      this.columna= 1;
    } 
    else{
      this.columna++;
    }
    return caracter;
  }

  finAlcanzado(){
    return this.posicion>= this.codigoFuente.length;
  }


  //Metodo principal
  tokenizar(){
    while (!this.finAlcanzado()) {
      this.omitirEspacios();
      if (this.finAlcanzado()){
        break;
      }

      const lineaInicio =this.linea;
      const columnaInicio=this.columna;
      const caracter= this.mirar();

      //comentarios
      if (caracter==='/' && this.mirar(1)==='/') {
        this.omitirComentarioLinea();
        continue;
      }
      if (caracter=== '/' && this.mirar(1)=== '*') {
        this.omitirComentarioMultiple(lineaInicio, columnaInicio);
        continue;
      }

      //identificadores y palabras reservadas
      if(this.esLetra(caracter)){
        this.leerIdentificadorOPalabraReservada();
        continue;
      }

      //Numeros
      if(this.esDigito(caracter)){
        this.leerNumero();
        continue;
      }

      //cadenas
      if (caracter=== '"') {
        this.leerCadena(lineaInicio, columnaInicio);
        continue;
      }

      //Operadores y delimitadores
      if(this.leerOperadorODelimitador(lineaInicio, columnaInicio)) {
        continue;
      }
      this.errores.push(new ErrorLexico(`Carcter no reconocido: '${caracter}'`,lineaInicio, columnaInicio));
      this.avanzar();
    }

    // Token EOF al final
    this.tokens.push(new Token(TokenType.EOF, '', this.linea, this.columna));
    return { tokens: this.tokens, errores: this.errores };
  }

  //Espacios en blanco
  omitirEspacios(){
    while(!this.finAlcanzado()){
      const caracter=this.mirar();
      if (caracter ===' ' || caracter ==='\t' || caracter=== '\r' || caracter=== '\n'){
        this.avanzar();
      } 
      else{
        break;
      }
    }
  }

  //omentarios
  omitirComentarioLinea(){
    this.avanzar(); // '/'
    this.avanzar(); // '/'
    while (!this.finAlcanzado() && this.mirar()!=='\n') {
      this.avanzar();
    }
  }

  omitirComentarioMultiple(lineaInicio, columnaInicio){
    this.avanzar();// '/'
    this.avanzar(); // '*'
    while (!this.finAlcanzado()){
      if (this.mirar() ==='*'&& this.mirar(1) === '/') {
        this.avanzar();
        this.avanzar(); 
        return;
      }
      this.avanzar();
    }
    this.errores.push(new ErrorLexico('Comentario multilínea sin cierre', lineaInicio, columnaInicio));
  }


  //identificadores y palabras reservadas
  esLetra(caracter){
    return caracter!== null && /[A-Za-z_]/.test(caracter);
  }

  esLetraONumero(caracter){
    return caracter !== null && /[A-Za-z0-9_]/.test(caracter);
  }

  leerIdentificadorOPalabraReservada(){
    const lineaInicio = this.linea;
    const columnaInicio=this.columna;
    let lexema ='';
    while(!this.finAlcanzado() && this.esLetraONumero(this.mirar())){
      lexema+= this.avanzar();
    }

    const tipo =KEYWORDS[lexema] || TokenType.IDENTIFIER;
    this.tokens.push(new Token(tipo, lexema, lineaInicio, columnaInicio));
  }

  //Numers (int y float)
  esDigito(caracter){
    return caracter !==null && /[0-9]/.test(caracter);
  }

  leerNumero(){
    const lineaInicio = this.linea;
    const columnaInicio=this.columna;
    let lexema='';

    //parte entera
    while (!this.finAlcanzado() && this.esDigito(this.mirar())){
      lexema +=this.avanzar();
    }

    let esFlotante= false;
    if (this.mirar()=== '.' && this.esDigito(this.mirar(1))){
      esFlotante =true;
      lexema+= this.avanzar(); // '.'
      while(!this.finAlcanzado() && this.esDigito(this.mirar())) {
        lexema += this.avanzar();
      }
    }
    this.tokens.push(new Token(esFlotante ? TokenType.FLOAT_LITERAL : TokenType.INT_LITERAL, lexema, lineaInicio, columnaInicio));
  }

  // Cadenas
  leerCadena(lineaInicio, columnaInicio){
    this.avanzar(); //comilla inicial
    let valor ='';

    while(!this.finAlcanzado() && this.mirar() !== '"') {
      const caracter =this.mirar();

      if (caracter ==='\n'){
        this.errores.push(new ErrorLexico('Cadena sin cierre', lineaInicio, columnaInicio));
        return;
      }

      if(caracter=== '\\'){
        //escape
        this.avanzar();
        const escape =this.avanzar();
        switch (escape){
          case 'n': valor += '\n';
           break;

          case 't': valor += '\t';
           break;

          case '"': valor += '"'; 
           break;

          case '\\': valor += '\\';
           break;
           
          default:
            this.errores.push(new ErrorLexico(`Escape no válido: '\\${escape}'`, this.linea, this.columna-1 ));
            valor += escape;
        }
      } 
      else{
        valor+= this.avanzar();
      }
    }

    if(this.finAlcanzado()){
      this.errores.push(
        new ErrorLexico('Cadena sin ciere', lineaInicio, columnaInicio)
      );
      return;
    }

    this.avanzar();//comilla final
    this.tokens.push(new Token(TokenType.STRING_LITERAL, valor, lineaInicio, columnaInicio));
  }


  leerOperadorODelimitador(line, col){
    const caracter =this.mirar();
    const siguiente= this.mirar(1);

    //operadores de dos caracteres primero
    const dosCaracteres = caracter+(siguiente || '');
    const mapaDosCaracteres={'==': TokenType.EQUAL_EQUAL, '!=': TokenType.NOT_EQUAL, '<=': TokenType.LESS_EQUAL, '>=': TokenType.GREATER_EQUAL,
      '&&': TokenType.AND,
      '||': TokenType.OR,
    };
    if(mapaDosCaracteres[dosCaracteres]){
      this.avanzar();
      this.avanzar();
      this.tokens.push(new Token(mapaDosCaracteres[dosCaracteres], dosCaracteres, line, col));
      return true;
    }

    //Operadores y delimitadores de un caracter
    const mapaUnCaracter={
      '+': TokenType.PLUS,
      '-': TokenType.MINUS,
      '*': TokenType.STAR,
      '/': TokenType.SLASH,
      '%': TokenType.PERCENT,
      '=': TokenType.ASSIGN,
      '<': TokenType.LESS,
      '>': TokenType.GREATER,
      '!': TokenType.NOT,
      '{': TokenType.LBRACE,
      '}': TokenType.RBRACE,
      '(': TokenType.LPAREN,
      ')': TokenType.RPAREN,
      '[': TokenType.LBRACKET,
      ']': TokenType.RBRACKET,
      ';': TokenType.SEMICOLON,
      ',': TokenType.COMMA,
      '.': TokenType.DOT,
    };
    if(mapaUnCaracter[caracter]){
      this.avanzar();
      this.tokens.push(new Token(mapaUnCaracter[caracter], caracter, line, col));
      return true;
    }
    return false;
  }
}
module.exports=Lexer;