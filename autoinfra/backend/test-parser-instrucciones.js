const Lexer= require('./src/lexer/Lexer');
const Parser=require('./src/parser/Parser');

const fuente= `
{
    int x = 10;
    x = x + 1;
    if (x > 5) {
        print("grande");
    } else {
        print("pequeño");
    }
    while (x < 100) {
        x = x + 1;
    }
    for (int i = 0; i < 3; i = i + 1) {
        print(i);
    }
    return;
}
`;
const lexer = new Lexer(fuente);
const { tokens, errores}=lexer.tokenizar();

if (errores.length> 0){
    console.log('Errores léxicos:');
    errores.forEach((e)=> console.log(`  [${e.tipo}] ${e.descripcion}`));
    process.exit(1);
}

const parser = new Parser(tokens);
try{
    const bloque = parser.bloqueInstrucciones();
    console.log('=== AST DEL BLOQUE ===');
    imprimirAST(bloque, 0);
} 
catch (e){
    console.log('Error sintáctico:', e.message);
    if (e.linea) console.log(`Línea: ${e.linea}, Columna: ${e.columna}`);
}

console.log('\n===========ERRORES SINTÁCTICOS REPORTADS================');
const errs =parser.obtenerErrores();
if (errs.length=== 0) {
    console.log('Sin errores.');
} 
else{
    errs.forEach((e)=> {
        console.log(`[${e.tipo} ${e.codigo}] ${e.descripcion} (L${e.linea}:C${e.columna})`);
    });
}

function imprimirAST(nodo, nivel){
    if (!nodo)
        return;

    const indentacion= '  '.repeat(nivel);

    const nombreClase= nodo.constructor.name;
    console.log(`${indentacion}${nombreClase}`);

    for (const clave of Object.keys(nodo)) {
        if (['linea', 'columna'].includes(clave)) {
            continue;
        }
        const valor = nodo[clave];

        if(Array.isArray(valor)){
            console.log(`${indentacion}  ${clave}: [`);
            valor.forEach((item) => imprimirAST(item, nivel + 2));
            console.log(`${indentacion}  ]`);
        } 
        else if (valor && typeof valor==='object' && valor.constructor && valor.constructor.name !== 'Object') {
            console.log(`${indentacion}  ${clave}:`);
            imprimirAST(valor, nivel + 2);
        } 
        else{
            console.log(`${indentacion}  ${clave}: ${JSON.stringify(valor)}`);
        }
    }
}