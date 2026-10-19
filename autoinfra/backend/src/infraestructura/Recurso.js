//Cada subclase (Server, Service, Database) extiende esta clase y agrega sus propiedades y validaciones
class Recurso{
    constructor(nombre, tipo) {
        this.nombre =nombre;
        this.tipo= tipo;        
        this.status='stopped'; //valor por defecto
        this.conexiones = []; //lista de recursos conectados
    }

    estaActivo(){
        return this.status=== 'running';
    }

    estaDetenido(){
        return this.status === 'stopped';
    }

    agregarConexion(recursoDestino){
        if(!this.conexiones.includes(recursoDestino.nombre)){
            this.conexiones.push(recursoDestino.nombre);
        }
    }

    //Elimina una conexión lógica
    eliminarConexion(recursoDestino){
        const indice=this.conexiones.indexOf(recursoDestino.nombre);
        if(indice !== -1) {
            this.conexiones.splice(indice, 1);
        }
    }

    resumen(){
        return{nombre: this.nombre, tipo: this.tipo, status: this.status,};
    }
}
module.exports= Recurso;