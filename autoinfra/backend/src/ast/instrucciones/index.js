
//Exporta todas las instrucciones del AST en un solo módulo
const DeclaracionVariable = require('./DeclaracionVariable');
const Asignacion =require('./Asignacion');
const BloqueInstrucciones = require('./BloqueInstrucciones');
const InstruccionIf= require('./InstruccionIf');
const InstruccionWhile = require('./InstruccionWhile');
const InstruccionFor = require('./InstruccionFor');
const InstruccionReturn= require('./InstruccionReturn');
const InstruccionBreak =require('./InstruccionBreak');
const InstruccionContinue = require('./InstruccionContinue');
const InstruccionLlamada=require('./InstruccionLlamada');
const InstruccionRun =require('./InstruccionRun.js');
const DeclaracionFuncion= require('./DeclaracionFuncion');
const DeclaracionTarea =require('./DeclaracionTarea');
const DeclaracionRecurso= require('./DeclaracionRecurso');

module.exports ={
    DeclaracionVariable,
    Asignacion,
    BloqueInstrucciones,
    InstruccionIf,
    InstruccionWhile,
    InstruccionFor,
    InstruccionReturn,
    InstruccionBreak,
    InstruccionContinue,
    InstruccionLlamada,
    InstruccionRun,
    DeclaracionFuncion,
    DeclaracionTarea,
    DeclaracionRecurso,
};
