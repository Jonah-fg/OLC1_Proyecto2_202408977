
//modela un servcio
const Recurso =require('./Recurso');
const {ErrorInfraestructura } = require('../Utils/Errores');

class Service extends Recurso{
    constructor(nombre, propiedades, linea, columna) {
        super(nombre, 'service');
        //Valores por defecto
        this.port =0;
        this.replicas =1;
        this.status = 'undeployed'; //sobrescribe 'stopped' del padre
        this.host = null;            
        this.dependsOn=[]; //nombres de recursos de los que depende
        this.aplicarPropiedades(propiedades, linea, columna);
    }

    aplicarPropiedades(propiedades, linea, columna){
        for (const clave of Object.keys(propiedades)) {
            const valor= propiedades[clave];

            switch (clave){
                case 'port':
                    if(typeof valor !== 'number' || valor < 1 || valor> 65535) {
                        throw new ErrorInfraestructura('INFRA-001', `Propiedad 'port' del service '${this.nombre}' debe estar entre 1 y 65535`, linea, columna);
                    }
                    this.port= valor;
                    break;

                case 'replicas':
                    if(typeof valor !=='number' || valor<1){
                        throw new ErrorInfraestructura('INFRA-001', `Propiedad 'replicas' del service '${this.nombre}' debe ser mayor o igual a 1`, linea, columna);
                    }
                    this.replicas = valor;
                    break;

                case 'dependsOn':
                    if (!Array.isArray(valor)) {
                        throw new ErrorInfraestructura('INFRA-001', `Propiedad 'dependsOn' del service '${this.nombre}' debe ser un arreglo`, linea, columna );
                    }
                    this.dependsOn = valor;
                    break;

                case 'status':
                    throw new ErrorInfraestructura('INFRA-002', `Propiedad 'status' del service '${this.nombre}' es de solo lectra`, linea, columna);

                case 'host':
                    throw new ErrorInfraestructura( 'INFRA-002', `Propiedad 'host' del sevice '${this.nombre}' es de solo lectura`, linea, columna);

                default:
                    throw new ErrorInfraestructura('INFRA-003', `Propiedad '${clave}' no existe en el service '${this.nombre}'`,linea, columna);
            }
        }
    }
    resumen() {
        return{nombre: this.nombre, tipo: this.tipo, status: this.status, port: this.port, replicas: this.replicas, host: this.host ? this.host.nombre : null, dependsOn: this.dependsOn,};
    }
}
module.exports= Service;