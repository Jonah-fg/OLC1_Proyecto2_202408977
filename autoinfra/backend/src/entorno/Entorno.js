
//Tabla de símbolos con ámbitos anidados
//variables, funciones, tareas y recursos y toooooooodo eso :)
const {ErrorEjecucion } =require('../Utils/Errores');

class Entorno{
    constructor(padre=null) {
        this.padre =padre;
        this.variables = new Map(); //nombre → {valor, tipo }
        this.funciones= new Map(); //nombre → DeclaracionFuncion
        this.tareas =new Map(); //nombre → DeclaracionTarea
        this.recursos=new Map(); //nombre → Recurso (Server/Service/Database)

        //Estado compartido del intérprete (solo en el entorno global)
        if (padre === null){
            this.contadorInstrucciones = 0;
            this.profundidadLlamadas = 0;
            this.limiteInstrucciones = 100000;
            this.limiteProfundidad = 1000;
            this.consola =[];  
            this.bitacora = [];  
        }
    }

    // Ámbitos
    //Crea un entorno hijo (para funciones, bloques, ciclos)
    crearHijo() {
        return new Entorno(this);
    }

    // Devuelve el entorno global (raíz)
    global() {
        let actual= this;
        while (actual.padre !== null) {
            actual=actual.padre;
        }
        return actual;
    }

    //Variables
    //declara una variable en el ámbito actual
    declarar(nombre, valor, tipo, linea, columna){
        if (this.variables.has(nombre)){
            throw new ErrorEjecucion(`Variable '${nombre}' ya declarada en este ámbito`, linea, columna);
        }
        this.variables.set(nombre, {valor, tipo});
    }

    // Busca una variable en el ámbito actual y luego en los padres
    obtener(nombre, linea, columna) {
        if (this.variables.has(nombre)) {
            return this.variables.get(nombre).valor;
        }
        if (this.padre !== null) {
            return this.padre.obtener(nombre, linea, columna);
        }
        //Si no es variable, ¿es un recurso?
        if (this.recursos.has(nombre)){
            return this.recursos.get(nombre);
        }
        throw new ErrorEjecucion(`Variable '${nombre}' no declarada`, linea, columna
        );
    }

    //asigna un nuevo valor a una variable existente
    asignar(nombre, valor, linea, columna) {
        if (this.variables.has(nombre)){
            this.variables.get(nombre).valor= valor;
            return;
        }
        if (this.padre !== null) {
            this.padre.asignar(nombre, valor, linea, columna);
            return;
        }
        throw new ErrorEjecucion(`Variable '${nombre}' no declarada`, linea, columna);
    }

    // Devuelve el tipo de una variable
    tipoDe(nombre) {
        if (this.variables.has(nombre)) {
            return this.variables.get(nombre).tipo;
        }
        if (this.padre !== null){
            return this.padre.tipoDe(nombre);
        }
        return null;
    }

    //Funciones
    declararFuncion(nombre, nodoFuncion) {
        this.global().funciones.set(nombre, nodoFuncion);
    }

    obtenerFuncion(nombre){
        return this.global().funciones.get(nombre) || null;
    }

    //Tareas
    declararTarea(nombre, nodoTarea) {
        this.global().tareas.set(nombre, nodoTarea);
    }

    obtenerTarea(nombre){
        return this.global().tareas.get(nombre) || null;
    }

    //recursos
    registrarRecurso(nombre, recurso){
        this.global().recursos.set(nombre, recurso);
    }

    obtenerRecurso(nombre){
        return this.global().recursos.get(nombre) || null;
    }

    // Control de ejecución
    // Incrementa el contador de instrucciones y verifica el límite
    incrementarInstrucciones(linea, columna) {
        const global = this.global();
        global.contadorInstrucciones++;
        if (global.contadorInstrucciones > global.limiteInstrucciones) {
            throw new ErrorEjecucion(`Límite de instrucciones excedido (${global.limiteInstrucciones})`, linea, columna);
        }
    }

    // Entra en una llamada a función (incrementa la profundidad)
    entrarLlamada(linea, columna) {
        const global = this.global();
        global.profundidadLlamadas++;
        if (global.profundidadLlamadas > global.limiteProfundidad) {
            throw new ErrorEjecucion(
                `Límite de profundidad de llamadas excedido (${global.limiteProfundidad})`,
                linea, columna
            );
        }
    }

    // Sale de una llamada a función (decrementa la profundidad)
    salirLlamada() {
        const global = this.global();
        if (global.profundidadLlamadas > 0) {
            global.profundidadLlamadas--;
        }
    }

    // ─────────────────────────────────────────────────────────────
    // Consola y bitácora
    // ─────────────────────────────────────────────────────────────

    imprimir(mensaje){
        this.global().consola.push(mensaje);
    }

    registrarBitacora(mensaje) {
        this.global().bitacora.push(mensaje);
    }

    obtenerConsola() {
        return this.global().consola;
    }

    obtenerBitacora() {
        return this.global().bitacora;
    }

    obtenerRecursosGlobales() {
        return this.global().recursos;
    }
}
module.exports= Entorno;