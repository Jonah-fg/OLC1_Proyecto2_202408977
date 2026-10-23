//Serialización a JSON
function serializarAST(programa) {
    if(!programa){
        return null;
    }
    return serializarNodo(programa);
}

function serializarNodo(nodo) {
    if (nodo ===null || nodo=== undefined) 
        return null;

    if (typeof nodo!== 'object'){
       return nodo; 
    }

    if (Array.isArray(nodo)){
        return nodo.map(serializarNodo);
    }

    let nombreTipo = nodo.constructor ? nodo.constructor.name : 'Object';
    if (nombreTipo ==='Object'){
        if(nodo.nombre !== undefined && nodo.valor !== undefined){
            nombreTipo = 'Propiedad';
        } 
        else if (nodo.tipo !== undefined && nodo.nombre!== undefined) {
            nombreTipo ='Parámetro';
        } 
        else{
            nombreTipo='Objeto';
        }
    }

    const resultado={tipo: nombreTipo,};

    for(const clave of Object.keys(nodo)){
        const valor=nodo[clave];

        if (valor=== null || valor === undefined) {
            resultado[clave]= valor;
        } 
        else if (typeof valor === 'object') {
            resultado[clave]=serializarNodo(valor);
        } 
        else{
            resultado[clave]= valor;
        }
    }
    return resultado;
}


//Graphviz DOT
function generarDot(programa) {
    if (!programa){
        return 'digraph AST {\n   nodo0 [label="Sin AST"];\n}\n';
    }

    const lineas= [];
    const conexiones = [];
    let contador =0;

    const visitar = (nodo, idPadre, etiquetaArista)=>{
        if (nodo ===null || nodo === undefined){
            return;
        }
        const id= `nodo${contador++}`;
        //primitiva
        if(typeof nodo !=='object'){
            const texto= escaparDot(String(nodo).substring(0, 40));
            lineas.push(`    ${id} [label="${texto}", shape=ellipse, style=filled, fillcolor="#fff9c4"];`);
            if (idPadre) {
                conexiones.push(`    ${idPadre} -> ${id} [label="${etiquetaArista || ''}"];`);
            }
            return;
        }

        //Array: mostrar como elipse azul con la cantidad
        if (Array.isArray(nodo)) {
            lineas.push(`   ${id} [label="[${nodo.length}]", shape=ellipse, style=filled, fillcolor="#bbdefb"];`);
            if (idPadre){
                conexiones.push(`   ${idPadre} -> ${id} [label="${etiquetaArista || ''}"];`);
            }
            nodo.forEach((item, i)=>visitar(item, id, `[${i}]`));
            return;
        }

        //Objeto: determinar nombre de clase legible
        let nombreClase= nodo.constructor ? nodo.constructor.name : 'Object';
        if (nombreClase ==='Object') {
            if(nodo.tipo && nodo.nombre){
                nombreClase = 'Parámetro';
            } 
            else if(nodo.nombre && nodo.valor !== undefined){
                nombreClase= 'Propiedad';
            } 
            else{
                nombreClase= 'Objeto';
            }
        }

        //Agregar información relevante al label
        const extras =[];
        const clavesInfo =['nombre', 'tipo', 'tipoRecurso', 'operador', 'valor', 'returnType'];
        for (const clave of clavesInfo) {
            if (nodo[clave] !== undefined && nodo[clave] !== null && typeof nodo[clave] !== 'object') {
                const valorStr = String(nodo[clave]).substring(0, 20);
                extras.push(`${clave}=${valorStr}`);
            }
        }

        let etiqueta= nombreClase;
        if (extras.length >0){
            etiqueta += '\\n' + extras.join('\\n');
        }

        lineas.push(`   ${id} [label="${escaparDot(etiqueta)}"];`);
        if (idPadre) {
            conexiones.push(`   ${idPadre} -> ${id} [label="${etiquetaArista || ''}"];`);
        }

        //Visitar hijos
        for (const clave of Object.keys(nodo)) {
            if (clave=== 'linea' || clave === 'columna') {
                continue;
            }
            const valor=nodo[clave];
            if (valor !==null && valor!== undefined && typeof valor==='object') {
                visitar(valor, id, clave);
            }
        }
    };
    visitar(programa, null, null);
    let dot='digraph AST {\n';
    dot+= '  node [shape=box, style=rounded, fontname="Helvetica", fontsize=10];\n';
    dot+= '   edge [fontname="Helvetica", fontsize=8];\n';
    dot += '   rankdir=TB;\n';
    dot+= lineas.join('\n') + '\n';
    dot += conexiones.join('\n') + '\n';
    dot +='}\n';
    return dot;
}

function escaparDot(texto) {
    return String(texto)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');
}
module.exports={serializarAST, generarDot};