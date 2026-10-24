//prueba rápida de los endpoints del servidor
const fs= require('fs');
const URL_BASE ='http://localhost:8080';

async function probar() {
    const fuente=fs.readFileSync('basico.infra', 'utf-8');

    //Health
    console.log('===============/api/health==================');
    const health = await fetch(`${URL_BASE}/api/health`).then(r => r.json());
    console.log(health);

    //Execute
    console.log('\n====================/api/execute===============');
    const execute =await fetch(`${URL_BASE}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: fuente }),
    }).then(r => r.json());

    console.log('exito:',execute.exito);
    console.log('tokens:', execute.tokens.length);
    console.log('errores:',execute.errores.length);
    console.log('consola:', execute.consola);
    console.log('bitacora:', execute.bitacora.length);
    console.log('servidores:', execute.infraestructura.servidores.length);
    console.log('servicios:',execute.infraestructura.servicios.length);

    //Tokens
    console.log('\n==========/api/tokens==========================');
    const tokens =await fetch(`${URL_BASE}/api/tokens`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({ source: fuente }),
    }).then(r =>r.json());
    console.log('tokens:', tokens.tokens.length);

    //AST
    console.log('\n=== /api/ast ===');
    const ast = await fetch(`${URL_BASE}/api/ast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: fuente }),
    }).then(r => r.json());
    console.log('ast.tipo:', ast.ast.tipo);
    console.log('astDot (primeros 50):', ast.astDot.substring(0, 50) + '...');

    //Errores
    console.log('\n========/api/errors============');
    const errores = await fetch(`${URL_BASE}/api/errors`, {
        method:'POST',
        headers:{'Content-Type': 'application/json' },
        body: JSON.stringify({ source: fuente }),
    }).then(r=> r.json());
    console.log('errores:', errores.errores.length);
}
probar().catch(console.error);