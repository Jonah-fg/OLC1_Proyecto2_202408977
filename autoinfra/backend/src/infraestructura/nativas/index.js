//junta todas las funciones naivas en un solo objeto para que el intérprete pueda busarlas por nombre.
const funcionesNativas={
    start: require('./start'),
    stop: require('./stop'),
    restart: require('./restart'),
    install: require('./install'),
    uninstall: require('./uninstall'),
    deploy: require('./deploy'),
    scale: require('./scale'),
    connect: require('./connect'),
    disconnect: require('./disconnect'),
    print: require('./print'),
    length: require('./length'),
    status: require('./status'),
};
module.exports= funcionesNativas;