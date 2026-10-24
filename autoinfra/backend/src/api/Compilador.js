// backend/src/api/Compilador.js
// Pipeline unificado: Lexer → Parser → Interpreter.
// Usado por todos los endpoints del servidor.

const Lexer = require('../lexer/Lexer');
const Parser = require('../parser/Parser');
const Interpreter = require('../interpreter/Interpreter');
const { consolidarErrores } = require('../reportes/GeneradorErrores');
const { generarTablaSimbolos } = require('../reportes/GeneradorSimbolos');
const { serializarAST, generarDot } = require('../reportes/GeneradorAST');

function compilar(fuente, ejecutar = true) {
    //1. Lexer
    const lexer = new Lexer(fuente);
    const { tokens, errores: erroresLexicos } = lexer.tokenizar();

    //2. Parser
    const parser = new Parser(tokens);
    const programa = parser.parsear();
    const erroresSintacticos = parser.obtenerErrores();

    //Si hay errores léxicos o sintácticos graves, no ejecutamos
    const hayErroresPrevios = erroresLexicos.length > 0 || erroresSintacticos.length > 0;

    //3. Interpreter (solo si se pide ejecutar y no hay errores previos graves)
    let resultadoEjecucion = {
        consola: [],
        bitacora: [],
        errores: [],
        infraestructura: { servidores: [], servicios: [], databases: [] },
    };

    let entornoGlobal = null;

    if (ejecutar && !hayErroresPrevios) {
        const interpreter = new Interpreter(programa);
        resultadoEjecucion = interpreter.ejecutar();
        entornoGlobal = interpreter.entorno;
    }

    //4. Consolidar errores
    const errores = consolidarErrores(
        erroresLexicos,
        erroresSintacticos,
        resultadoEjecucion.errores
    );

    //5. Símbolos (solo si se ejecutó)
    const simbolos = entornoGlobal ? generarTablaSimbolos(entornoGlobal) : [];

    //6. AST
    const ast = serializarAST(programa);
    const astDot = generarDot(programa);

    //7. Tokens serializables
    const tokensJson = tokens.map((t) => ({
        tipo: t.tipo,
        lexema: t.lexema,
        linea: t.linea,
        columna: t.columna,
    }));

    return {
        exito: errores.length === 0,
        tokens: tokensJson,
        errores,
        simbolos,
        ast,
        astDot,
        consola: resultadoEjecucion.consola,
        bitacora: resultadoEjecucion.bitacora,
        infraestructura: resultadoEjecucion.infraestructura,
    };
}

module.exports = { compilar };