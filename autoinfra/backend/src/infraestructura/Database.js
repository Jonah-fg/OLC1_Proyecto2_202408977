const Recurso = require('./Recurso');
const { ErrorInfraestructura } = require('../Utils/Errores');
const MOTORES_VALIDOS =['postgresql', 'mysql', 'sqlite'];

class Database extends Recurso{
    constructor(nombre, propiedades, linea, columna) {
        super(nombre, 'database');
        this.engine= '';
        this.version = '';
        this.port = 0;
        this.aplicarPropiedades(propiedades, linea, columna);
    }

    aplicarPropiedades(propiedades, linea, columna){
        for (const clave of Object.keys(propiedades)){
            const valor =propiedades[clave];

            switch (clave){
                case 'engine':
                    if(typeof valor !== 'string' || !MOTORES_VALIDOS.includes(valor)) {
                        throw new ErrorInfraestructura('INFRA-001', `Propiedad 'engine' de la database '${this.nombre}' debe ser uno de: postgresql, mysql, sqlite`, linea, columna);
                    }
                    this.engine =valor;
                    break;

                case 'version':
                    if(typeof valor !=='string' || valor.trim()=== '') {
                        throw new ErrorInfraestructura('INFRA-001', `Propiedad 'version' de la database '${this.nombre}' no puede estar vacía`, linea, columna);
                    }
                    this.version = valor;
                    break;

                case 'port':
                    if (typeof valor !== 'number' || valor < 1 ||valor > 65535) {
                        throw new ErrorInfraestructura('INFRA-001', `Propiedad 'port' de la database '${this.nombre}' debe estar entre 1 y 65535`, linea, columna);
                    }
                    this.port=valor;
                    break;

                case 'status':
                    throw new ErrorInfraestructura('INFRA-002', `Propiedad 'status' de la datbase '${this.nombre}' es de solo lectura`, linea, columna);

                default:
                    throw new ErrorInfraestructura('INFRA-003', `Propiedad '${clave}' no existe en la database '${this.nombre}'`, linea, columna);
            }
        }
    }

    resumen(){
        return{nombre: this.nombre, tipo: this.tipo, status: this.status, engine: this.engine, version: this.version, port: this.port,};
    }
}
module.exports= Database;