
const express=require('express');
const cors = require('cors');
const { compilar}= require('./Compilador');

const app= express();
const PUERTO =8080;

//Middlewares
app.use(cors());
app.use(express.json({ limit: '5mb' }));

//GET /api/health — servidor esté vivo
app.get('/api/health', (req, res) =>{
    res.json({ok: true,servicio: 'AutoInfra API', version: '1.0.0', timestamp: new Date().toISOString(),});
});


//POST /api/execute —analiza y ejecuta el archivo
app.post('/api/execute', (req, res)=> {
    const { source } = req.body;

    if (typeof source !== 'string' || source.trim() === '') {
        return res.status(400).json({exito: false, errores: [{
                tipo: 'Solicitud',
                codigo: 'REQ-001',
                descripcion: 'El campo "source" es obligatorio y debe ser string',
                linea: 0,
                columna: 0,
            }],
        });
    }

    try {
        const resultado= compilar(source, true);
        res.json(resultado);
    } 
    catch (e) {
        res.status(500).json({exito: false, errores: [{
                tipo: 'Servidor',
                codigo: 'SRV-001',
                descripcion: e.message || String(e),
                linea: 0,
                columna: 0,
            }],
        });
    }
});


//POST /api/analyze
app.post('/api/analyze', (req, res) =>{
    const {source} =req.body;

    if (typeof source !== 'string' || source.trim() ===''){
        return res.status(400).json({
            exito: false,
            errores: [{
                tipo: 'Solicitud',
                codigo: 'REQ-001',
                descripcion: 'El campo "source" es obligatorio y debe ser string',
                linea: 0,
                columna: 0,
            }],
        });
    }

    try{
        const resultado =compilar(source, false);
        res.json(resultado);
    } 
    catch(e){
        res.status(500).json({exito: false, errores:
            [{
            tipo: 'Servidor',
                codigo: 'SRV-001',
                descripcion: e.message || String(e),
                linea: 0,
                columna: 0,
            }],
        });
    }
});

// POST /api/tokens -tokens
app.post('/api/tokens', (req, res) =>{
    const { source}=req.body;

    if (typeof source !=='string') {
        return res.status(400).json({ exito: false, errores: ['source requerido'] });
    }
    try {
        const resultado=compilar(source, false);
        res.json({ exito: true, tokens: resultado.tokens});
    } 
    catch (e){
        res.status(500).json({ exito: false, errores: [e.message]});
    }
});

// POST /api/ast — AST
app.post('/api/ast', (req, res) => {
    const { source } = req.body;

    if (typeof source !=='string'){
        return res.status(400).json({ exito: false, errores: ['source requerido'] });
    }

    try {
        const resultado=compilar(source, false);
        res.json({ exito: true, ast: resultado.ast, astDot: resultado.astDot });
    } 
    catch (e){
        res.status(500).json({exito: false, errores: [e.message] });
    }
});

//POST /api/symbols —tabla de símbolos
app.post('/api/symbols', (req, res) => {
    const { source } = req.body;

    if (typeof source !== 'string') {
        return res.status(400).json({ exito: false, errores: ['source requerido'] });
    }

    try {
        const resultado = compilar(source, true);
        res.json({ exito: true, simbolos: resultado.simbolos });
    } catch (e) {
        res.status(500).json({ exito: false, errores: [e.message] });
    }
});

//POST /api/errors — devuelve solo los errores
app.post('/api/errors', (req, res) =>{
    const { source } = req.body;

    if (typeof source !== 'string'){
        return res.status(400).json({exito: false, errores: ['source requerido']});
    }

    try{
        const resultado = compilar(source, true);
        res.json({ exito: true, errores: resultado.errores });
    } 
    catch (e){
        res.status(500).json({ exito: false, errores: [e.message]});
    }
});
//iniciar servidor
app.listen(PUERTO, ()=> {
    console.log('');
    console.log('=====================================================');
    console.log('        AutoInfra API — Servidor iniciado');
    console.log('=====================================================');
    console.log(`       URL: http://localhost:${PUERTO}`);
    console.log(`        Health: GET http://localhost:${PUERTO}/api/health`);
    console.log('========================================================');
    console.log('');
});