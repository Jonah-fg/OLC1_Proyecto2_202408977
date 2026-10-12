//Convierte la lista de tokens en un AST.
//Se implementará por subfases: expresiones, instrucciones y declaraciones.
const TokenType = require('../lexer/TokenType');
const { ErrorSintactico } = require('../Utils/Errores');
const {ExpresionLiteral, ExpresionIdentificador, ExpresionBinaria, ExpresionUnaria, ExpresionLlamada, ExpresionAccesoPropiedad, ExpresionIndice, ExpresionArreglo,
}=require('../ast/expresiones');
const {DeclaracionVariable, Asignacion, BloqueInstrucciones, InstruccionIf, InstruccionWhile, InstruccionFor, InstruccionReturn, InstruccionBreak, InstruccionContinue, InstruccionLlamada, InstruccionRun,
}=require('../ast/instrucciones');


class Parser{
    constructor(tokens){this.tokens= tokens; this.posicion=0; this.errores = [];}
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

    //Manejo de errores
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

    //INSTRUCCIONES
    //base principal de instrucciones
    instruccion(){
        //declaración de variable: int x = 10;
        if(this.esTipo()){
            return this.declaracionVariable();
        }

        if (this.verificar(TokenType.IF)){
            return this.sentenciaIf();
        }
        if (this.verificar(TokenType.WHILE)){
            return this.sentenciaWhile();
        }
        if (this.verificar(TokenType.FOR)){
            return this.sentenciaFor();
        }
        if (this.verificar(TokenType.RETURN)) {
            return this.sentenciaReturn();
        }
        if (this.verificar(TokenType.BREAK)){
            return this.sentenciaBreak();
        }
        if (this.verificar(TokenType.CONTINUE)){
            return this.sentenciaContinue();
        }
        if (this.verificar(TokenType.RUN)){
            return this.sentenciaRun();
        }

        //bloque anidado
        if (this.verificar(TokenType.LBRACE)){
            return this.bloqueInstrucciones();
        }

        //asignación o expresión como instrucción
        if (this.verificar(TokenType.IDENTIFIER)){
            return this.asignacionOExpresion();
        }

        const token=this.tokenActual();
        throw new ErrorSintactico(`Instrucción no válida: se encontró '${token.lexema}'`, token.linea, token.columna
        );
    }

    //verifivcaicon si el token es un tipo de dato
    esTipo(){
        return (this.verificar(TokenType.INT) || this.verificar(TokenType.FLOAT) || this.verificar(TokenType.STRING) || this.verificar(TokenType.BOOL) ||  this.verificar(TokenType.SERVER) || this.verificar(TokenType.SERVICE) || this.verificar(TokenType.DATABASE));
    }

    //
    parsearTipo(){
        const tipoToken= this.avanzar();
        let tipo=tipoToken.lexema;
        if (this.verificar(TokenType.LBRACKET)){
            this.avanzar();
            this.consumir(TokenType.RBRACKET, "Se esperaba ']' en el tipo de arreglo");
            tipo =tipo + '[]';
        }
        return{tipo: tipo, linea: tipoToken.linea, columna: tipoToken.columna,};
    }

    //int x= 10; / string[] p;
    declaracionVariable(){
        const infoTipo=this.parsearTipo();
        const nombre = this.consumir(TokenType.IDENTIFIER,'Se esperaba el nombre de la variable');

        let valor= null;
        if(this.coincidir(TokenType.ASSIGN)){
            valor=this.expresion();
        }
        this.consumir(TokenType.SEMICOLON, "Se esperaba ';' despes de la declaración de variable");

        return new DeclaracionVariable(infoTipo.tipo, nombre.lexema, valor, infoTipo.linea, infoTipo.columna);
    }

    //x=5; / start(backend);
    asignacionOExpresion(){
        const expr= this.expresionPostfija();

        //Es una asignación?
        if(this.verificar(TokenType.ASSIGN)){
            const tokenAsignar= this.avanzar();
            const valor =this.expresion();
            this.consumir(TokenType.SEMICOLON, "Se esperaba ';' después de la asignación");

            if(expr instanceof ExpresionIdentificador) {
                return new Asignacion(expr.nombre, valor, tokenAsignar.linea, tokenAsignar.columna);
            }
            throw new ErrorSintactico('Solo se puede asignar a variables simples', tokenAsignar.linea, tokenAsignar.columna);
        }

        this.consumir(TokenType.SEMICOLON, "Se esperaba ';' después de la instrucción");
        return new InstruccionLlamada(expr, expr.linea, expr.columna);
    }

    //{instruccion1; instruccion2;...}
    bloqueInstrucciones(){
        const llaveIzq= this.consumir(TokenType.LBRACE, "Se esperaba '{'");
        const instrucciones=[];

        while (!this.verificar(TokenType.RBRACE) && !this.finAlcanzado()) {
            try{
                instrucciones.push(this.instruccion());
            } 
            catch (e){
                this.reportarError(e.descripcion || e.message, e.linea || llaveIzq.linea, e.columna || llaveIzq.columna );
                this.sincronizar();
            }
        }
        this.consumir(TokenType.RBRACE, "Se esperaba '}' al final del bloque" );
        return new BloqueInstrucciones(instrucciones, llaveIzq.linea, llaveIzq.columna);
    }

    // if(cond){ ... } else { ... }
    sentenciaIf(){
        const tokenIf = this.consumir(TokenType.IF, "Se esperaba 'if'");
        this.consumir(TokenType.LPAREN, "Se esperba '(' después de 'if'");
        const condicion= this.expresion();
        this.consumir(TokenType.RPAREN, "Se esperaba ')' después de la condición");

        const bloqueThen= this.bloqueInstrucciones();

        let bloqueElse =null;
        if(this.coincidir(TokenType.ELSE)){
            //soporta else if
            if(this.verificar(TokenType.IF)){
                bloqueElse = this.sentenciaIf();
            } 
            else{
                bloqueElse= this.bloqueInstrucciones();
            }
        }
        return new InstruccionIf(condicion, bloqueThen, bloqueElse, tokenIf.linea, tokenIf.columna
        );
    }

    //while (cond){ ...}
    sentenciaWhile(){
        const tokenWhile=this.consumir(TokenType.WHILE, "Se esperaba 'while'");
        this.consumir(TokenType.LPAREN, "Se esperaba '(' después de 'while'");
        const condicion= this.expresion();
        this.consumir(TokenType.RPAREN, "Se esperaba ')' después de la condiión");

        const body =this.bloqueInstrucciones();
        return new InstruccionWhile(condicion, body, tokenWhile.linea, tokenWhile.columna);
    }

    //for (init; cond; update){ ... }
    sentenciaFor(){
        const tokenFor= this.consumir(TokenType.FOR, "Se esperaba 'for'");
        this.consumir(TokenType.LPAREN, "Se esperaba '(' después de 'for'");

        //inicialización 
        let init =null;
        if (!this.verificar(TokenType.SEMICOLON)){
            if (this.esTipo()) {
                const infoTipo = this.parsearTipo();
                const nombre=this.consumir(TokenType.IDENTIFIER, 'Se esperaba el nombre de la variable');
                let valor=null;
                if (this.coincidir(TokenType.ASSIGN)){
                    valor= this.expresion();
                }
                init= new DeclaracionVariable(infoTipo.tipo, nombre.lexema, valor, infoTipo.linea, infoTipo.columna);
            } 
            else{
                //asignación simple
                const id =this.consumir(TokenType.IDENTIFIER, "Se esperaba un identificador en la inicialización del for");
                const tokenAsignar= this.consumir(TokenType.ASSIGN, "Se esperaba '=' en la inicialización del for");
                const valor=this.expresion();
                init = new Asignacion(id.lexema, valor, tokenAsignar.linea, tokenAsignar.columna);
            }
        }
        this.consumir(TokenType.SEMICOLON, "Se esperaba ';' después de la inicilización del for");

        //Condición (opcional)
        let condicion=null;
        if(!this.verificar(TokenType.SEMICOLON)){
            condicion=this.expresion();
        }
        this.consumir(TokenType.SEMICOLON, "Se esperaba ';' después de la condición del for");

        //actualización(opcional)
        let update=null;
        if (!this.verificar(TokenType.RPAREN)){
            const id = this.consumir(TokenType.IDENTIFIER, "Se esperaba un identificador en la actualización del for");
            const tokenAsignar = this.consumir(TokenType.ASSIGN, "Se esperaba '=' en la actualización del for");
            const valor = this.expresion();
            update=new Asignacion(id.lexema, valor, tokenAsignar.linea, tokenAsignar.columna);
        }
        this.consumir(TokenType.RPAREN, "Se esperaba ')' al fial del for");
        const body= this.bloqueInstrucciones();

        return new InstruccionFor( init, condicion, update, body, tokenFor.linea, tokenFor.columna
        );
    }

    sentenciaReturn(){
        const tokenReturn= this.consumir(TokenType.RETURN, "Se esperaba 'return'");

        let valor=null;
        if (!this.verificar(TokenType.SEMICOLON)) {
            valor= this.expresion();
        }

        this.consumir( TokenType.SEMICOLON, "Se esperaba ';' después de 'return'" );

        return new InstruccionReturn(valor, tokenReturn.linea, tokenReturn.columna);
    }

    sentenciaBreak(){
        const tokenBreak= this.consumir(TokenType.BREAK, "Se esperaba 'break'");
        this.consumir(TokenType.SEMICOLON, "Se esperaba ';' desués de 'break'");
        return new InstruccionBreak(tokenBreak.linea, tokenBreak.columna);
    }

    sentenciaContinue() {
        const tokenContinue = this.consumir(TokenType.CONTINUE, "Se esperaba 'continue'");
        this.consumir(TokenType.SEMICOLON, "Se esperaba ';' después de 'continue'");
        return new InstruccionContinue(tokenContinue.linea, tokenContinue.columna);
    }

    sentenciaRun() {
        const tokenRun = this.consumir(TokenType.RUN, "Se esperaba 'run'");
        const nombre=this.consumir(TokenType.IDENTIFIER, "Se esperaba el nombre de la tarea");
        this.consumir(TokenType.SEMICOLON, "Se esperaba ';' después de 'run'");
        return new InstruccionRun(nombre.lexema, tokenRun.linea, tokenRun.columna);
    }
}
module.exports= Parser;