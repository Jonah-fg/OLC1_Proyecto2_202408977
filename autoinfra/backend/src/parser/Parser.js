//Convierte la lista de tokens en un AST.
//Se implementará por subfases: expresiones, instrucciones y declaraciones.
const TokenType = require('../lexer/TokenType');
const { ErrorSintactico } = require('../Utils/Errores');
const {ExpresionLiteral, ExpresionIdentificador, ExpresionBinaria, ExpresionUnaria, ExpresionLlamada, ExpresionAccesoPropiedad, ExpresionIndice, ExpresionArreglo,
}=require('../ast/expresiones');


class Parser{
    constructor(tokens){
        this.tokens= tokens;
        this.posicion=0;
        this.errores = [];
    }
    parsear(){
        return null;
    }

    // Utilidades de navegación
    tokenActual(){
        return this.tokens[this.posicion];
    }

    //Devuelve el token en la posición actual + desplazamiento
    mirar(desplazamiento =0){
        const indice = this.posicion + desplazamiento;
        if (indice >=this.tokens.length) {
            return this.tokens[this.tokens.length -1]; 
        }
        return this.tokens[indice];
    }

    avanzar(){
        if(this.posicion<this.tokens.length - 1) {
            this.posicion++;
        }
        return this.tokens[this.posicion - 1];
    }

    verificar(tipo){
        return this.tokenActual().tipo=== tipo;
    }

    //Si coincide, avanza y devuelve true
    coincidir(tipo){
        if(this.verificar(tipo)){
            this.avanzar();
            return true;
        }
        return false;
    }

    consumir(tipo, mensajeError){
        if (this.verificar(tipo)) {
            return this.avanzar();
        }
        const token=this.tokenActual();
        throw new ErrorSintactico(
            mensajeError || `Se esperaba '${tipo}' pero se encontr '${token.lexema}'`,
            token.linea,
            token.columna
        );
    }

    finAlcanzado(){
        return this.tokenActual().tipo === TokenType.EOF;
    }

    // Manejo de errores
    reportarError(mensaje, linea, columna){
        this.errores.push(new ErrorSintactico(mensaje, linea, columna));
    }

    //Avanza hasta un punto de sincronización para recuperarse de errores.
    sincronizar(){
        while (!this.finAlcanzado()){
            const anterior =this.tokens[this.posicion - 1];
            if (anterior && anterior.tipo=== TokenType.SEMICOLON) {
                return;
            }

            const tipo=this.tokenActual().tipo;
            if(tipo === TokenType.RBRACE || tipo === TokenType.SERVER || tipo === TokenType.SERVICE || tipo === TokenType.DATABASE || tipo === TokenType.FUNCTION ||
                tipo === TokenType.TASK || tipo === TokenType.MAIN){
                return;
            }
            this.avanzar();
        }
    }
    obtenerErrores(){
        return this.errores;
    }

    //EXPRESIONES implemetnadas por niveles de precedencia (menor a mayor)
    //Nivel 1: punto de entrada de cualquier expresión
    expresion(){
        return this.expresionLogicaOr();
    }

    // Nivel 2: ||
    expresionLogicaOr(){
        let izquierda=this.expresionLogicaAnd();

        while(this.verificar(TokenType.OR)){
            const operador =this.avanzar();
            const derecha=this.expresionLogicaAnd();
            izquierda= new ExpresionBinaria(izquierda, operador.tipo, derecha, operador.linea, operador.columna);
        }
        return izquierda;
    }

    // Nivel 3: &&
    expresionLogicaAnd(){
        let izquierda= this.expresionIgualdad();

        while (this.verificar(TokenType.AND)){
            const operador=this.avanzar();
            const derecha = this.expresionIgualdad();
            izquierda=new ExpresionBinaria(izquierda, operador.tipo, derecha, operador.linea, operador.columna
            );
        }
        return izquierda;
    }

    // Nivel 4: ==  !=
    expresionIgualdad(){
        let izquierda=this.expresionComparacion();

        while(this.verificar(TokenType.EQUAL_EQUAL) || this.verificar(TokenType.NOT_EQUAL)){
            const operador=this.avanzar();
            const derecha = this.expresionComparacion();
            izquierda=new ExpresionBinaria(izquierda, operador.tipo, derecha, operador.linea, operador.columna);
        }
        return izquierda;
    }

    // Nivel 5: < <=  > >=
    expresionComparacion(){
        let izquierda =this.expresionSuma();

        while (this.verificar(TokenType.LESS) ||this.verificar(TokenType.LESS_EQUAL) || this.verificar(TokenType.GREATER) || this.verificar(TokenType.GREATER_EQUAL)) {
            const operador= this.avanzar();
            const derecha = this.expresionSuma();
            izquierda=new ExpresionBinaria(izquierda, operador.tipo, derecha, operador.linea, operador.columna);
        }
        return izquierda;
    }

    //nivel 6: +  -
    expresionSuma(){
        let izquierda= this.expresionMultiplicacion();

        while(this.verificar(TokenType.PLUS) || this.verificar(TokenType.MINUS)){
            const operador=this.avanzar();
            const derecha= this.expresionMultiplicacion();
            izquierda = new ExpresionBinaria(izquierda, operador.tipo, derecha, operador.linea, operador.columna
            );
        }
        return izquierda;
    }

    //nivel 7: *  /  %
    expresionMultiplicacion(){
        let izquierda=this.expresionUnaria();

        while (this.verificar(TokenType.STAR) || this.verificar(TokenType.SLASH) || this.verificar(TokenType.PERCENT)) {
            const operador = this.avanzar();
            const derecha = this.expresionUnaria();
            izquierda = new ExpresionBinaria(izquierda, operador.tipo, derecha, operador.linea, operador.columna );
        }
        return izquierda;
    }

    //nivel 8: !expr  -expr
    expresionUnaria(){
        if (this.verificar(TokenType.NOT) || this.verificar(TokenType.MINUS)){
            const operador= this.avanzar();
            const operando= this.expresionUnaria();
            return new ExpresionUnaria(operador.tipo, operando, operador.linea, operador.columna
            );
        }
        return this.expresionPostfija();
    }

    //nivel 9: accesos, llamadas e índices aplicados a una primaria
    expresionPostfija(){
        let expresion=this.expresionPrimaria();

        while(true){
            //Llamada a función
            if(this.verificar(TokenType.LPAREN)){
                const parentesisIzq = this.avanzar();
                const args=this.listaArgumentos();
                this.consumir(TokenType.RPAREN,"Se espeaba ')' al final de la lista de argumentos");

                if(expresion instanceof ExpresionIdentificador){
                    expresion= new ExpresionLlamada(expresion.nombre, args, parentesisIzq.linea, parentesisIzq.columna);
                } 
                else{
                    throw new ErrorSintactico('Solo se puede llamar a funciones por nombre', parentesisIzq.linea, parentesisIzq.columna
                    );
                }
                continue;
            }
            if(this.verificar(TokenType.DOT)){
                const punto =this.avanzar();
                const nombrePropiedad= this.consumir(TokenType.IDENTIFIER, "Se esperaba el nombre de una propiedad después de '.'");
                expresion= new ExpresionAccesoPropiedad(expresion, nombrePropiedad.lexema, punto.linea, punto.columna);
                continue;
            }

            //Índice: arreglo[expr]
            if(this.verificar(TokenType.LBRACKET)){
                const corcheteIzq= this.avanzar();
                const indice=this.expresion();
                this.consumir(TokenType.RBRACKET, "Se esperaba ']' al final del índice");
                expresion=new ExpresionIndice(expresion, indice, corcheteIzq.linea, corcheteIzq.columna);
                continue;
            }
            break;
        }
        return expresion;
    }

    //nivel 10: literales, identificadores, agrupación y arreglos
    expresionPrimaria(){
        const token =this.tokenActual();

        //literales numéricos
        if(this.verificar(TokenType.INT_LITERAL)){
            this.avanzar();
            return new ExpresionLiteral(parseInt(token.lexema, 10), 'int', token.linea, token.columna);
        }
        if(this.verificar(TokenType.FLOAT_LITERAL)) {
            this.avanzar();
            return new ExpresionLiteral(parseFloat(token.lexema),'float', token.linea, token.columna);
        }

        //ñiteral cadena
        if (this.verificar(TokenType.STRING_LITERAL)){
            this.avanzar();
            return new ExpresionLiteral(token.lexema, 'string', token.linea, token.columna
            );
        }

        //literales booleanos
        if (this.verificar(TokenType.TRUE)){
            this.avanzar();
            return new ExpresionLiteral(true, 'bool', token.linea, token.columna);
        }

        if(this.verificar(TokenType.FALSE)){
            this.avanzar();
            return new ExpresionLiteral(false, 'bool', token.linea, token.columna);
        }

        //identificador
        if (this.verificar(TokenType.IDENTIFIER)){
            this.avanzar();
            return new ExpresionIdentificador(token.lexema, token.linea, token.columna);
        }

        //agrupación entre paréntesis: (expr)
        if(this.verificar(TokenType.LPAREN)) {
            this.avanzar();
            const expr= this.expresion();
            this.consumir(TokenType.RPAREN, "Se esperaba ')' al final de la expresión agrupada");
            return expr;
        }

        //arreglo literal: [elem1, elem2, ...]
        if (this.verificar(TokenType.LBRACKET)){
            const corcheteIzq= this.avanzar();
            const elementos = this.listaArgumentos();
            this.consumir( TokenType.RBRACKET, "Se esperaba ']' al final del arreglo");
            return new ExpresionArreglo(elementos, corcheteIzq.linea, corcheteIzq.columna);
        }

        throw new ErrorSintactico(`Expresión no válida: se encontró '${token.lexema}'`, token.linea, token.columna
        );
    }

    listaArgumentos(){
        const args=[];

        if(this.verificar(TokenType.RPAREN) || this.verificar(TokenType.RBRACKET)) {
            return args;
        }
        args.push(this.expresion());
        while(this.coincidir(TokenType.COMMA)){
            args.push(this.expresion());
        }
        return args;
    }
}
module.exports= Parser;