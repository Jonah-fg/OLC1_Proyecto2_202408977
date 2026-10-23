//Tabla de símbolos con ámbitos anidados
//variables, funciones, tareas y recursos y toooooooodo eso :)
const {ErrorEjecucion } =require('../Utils/Errores');
const ExecSignal = require('../ast/ExecSignal');

class Entorno{
    constructor(padre=null, nombreAmbiente = 'global') {
        this.padre =padre;
        this.nombreAmbiente=nombreAmbiente;
        this.variables = new Map(); //nombre → {valor, tipo }
        this.funciones= new Map(); //nombre → DeclaracionFuncion
        this.tareas =new Map(); //nombre → DeclaracionTarea
        this.recursos=new Map(); //nombre → Recurso (Server/Service/Database)
        this.hijos = [];   

        //Estado compartido del intérprete (solo en el entorno global)
        if (padre === null){
            this.hijos=[]
            this.contadorInstrucciones = 0;
            this.profundidadLlamadas = 0;
            this.limiteInstrucciones = 100000;
            this.limiteProfundidad = 1000;
            this.consola =[];  
            this.errores = []; 
            this.bitacora = [];  
        }
        else{
            padre.hijos.push(this);
        }
    }

    //Ámbitos
    //Crea un entorno hijo (para funciones, bloques, ciclos)
    crearHijo(nombreAmbiente = 'bloque') {
        return new Entorno(this, nombreAmbiente);
    }

    // Devuelve el entorno global (raíz)
    global() {
        let actual= this;
        while (actual.padre !== null) {
            actual=actual.padre;
        }
        return actual;
    }

    //devuelve todos los entornos del árbol para los reportes
    obtenerTodosLosEntornos(){
        const lista=[];
        const visitar=(entorno) =>{
            lista.push(entorno);
            for (const hijo of entorno.hijos){
                visitar(hijo);
            }
        };
        visitar(this.global());
        return lista;
    }

    //Variables
    //declara una variable en el ámbito actual
    declarar(nombre, valor, tipo, linea, columna, esParametro= false){
        if (this.variables.has(nombre)){
            throw new ErrorEjecucion(`Variable '${nombre}' ya declarada en este ámbito`, linea, columna);
        }
        this.variables.set(nombre, {valor, tipo, esParametro});
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
    registrarRecurso(tipoRecurso, nombre, propiedades, linea, columna) {
        if (typeof nombre !=='string'){
            const recurso = nombre;
            this.global().recursos.set(tipoRecurso, recurso);
            return recurso;
        }
        const{Server, Service, Database} = require('../infraestructura');

        let recurso;
        switch (tipoRecurso) {
            case 'server':
                recurso= new Server(nombre, propiedades, linea, columna);
                break;
            case 'service':
                recurso= new Service(nombre, propiedades, linea, columna);
                break;
            case 'database':
                recurso=new Database(nombre, propiedades, linea, columna);
                break;
            default:
                throw new ErrorEjecucion(`Tipo de recurso desconocido: '${tipoRecurso}'`, linea, columna);
        }
        this.global().recursos.set(nombre, recurso);
        this.registrarBitacora(`[OK] Resource '${nombre}' registered`);
        return recurso;
    }

    obtenerRecurso(nombre){
        return this.global().recursos.get(nombre) || null;
    }

    obtenerRecursosGlobales(){
        return this.global().recursos;
    }

    //Llamadas a funciones y tareas
    llamarFuncion(nombre, args, linea, columna){
        //Funciones nativas primero
        const { funcionesNativas } =require('../infraestructura');
        if (funcionesNativas[nombre]){
            return funcionesNativas[nombre](this, args, linea, columna);
        }

        //Funciones de usuario
        const funcion=this.obtenerFuncion(nombre);
        if (!funcion) {
            throw new ErrorEjecucion(`Función '${nombre}' no definida`, linea, columna);
        }

        //Validar número de parámetros
        if (args.length !==funcion.params.length){
            throw new ErrorEjecucion(`Función '${nombre}' espera ${funcion.params.length} argumentos, recibió ${args.length}`, linea, columna);
        }

        //crecion entorno hijo con los parámetros
        const entornoFuncion= this.crearHijo(nombre);
        for (let i = 0; i <funcion.params.length; i++) {
            entornoFuncion.declarar(funcion.params[i].nombre, args[i], funcion.params[i].tipo, linea, columna, true);
        }

        this.entrarLlamada(linea, columna);
        try{
            const resultado=funcion.body.ejecutar(entornoFuncion);
            if(resultado.senal === ExecSignal.RETURN) {
                return resultado.valor;
            }
            return null;
        } 
        finally{
            this.salirLlamada();
        }
    }

    ejecutarTarea(nombreTarea, linea, columna){
        const tarea= this.obtenerTarea(nombreTarea);
        if (!tarea){
            throw new ErrorEjecucion(`Tarea '${nombreTarea}' no definida`, linea, columna);
        }
        //se descarta cualquier señal de retorno
        tarea.body.ejecutar(this);
        return{senal: ExecSignal.NORMAL, valor: null };
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

    registrarError(error){
        const global= this.global();
        if (error.tipo && error.descripcion){
            global.errores.push(error);
        } 
        else{
            global.errores.push({tipo: 'Ejecución', codigo: 'EXE-001', descripcion: error.message || String(error), linea: 0, columna: 0,});
        }
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
    obtenerErrores(){
        return this.global().errores;
    }
}
module.exports= Entorno;