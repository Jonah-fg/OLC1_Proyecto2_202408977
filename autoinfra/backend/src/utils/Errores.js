class ErrorLexico{
    constructor(descripcion, linea, columna) {
        this.tipo= 'Léxico';
        this.codigo='LEX-001';
        this.descripcion = descripcion;
        this.linea = linea;
        this.columna= columna;
    }
}

class ErrorSintactico{
    constructor(descripcion, linea, columna) {
        this.tipo = 'Sintáctico';
        this.codigo ='SIN-001';
        this.descripcion = descripcion;
        this.linea= linea;
        this.columna=columna;
    }
}

class ErrorEjecucion{
    constructor(descripcion, linea, columna) {
        this.tipo='Ejecución';
        this.codigo = 'EXE-001';
        this.descripcion = descripcion;
        this.linea= linea;
        this.columna=columna;
    }
}

class ErrorInfraestructura{
    constructor(codigo, descripcion, linea, columna) {
        this.tipo ='Infraestructura';
        this.codigo = codigo;  
        this.descripcion = descripcion;
        this.linea = linea;
        this.columna=columna;
    }
}
module.exports= {ErrorLexico, ErrorSintactico, ErrorEjecucion, ErrorInfraestructura};
