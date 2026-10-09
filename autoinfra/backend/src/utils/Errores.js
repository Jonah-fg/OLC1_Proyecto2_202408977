class ErrorLexico {
  constructor(descripcion, linea, columna) {
    this.tipo ='Léxico';
    this.codigo = 'LEX-001';
    this.descripcion= descripcion;
    this.linea = linea;
    this.columna=columna;
  }
}
module.exports ={ErrorLexico };
