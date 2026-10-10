const ExpresionLiteral= require('./ExpresionLiteral');
const ExpresionIdentificador = require('./ExpresionIdentificador');
const ExpresionBinaria= require('./ExpresionBinaria');
const ExpresionUnaria =require('./ExpresionUnaria');
const ExpresionLlamada = require('./ExpresionLlamada');
const ExpresionAccesoPropiedad = require('./ExpresionAccesoPropiedad');
const ExpresionIndice= require('./ExpresionIndice');
const ExpresionArreglo=require('./ExpresionArreglo');

module.exports={
    ExpresionLiteral,
    ExpresionIdentificador,
    ExpresionBinaria,
    ExpresionUnaria,
    ExpresionLlamada,
    ExpresionAccesoPropiedad,
    ExpresionIndice,
    ExpresionArreglo,
};