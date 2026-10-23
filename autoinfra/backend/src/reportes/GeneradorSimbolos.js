//recorre el árbol de entornos y genera la tabla de símbolos
function generarTablaSimbolos(entornoGlobal) {
    const simbolos= [];
    const entornos=entornoGlobal.obtenerTodosLosEntornos();

    for (const entorno of entornos) {
        for(const [nombre, recurso] of entorno.recursos.entries()){
            simbolos.push({identificador: nombre, categoria: 'recurso', tipo: recurso.tipo, ambito: 'global', valor: recurso.status,});
        }

        //variables y parámetros
        for (const [nombre, info] of entorno.variables.entries()) {
            simbolos.push({identificador: nombre, categoria: info.esParametro ? 'parámetro' : 'variable', tipo: info.tipo, ambito: entorno.nombreAmbiente, valor: formatearValor(info.valor),});
        }

        //Funciones en el global)
        for (const [nombre, funcion] of entorno.funciones.entries()) {
            simbolos.push({identificador: nombre, categoria: 'función', tipo: funcion.returnType || 'void', ambito: 'global', valor: `${funcion.params.length} parámetros`,});
        }

        //Tareas en el global)
        for(const [nombre, tarea] of entorno.tareas.entries()) {
            simbolos.push({identificador: nombre, categoria: 'tarea', tipo: 'void', ambito: 'global', valor: 'tarea',});
        }
    }
    return simbolos;
}

function formatearValor(valor) {
    if (valor=== null || valor=== undefined)
         return 'null';

    if (Array.isArray(valor)) 
        return `[${valor.join(', ')}]`;

    if (typeof valor === 'object' && valor.nombre) 
        return valor.nombre;
    
    return String(valor);
}
module.exports= { generarTablaSimbolos };