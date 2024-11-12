// src/components/GaleriaMascotas.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';


const GaleriaMascotas = () => {
    const [imagenes, setImagenes] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [imagenAmpliada, setImagenAmpliada] = useState(null);
    const imagenRefs = useRef([]);

    const PEXELS_API_KEY = 'pC6o1u6zUq39HDTlDQ54xdphF4z8rjpKnaqPdJlU1O92jD0BfGV8ydIV';
    const URL = `https://api.pexels.com/v1/search?query=pets&per_page=27&page=${paginaActual}`;

    useEffect(() => {
        const obtenerImagenes = async () => {
            setCargando(true);
            try {
                const respuesta = await axios.get(URL, {
                    headers: {
                        Authorization: PEXELS_API_KEY,
                    },
                });
                setImagenes(respuesta.data.photos);
                setCargando(false);
            } catch (err) {
                setError('No se pudieron cargar las imágenes');
                setCargando(false);
            }
        };
        obtenerImagenes();
    }, [paginaActual]);

    useEffect(() => {
        const URL = `https://api.pexels.com/v1/search?query=pets&per_page=27&page=${paginaActual}`;
        const obtenerImagenes = async () => {
            setCargando(true);
            try {
                const respuesta = await axios.get(URL, {
                    headers: {
                        Authorization: PEXELS_API_KEY,
                    },
                });
                setImagenes(respuesta.data.photos);
                setCargando(false);
            } catch (err) {
                setError('No se pudieron cargar las imágenes');
                setCargando(false);
            }
        };
        obtenerImagenes();
    }, [paginaActual]); // Aquí quitamos URL de las dependencias
    

    const handleImagenClick = (imagen) => {
        setImagenAmpliada(imagen);
    };

    const cerrarModal = () => {
        setImagenAmpliada(null);
    };

    const handlePaginaAnterior = () => {
        setPaginaActual((prevPagina) => Math.max(prevPagina - 1, 1));
    };

    const handlePaginaSiguiente = () => {
        setPaginaActual((prevPagina) => prevPagina + 1);
    };

    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Galería de Imágenes de Mascotas</h2>

            {cargando ? (
                <div className="spinner"></div> // Spinner de carga
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    {imagenes.map((imagen, index) => (
                        <div key={imagen.id} onClick={() => handleImagenClick(imagen)} style={{ cursor: 'pointer' }}>
                            <img
                                src={imagen.src.tiny}
                                data-src={imagen.src.medium}
                                alt={imagen.alt}
                                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                                ref={(el) => (imagenRefs.current[index] = el)}
                            />
                            <p>{imagen.photographer}</p>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                <button
                    onClick={handlePaginaAnterior}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}
                >
                    Anterior
                </button>
                <button
                    onClick={handlePaginaSiguiente}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Siguiente
                </button>
            </div>

            {imagenAmpliada && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                    onClick={cerrarModal}
                >
                    <div style={{ position: 'relative' }}>
                        <img src={imagenAmpliada.src.large} alt={imagenAmpliada.alt} style={{ width: '90vw', maxHeight: '80vh', borderRadius: '8px' }} />
                        <button
                            onClick={cerrarModal}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                backgroundColor: 'transparent',
                                color: '#fff',
                                fontSize: '24px',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GaleriaMascotas;
