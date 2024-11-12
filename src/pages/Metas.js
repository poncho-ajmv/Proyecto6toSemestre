// src/components/Metas.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Metas = () => {
    const { user } = useAuth();
    const [metas, setMetas] = useState([]);
    const [descripcion, setDescripcion] = useState('');
    const [frecuencia, setFrecuencia] = useState('diaria');
    const [fecha, setFecha] = useState('');
    const [selectedMascota, setSelectedMascota] = useState('');
    const [mascotas, setMascotas] = useState([]);

    // Efecto para cargar las mascotas y actualizar metas
    useEffect(() => {
        if (user) {
            fetchMascotas();
        }
    }, [user]);

    // Efecto para cargar las metas de la mascota seleccionada
    useEffect(() => {
        if (selectedMascota) {
            fetchMetas();
        } else {
            setMetas([]);
        }
    }, [selectedMascota]);

    // Obtener lista de mascotas del usuario
    const fetchMascotas = async () => {
        try {
            const response = await fetch(`http://localhost:5000/mascotas/${user.id_usuario}`);
            const data = await response.json();
            setMascotas(data);
            if (data.length > 0) {
                setSelectedMascota(data[0].id_mascota); // Seleccionar la primera mascota por defecto
            }
        } catch (error) {
            console.error('Error al obtener mascotas:', error);
        }
    };

    // Obtener metas de la mascota seleccionada
    const fetchMetas = async () => {
        try {
            const response = await fetch(`http://localhost:5000/metas/${selectedMascota}`);
            const data = await response.json();
            setMetas(data);
        } catch (error) {
            console.error('Error al obtener metas:', error);
        }
    };

    // Manejar la creación de una nueva meta
    const handleAddMeta = async (e) => {
        e.preventDefault();
        if (!selectedMascota) {
            alert('Por favor, selecciona una mascota para asignar la meta.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/metas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    descripcion,
                    frecuencia,
                    fecha,
                    id_usuario: user.id_usuario,
                    id_mascota: selectedMascota,
                }),
            });

            if (response.ok) {
                fetchMetas();
                setDescripcion('');
                setFrecuencia('diaria');
                setFecha('');
                alert('Meta agregada exitosamente');
            } else {
                alert('Error al agregar la meta');
            }
        } catch (error) {
            console.error('Error en la conexión:', error);
        }
    };

    // Manejar la eliminación de una meta (completar meta)
    const handleCompleteMeta = async (id_meta) => {
        try {
            const response = await fetch(`http://localhost:5000/eliminarmetas/${id_meta}`, {
                method: 'DELETE',
            });
    
            // Mostrar detalles de la respuesta en la consola
            console.log(`Status: ${response.status}`);
            console.log('Respuesta del servidor:', response);
    
            if (response.ok) {
                alert('Meta completada y eliminada exitosamente');
                fetchMetas(); // Refresca la lista de metas
            } else {
                const errorData = await response.json();
                console.error('Error al completar la meta:', errorData);
                alert(`Error al completar la meta: ${errorData.error || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error en la conexión:', error);
            alert('Error en la conexión al servidor');
        }
    };
    

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <h2>Crear Nueva Meta</h2>
                    <form onSubmit={handleAddMeta}>
                        <div className="mb-3">
                            <label className="form-label">Mascota:</label>
                            <select
                                className="form-select"
                                value={selectedMascota}
                                onChange={(e) => setSelectedMascota(e.target.value)}
                            >
                                <option value="">Selecciona una mascota</option>
                                {mascotas.map((mascota) => (
                                    <option key={mascota.id_mascota} value={mascota.id_mascota}>
                                        {mascota.nombre_mascota}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Descripción:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Frecuencia:</label>
                            <select
                                className="form-select"
                                value={frecuencia}
                                onChange={(e) => setFrecuencia(e.target.value)}
                            >
                                <option value="diaria">Diaria</option>
                                <option value="semanal">Semanal</option>
                                <option value="mensual">Mensual</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Fecha:</label>
                            <input
                                type="date"
                                className="form-control"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">Agregar Meta</button>
                    </form>
                </div>
                <div className="col-md-6">
                    <h2>Metas Actuales</h2>
                    {metas.length === 0 ? (
                        <p>No hay metas para la mascota seleccionada.</p>
                    ) : (
                        <ul className="list-group">
                            {metas.map((meta) => (
                                <li key={meta.id_meta} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>Descripción:</strong> {meta.descripcion} <br />
                                        <strong>Frecuencia:</strong> {meta.frecuencia} <br />
                                        <strong>Fecha:</strong> {meta.fecha} <br />
                                    </div>
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleCompleteMeta(meta.id_meta)}
                                    >
                                        Completar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Metas;
