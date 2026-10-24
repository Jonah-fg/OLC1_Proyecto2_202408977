import axios from 'axios';

const cliente= axios.create({
    baseURL: '/api',
    timeout: 30000,
});

//Ejecuta el código (analiza + ejecuta)
export async function ejecutar(codigoFuente) {
    const respuesta =await cliente.post('/execute', {source: codigoFuente});
    return respuesta.data;
}

export async function analizar(codigoFuente){
    const respuesta=await cliente.post('/analyze', { source: codigoFuente });
    return respuesta.data;
}

//solo tokens
export async function obtenerTokens(codigoFuente) {
    const respuesta = await cliente.post('/tokens', { source: codigoFuente });
    return respuesta.data;
}

//solo AST
export async function obtenerAST(codigoFuente){
    const respuesta = await cliente.post('/ast', { source: codigoFuente});
    return respuesta.data;
}

// olo símbolos
export async function obtenerSimbolos(codigoFuente) {
    const respuesta=await cliente.post('/symbols', { source: codigoFuente});
    return respuesta.data;
}

//solo errores
export async function obtenerErrores(codigoFuente) {
    const respuesta = await cliente.post('/errors', {source: codigoFuente });
    return respuesta.data;
}

export async function verificarSalud() {
    const respuesta=await cliente.get('/health');
    return respuesta.data;
}