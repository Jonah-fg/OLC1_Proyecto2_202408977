
//Consolida los errores de todas las fases (léxico, sintáctico, ejecución, infraestructura) en una sola estructura para el reporte del PDF 
function consolidarErrores(erroresLexicos = [], erroresSintacticos = [], erroresEjecucion = []) {
    const todos= [];

    // 1. Errores léxicos
    for (const error of erroresLexicos) {
        todos.push({tipo: 'Léxico', codigo: error.codigo || 'LEX-001', descripcion: error.descripcion || error.message || 'Error léxico', linea: error.linea || 0, columna: error.columna || 0,});
    }

    //Errores sintácticos
    for(const error of erroresSintacticos) {
        todos.push({ tipo: 'Sintáctico', codigo: error.codigo || 'SIN-001', descripcion: error.descripcion || error.message || 'Error sintáctico', linea: error.linea || 0, columna: error.columna || 0,});
    }

    //Errores de ejecución e infraestructura
    for (const error of erroresEjecucion){
        let tipo= error.tipo || 'Ejecución';
        let codigo=error.codigo || 'EXE-001';

        if(typeof codigo === 'string' && codigo.startsWith('INFRA')) {
            tipo ='Infraestructura';
        }
        todos.push({tipo: tipo, codigo: codigo, descripcion: error.descripcion || error.message || 'Error de ejecución', linea: error.linea || 0, columna: error.columna || 0, });
    }

    todos.sort((a, b) =>{
        if(a.linea !== b.linea)
            return a.linea-b.linea;

        return a.columna - b.columna;
    });
    return todos;
}
module.exports = { consolidarErrores};