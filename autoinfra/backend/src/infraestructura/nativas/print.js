function print(entorno, args, linea, columna) {
    const partes=args.map((valor) =>{
        if(valor === null || valor===undefined) {
            return 'null';
        }
        if (typeof valor === 'object' && valor.nombre) {
            return valor.nombre;
        }
        return String(valor);
    });
    entorno.imprimir(partes.join(' '));
    return null;
}
module.exports=print;