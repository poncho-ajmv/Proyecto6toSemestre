// ConfigProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import ProgressBar from 'react-bootstrap/ProgressBar';

const ConfigProfile = () => {
    const { user, setUser } = useAuth();
    const [mascotas, setMascotas] = useState([]);
    const [metas, setMetas] = useState([]);
    const [tareas, setTareas] = useState([]);

    // Cargar datos del usuario
    useEffect(() => {
        if (!user) {
            axios.get('http://localhost:5000/usuario')
                .then(response => setUser(response.data))
                .catch(error => console.error('Error al cargar los datos del usuario:', error));
        }
    }, [user, setUser]);

    // Cargar mascotas y metas
    useEffect(() => {
        if (user) {
            axios.get('http://localhost:5000/mascotas')
                .then(response => {
                    const mascotasDelUsuario = response.data.filter(mascota => mascota.id_usuario === user.id_usuario);
                    setMascotas(mascotasDelUsuario);
                    if (mascotasDelUsuario.length > 0) {
                        fetchMetas(mascotasDelUsuario);
                    }
                })
                .catch(error => console.error('Error al cargar las mascotas:', error));
        }
    }, [user]);

    // Cargar tareas
    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:5000/tareas-pendientes/${user.id_usuario}`)
                .then(response => setTareas(response.data))
                .catch(error => console.error('Error al cargar las tareas:', error));
        }
    }, [user]);

    // Obtener metas para cada mascota
    const fetchMetas = async (mascotas) => {
        const allMetas = await Promise.all(
            mascotas.map(async (mascota) => {
                try {
                    const response = await fetch(`http://localhost:5000/metas/${mascota.id_mascota}`);
                    const metasMascota = await response.json();
                    return { mascota, metas: metasMascota };
                } catch (error) {
                    console.error('Error al obtener metas:', error);
                    return { mascota, metas: [] };
                }
            })
        );
        setMetas(allMetas);
    };

    const eliminarTarea = async (idTarea) => {
        try {
            const response = await axios.delete(`http://localhost:5000/eliminar-tarea/${idTarea}`);
            if (response.status === 200) {
                setTareas(tareas.filter(tarea => tarea.id_tarea !== idTarea));
            }
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
        }
    };

    const completarTarea = async (idTarea) => {
        try {
            const response = await axios.put(`http://localhost:5000/completar-tarea/${idTarea}`);
            if (response.status === 200) {
                setTareas(tareas.map(tarea => 
                    tarea.id_tarea === idTarea ? { ...tarea, completado: true } : tarea
                ));
            }
        } catch (error) {
            console.error('Error al completar la tarea:', error);
        }
    };

    const getProgressBar = (fechaInicio, completado) => {
        const today = new Date();
        const startDate = new Date(fechaInicio);
        if (completado) {
            return <ProgressBar now={100} label="Completado" variant="success" />;
        } else if (startDate < today) {
            return <ProgressBar now={100} label="Fecha pasada" variant="danger" />;
        } else {
            return <ProgressBar now={0} label="Pendiente" />;
        }
    };

    const getProfileImage = () => {
        if (typeof user?.foto_perfil === 'string') {
            if (user.foto_perfil.startsWith('data:image/jpeg;base64,') || user.foto_perfil.startsWith('data:image/png;base64,')) {
                return user.foto_perfil;
            }
        }
        return null;
    };

    return (
        <div className="container my-4">
            <h1 className="text-center mb-4">Información del Perfil</h1>

            {/* Información del usuario */}
            <section className="card mb-4">
                <div className="card-header">
                    <h2>Datos del Usuario</h2>
                </div>
                <div className="card-body">
                    <div className="d-flex justify-content-center mb-3">
                        {getProfileImage() ? (
                            <img src={getProfileImage()} alt={user.nombre_completo} className="rounded-circle" style={{ width: '100px' }} />
                        ) : (
                            <FaUserCircle size={100} color="#aaa" />
                        )}
                    </div>
                    <p><strong>Nombre Completo:</strong> {user.nombre_completo}</p>
                    <p><strong>Nickname:</strong> {user.nickname}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Teléfono:</strong> {user.telefono}</p>
                </div>
            </section>

            {/* Información de las mascotas */}
            <section className="card mb-4">
                <div className="card-header">
                    <h2>Mis Mascotas</h2>
                </div>
                <div className="card-body">
                    {mascotas.length > 0 ? (
                        <ul className="list-group list-group-flush">
                            {mascotas.map(mascota => (
                                <li key={mascota.id_mascota} className="list-group-item">
                                    <strong>ID Mascota:</strong> {mascota.id_mascota} <br />
                                    <strong>Nombre Mascota:</strong> {mascota.nombre_mascota} <br />
                                    <strong>Edad:</strong> {mascota.edad} años <br />
                                    <strong>Peso:</strong> {mascota.peso} kg <br />
                                    <strong>Raza:</strong> {mascota.raza} <br />
                                    {mascota.foto_perfil && (
                                        <img
                                            src={`data:image/jpeg;base64,${mascota.foto_perfil}`}
                                            alt={`Foto de ${mascota.nombre_mascota}`}
                                            className="rounded-circle mt-2"
                                            style={{ width: '100px' }}
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted">No tienes mascotas registradas.</p>
                    )}
                </div>
            </section>
        {/* Información de las metas para todas las mascotas */}
        <section className="card mb-4">
                <div className="card-header">
                    <h2>Metas Actuales para todas las Mascotas</h2>
                </div>
                <div className="card-body">
                    {metas.length === 0 ? (
                        <p className="text-muted">No hay metas para tus mascotas.</p>
                    ) : (
                        metas.map(({ mascota, metas }) => (
                            <div key={mascota.id_mascota} className="mb-4">
                                <h3>{mascota.nombre_mascota}</h3>
                                <ul className="list-group">
                                    {metas.length === 0 ? (
                                        <li className="list-group-item text-muted">
                                            No hay metas para esta mascota.
                                        </li>
                                    ) : (
                                        metas.map((meta) => (
                                            <li key={meta.id_meta} className="list-group-item">
                                                <strong>Descripción:</strong> {meta.descripcion} <br />
                                                <strong>Frecuencia:</strong> {meta.frecuencia} <br />
                                                <strong>Fecha:</strong> {meta.fecha} <br />
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Sección de Tareas Actuales */}
            <section className="card mb-4">
                <div className="card-header">
                    <h2>Tareas Actuales</h2>
                </div>
                <div className="card-body">
                    {tareas.length > 0 ? (
                        <ul className="list-group list-group-flush">
                            {tareas.map(tarea => (
                                <li key={tarea.id_tarea} className="list-group-item">
                                    <strong>Nombre Tarea:</strong> {tarea.nombre_tarea} <br />
                                    <strong>Descripción:</strong> {tarea.descripcion} <br />
                                    <strong>Fecha de Inicio:</strong> {tarea.fecha_inicio} <br />
                                    <strong>Frecuencia:</strong> {tarea.frecuencia} <br />
                                    <strong>Completado:</strong> {tarea.completado ? 'Sí' : 'No'} <br />
                                    {getProgressBar(tarea.fecha_inicio, tarea.completado)}
                                    
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted">No tienes tareas registradas.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ConfigProfile;
