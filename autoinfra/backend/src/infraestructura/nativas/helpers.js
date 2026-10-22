const Recurso = require('../Recurso');
const Server = require('../Server');
const Service = require('../Service');
const { ErrorEjecucion } = require('../../Utils/Errores');

function validarRecurso(valor, nombreFuncion, posicion, linea, columna) {
    if(!(valor instanceof Recurso)) {
        throw new ErrorEjecucion(`${nombreFuncion}: el argumento ${posicion} debe ser un recurso`, linea, columna);
    }
}

function validarServer(valor, nombreFuncion, posicion, linea, columna) {
    if (!(valor instanceof Server)) {
        throw new ErrorEjecucion(`${nombreFuncion}: el argumento ${posicion} debe ser un server`, linea, columna);
    }
}

function validarService(valor, nombreFuncion, posicion, linea, columna) {
    if(!(valor instanceof Service)) {
        throw new ErrorEjecucion(`${nombreFuncion}: el argumento ${posicion} debe ser un service`, linea, columna);
    }
}

function validarString(valor, nombreFuncion, posicion, linea, columna) {
    if (typeof valor !== 'string') {
        throw new ErrorEjecucion(`${nombreFuncion}: el argumento ${posicion} debe ser tring`, linea, columna
        );
    }
}

function validarEntero(valor, nombreFuncion, posicion, linea, columna){
    if (typeof valor !== 'number' || !Number.isInteger(valor)) {
        throw new ErrorEjecucion(`${nombreFuncion}: el argumento ${posicion} debe ser entero`, linea, columna);
    }
}

module.exports={validarRecurso, validarServer, validarService, validarString, validarEntero,};