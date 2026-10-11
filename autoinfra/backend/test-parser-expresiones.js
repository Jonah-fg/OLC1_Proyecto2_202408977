const Lexer= require('./src/lexer/Lexer');
const Parser=require('./src/parser/Parser');

const fuente= '10 + 5 * 2';

const lexer =new Lexer(fuente);
const { tokens, errores}=lexer.tokenizar();

if (errores.length > 0){
    console.log('Errores léxicos:');
    errores.forEach((e)=> console.log(`  [${e.tipo}] ${e.descripcion}`));
    process.exit(1);
}

const parser= new Parser(tokens);

try{
    const ast = parser.expresion();
    console.log('========AST DE LA EXPRESIÓN ==========');
    imprimirAST(ast, 0);
}
catch (e){
    console.log('Error sintáctico:', e.message);
    if (e.linea) console.log(`Línea: ${e.linea}, Columna: ${e.columna}`);
}

function imprimirAST(nodo, nivel) {
    if(!nodo) 
        return;

    const indentacion= '  '.repeat(nivel);

    const nombreClase=nodo.constructor.name;
    console.log(`${indentacion}${nombreClase}`);

    for (const clave of Object.keys(nodo)){
        if (['linea', 'columna'].includes(clave)) 
            continue;

        const valor =nodo[clave];

        if(valor && typeof valor === 'object' && valor.constructor && valor.constructor.name !== 'Object'){
            console.log(`${indentacion}  ${clave}:`);
            imprimirAST(valor, nivel + 2);
        } 
        else if (Array.isArray(valor)){
            console.log(`${indentacion}  ${clave}: [`);
            valor.forEach((item) => imprimirAST(item, nivel + 2));
            console.log(`${indentacion}  ]`);
        } 
        else{
            console.log(`${indentacion}  ${clave}: ${JSON.stringify(valor)}`);
        }
    }
}