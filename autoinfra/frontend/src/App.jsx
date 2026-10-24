import {useState, useRef} from 'react';
import Editor from '@monaco-editor/react';
import { ejecutar}from'./services/api';

const CODIGO_INICIAL= `server backend {
    cpu = 4;
    memory= 8;
    disk = 100;
    os= "ubuntu";
}

service api{
    port = 8080;
    replicas = 2;
}

main{
    start(backend);
    deploy(backend, api);
    print("Hola desde AutoInfra");
}
`;

function App(){
    const [codigo, setCodigo] =useState(CODIGO_INICIAL);
    const [resultado, setResultado] = useState(null);
    const [cargando, setCargando]= useState(false);
    const [error, setError]=useState(null);

    const fileInputRef = useRef(null);

    //Funciones de archivo 
    const nuevoArchivo =()=>{
        if (window.confirm('¿Estás seguro de crear un nuevo archivo? Se perderán los cambios no guardados.')) {
            setCodigo('');
            setResultado(null);
            setError(null);
        }
    };

    const abrirArchivo= (event) => {
        const file =event.target.files[0];
        if (!file) {
          return;
        }
        
        const reader= new FileReader();
        reader.onload= (e)=> {
            setCodigo(e.target.result);
            setResultado(null);
            setError(null);
        };
        reader.readAsText(file);
        event.target.value= null;
    };

    const guardarArchivo = ()=>{
        const blob = new Blob([codigo], { type: 'text/plain' });
        const url= URL.createObjectURL(blob);
        const a= document.createElement('a');
        a.href = url;
        a.download='codigo.infra';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };


    //ejecucion código llamando a la API
    async function ejecutarCodigo() {
        setCargando(true);
        setError(null);
        try{
            const datos =await ejecutar(codigo);
            setResultado(datos);
        } 
        catch (e){
            setError('Error de coneión con el servidor: ' + e.message);
        } 
        finally {
            setCargando(false);
        }
    }

    return(
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/*Barra superior */}
            <header style={{
                padding: '10px 20px',
                background:'#252526',
                borderBottom: '1px solid #3c3c3c',
                display:'flex',
                justifyContent: 'space-between',
                alignItems:'center',
            }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <h1 style={{fontSize: '18px', color: '#4ec9b0', margin: 0}}>
                        AutoInfra <span style={{ fontSize: '12px', color: '#888' }}>v1.0</span>
                    </h1>
                    
                    {/* Herramientas de archivo */}
                    <div style={{display: 'flex', gap: '8px', borderLeft: '1px solid #555', paddingLeft: '20px' }}>
                        <button onClick={nuevoArchivo} style={estiloBotonSecundario}>Nuevo</button>
                        <button onClick={()=>fileInputRef.current.click()} style={estiloBotonSecundario}>Abrir</button>
                        <button onClick={guardarArchivo} style={estiloBotonSecundario}>Guardar</button>
                        
                        {/*Input oculto para abrir achivos*/}
                        <input 
                            type="file" 
                            accept=".infra" 
                            ref={fileInputRef} 
                            onChange={abrirArchivo} 
                            style={{display: 'none'}} 
                        />
                    </div>
                </div>
                
                <button
                    onClick={ejecutarCodigo}
                    disabled={cargando}
                    style={{
                        padding: '8px 24px',
                        background: cargando ? '#555' : '#0e7a0d',
                        color: 'white',
                        border:'none',
                        borderRadius: '4px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor:cargando ? 'wait' : 'pointer',
                        transition: 'background 0.2s'
                    }}
                >
                    {cargando ? 'Ejecutando...' :'▶ Ejecutar'}
                </button>
            </header>

            {/* Contenido principal */}
            <div style={{ display:'flex', flex: 1, overflow: 'hidden' }}>

                <div style={{
                    width: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRight:'1px solid #3c3c3c',
                }}>
                    <div style={{
                        padding: '8px 12px',
                        background: '#252526',
                        fontSize: '12px',
                        color: '#888',
                        borderBottom: '1px solid #3c3c3c',
                        fontFamily: 'monospace'
                    }}>
                        editor.infra
                    </div>
                    <div style={{flex: 1}}>
                        <Editor
                            height="100%"
                            defaultLanguage="javascript" // Usamos javascript para tener resaltado base
                            theme="vs-dark"
                            value={codigo}
                            onChange={(value)=> setCodigo(value || '')}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontFamily: 'Consolas, "Courier New", monospace',
                                lineNumbers: 'on',
                                scrollBeyondLastLine: false,
                                automaticLayout: true, 
                                wordWrap: 'on',
                                tabSize: 4,
                            }}
                        />
                    </div>
                </div>

                {/*Panel derecho: Resultados*/}
                <div style={{ width: '50%', overflow: 'auto', padding: '16px', background: '#1e1e1e' }}>
                    {error &&(
                        <div style={{
                            padding: '12px',
                            background: '#5a1d1d',
                            border: '1px solid #a02020',
                            borderRadius: '4px',
                            marginBottom: '16px',
                            color:'#ffd2d2'
                        }}>
                            {error}
                        </div>
                    )}

                    {!resultado && !error &&(
                        <div style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>
                            <p>Presiona "Ejecutar" para ver los resultados aquí.</p>
                        </div>
                    )}

                    {resultado &&(
                        <>
                            <div style={{
                                padding:'10px 16px',
                                background: resultado.exito ? '#0e5020' : '#5a1d1d',
                                borderRadius: '4px',
                                marginBottom: '16px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                {resultado.exito ? ' Ejecución exitosa' : ' Ejecución con errores'}
                            </div>

                            <h3 style={{ fontSize: '14px', color: '#4ec9b0', marginTop: 0, marginBottom: '8px' }}>
                                Consola
                            </h3>
                            <pre style={{
                                padding: '12px',
                                background: '#0e0e0e',
                                borderRadius: '4px',
                                fontSize: '13px',
                                marginBottom: '16px',
                                whiteSpace: 'pre-wrap',
                                minHeight: '40px',
                                border: '1px solid #333',
                                fontFamily: 'monospace'
                            }}>
                                {resultado.consola.length === 0 ? '(vacía)' : resultado.consola.join('\n')}
                            </pre>

                            <h3 style={{ fontSize: '14px', color: '#4ec9b0', marginBottom: '8px' }}>
                                Errores ({resultado.errores.length})
                            </h3>
                            <pre style={{
                                padding: '12px',
                                background: '#0e0e0e',
                                borderRadius: '4px',
                                fontSize: '13px',
                                marginBottom: '16px',
                                whiteSpace: 'pre-wrap',
                                maxHeight: '200px',
                                overflow: 'auto',
                                border: '1px solid #333',
                                fontFamily: 'monospace',
                                color: resultado.errores.length > 0 ? '#ffd2d2' : '#d4d4d4'
                            }}>
                                {resultado.errores.length === 0
                                    ? 'Sin errores.'
                                    : resultado.errores.map(e =>
                                        `[${e.tipo} ${e.codigo}] ${e.descripcion} (L${e.linea}:C${e.columna})`
                                    ).join('\n')}
                            </pre>

                            <h3 style={{ fontSize: '14px', color: '#4ec9b0', marginBottom: '8px' }}>
                                Bitácora ({resultado.bitacora.length})
                            </h3>
                            <pre style={{
                                padding:'12px',
                                background: '#0e0e0e',
                                borderRadius: '4px',
                                fontSize:'13px',
                                marginBottom: '16px',
                                whiteSpace:'pre-wrap',
                                border: '1px solid #333',
                                fontFamily: 'monospace'
                            }}>
                                {resultado.bitacora.join('\n')}
                            </pre>

                            <h3 style={{ fontSize: '14px', color: '#4ec9b0', marginBottom: '8px' }}>
                                Infraestructura
                            </h3>
                            <pre style={{
                                padding: '12px',
                                background:'#0e0e0e',
                                borderRadius: '4px',
                                fontSize:'13px',
                                whiteSpace: 'pre-wrap',
                                border: '1px solid #333',
                                fontFamily: 'monospace',
                                color:'#9cdcfe'
                            }}>
                                {JSON.stringify(resultado.infraestructura, null, 2)}
                            </pre>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

//estilos reutilizables para no llenar el HTML de inline-styles y esas cosas feas xdddd
const estiloBotonSecundario={
    padding:'6px 12px',
    background: '#333',
    color: '#ccc',
    border: '1px solid #555',
    borderRadius: '4px',
    fontSize:'12px',
    cursor:'pointer',
    transition:'background 0.2s'
};

const estiloTitulo = {
    fontSize: '14px',
    color:'#4ec9b0',
    marginBottom: '8px',
    marginTop: 0
};
const estiloPre = {
    padding: '12px',
    background:'#0e0e0e',
    borderRadius: '4px',
    fontSize: '13px',
    marginBottom: '16px',
    whiteSpace: 'pre-wrap',
    maxHeight:'250px',
    overflow: 'auto',
    border:'1px solid #333',
    fontFamily: 'monospace'
};
export default App;