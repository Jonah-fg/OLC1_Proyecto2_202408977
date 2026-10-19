//modela servidor
const Recurso = require('./Recurso');
const { ErrorInfraestructura }= require('../Utils/Errores');

class Server extends Recurso{
    constructor(nombre, propiedades, linea, columna){
        super(nombre, 'server');
        this.cpu = 0;
        this.memory=0;
        this.disk = 0;
        this.os = '';
        this.packages= [];
        this.aplicarPropiedades(propiedades, linea, columna);
    }

    aplicarPropiedades(propiedades, linea, columna){
        for (const clave of Object.keys(propiedades)){
            const valor= propiedades[clave];
            switch (clave){
                case 'cpu':
                    if (typeof valor!== 'number' || valor <= 0){
                        throw new ErrorInfraestructura('INFRA-001', `Propiedad 'cpu' del server '${this.nombre}' debe ser un entero mayor a 0`, linea, columna);
                    }
                    this.cpu=valor;
                    break;

                case 'memory':
                    if(typeof valor !== 'number' || valor <= 0){
                        throw new ErrorInfraestructura('INFRA-001', `Propiedad 'memory' del server '${this.nombre}' debe ser un entero mayor a 0`, linea, columna );
                    }
                    this.memory=valor;
                    break;

                case 'disk':
                    if(typeof valor !== 'number' || valor <= 0) {
                        throw new ErrorInfraestructura('INFRA-001', `Propiedad 'disk' del server '${this.nombre}' debe ser un entero mayor a 0`, linea, columna);
                    }
                    this.disk = valor;
                    break;

                case 'os':
                    if(typeof valor !== 'string' || valor.trim() === '') {
                        throw new ErrorInfraestructura('INFRA-001', `Propiedad 'os' del server '${this.nombre}' no puede estar vacía`, linea, columna);
                    }
                    this.os=valor;
                    break;

                case 'status':
                    throw new ErrorInfraestructura('INFRA-002', `Propiedad 'status' del server '${this.nombre}' es de solo lectura`, linea, columna);

                case 'packages':
                    throw new ErrorInfraestructura('INFRA-002', `Propiedad 'packages' del server '${this.nombre}' es de solo lectura`,linea, columna);

                default:
                    throw new ErrorInfraestructura('INFRA-003', `Propiedad '${clave}' no existe en el server '${this.nombre}'`,linea, columna);
            }
        }
    }

    //Agrega un paquete instalado 
    agregarPaquete(nombrePaquete){
        if(!this.packages.includes(nombrePaquete)){
            this.packages.push(nombrePaquete);
        }
    }

    //Elimina un paquete instalado
    eliminarPaquete(nombrePaquete){
        const indice= this.packages.indexOf(nombrePaquete);
        if (indice !== -1) {
            this.packages.splice(indice, 1);
        }
    }

    resumen(){
        return{nombre: this.nombre, tipo: this.tipo, status: this.status, cpu: this.cpu, memory: this.memory, disk: this.disk, os: this.os, packages: this.packages,};
    }
}
module.exports = Server;