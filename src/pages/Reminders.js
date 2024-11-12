import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import ProgressBar from 'react-bootstrap/ProgressBar';

const ProfileAndReminders = () => {
    const { user } = useAuth();
    const [tareas, setTareas] = useState([]);
    const [nombreTarea, setNombreTarea] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [frecuencia, setFrecuencia] = useState('');
    const [idMascota, setIdMascota] = useState('');
    const [mascotas, setMascotas] = useState([]);

    // Cargar tareas del usuario
    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:5000/tareas-pendientes/${user.id_usuario}`)
                .then(response => setTareas(response.data))
                .catch(error => console.error('Error al cargar las tareas:', error));
        }
    }, [user]);

    // Cargar mascotas del usuario
    useEffect(() => {
        const fetchMascotas = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/mascotas/${user?.id_usuario}`);
                setMascotas(response.data);
            } catch (error) {
                console.error('Error al obtener mascotas del usuario:', error);
            }
        };

        if (user?.id_usuario) {
            fetchMascotas();
        }
    }, [user]);

    const eliminarTarea = async (idTarea) => {
        try {
            const response = await axios.delete(`http://localhost:5000/eliminar-tarea/${idTarea}`);
            if (response.status === 200) {
                setTareas(tareas.filter(tarea => tarea.id_tarea !== idTarea));
            } else {
                console.error('Error al eliminar la tarea');
            }
        } catch (error) {
            console.error('Error en la conexión:', error);
        }
    };


    // Manejar el envío de nuevo recordatorio
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/add-reminder', {
                nombre_tarea: nombreTarea,
                descripcion,
                fecha_inicio: fechaInicio,
                frecuencia,
                id_mascota: idMascota || null,
                id_usuario: user.id_usuario,
            });

            if (response.status === 201) {
                alert('Recordatorio agregado exitosamente');
                setNombreTarea('');
                setDescripcion('');
                setFechaInicio('');
                setFrecuencia('');
                setIdMascota('');
                setTareas([...tareas, response.data]); // Actualizar lista de tareas
            } else {
                console.error('Error al agregar recordatorio');
            }
        } catch (error) {
            console.error('Error en la conexión:', error);
        }
    };

    // Marcar una tarea como completada y eliminarla
    const completarTarea = async (idTarea) => {
        try {
            const response = await axios.put(`http://localhost:5000/completar-tarea/${idTarea}`);
            if (response.status === 200) {
                setTareas(tareas.map(tarea => 
                    tarea.id_tarea === idTarea ? { ...tarea, completado: true } : tarea
                ));
            } else {
                console.error('Error al completar la tarea');
            }
        } catch (error) {
            console.error('Error en la conexión:', error);
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

    return (
        <div className="container my-4">

            <div className="container my-4">
            <h1 className="text-center mb-4">Información del Perfil y Tareas</h1>

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
                                    {!tarea.completado ? (
                                        <button 
                                            className="btn btn-success mt-2" 
                                            onClick={() => completarTarea(tarea.id_tarea)}
                                        >
                                            Completar Tarea
                                        </button>
                                    ) : (
                                        <button 
                                            className="btn btn-danger mt-2" 
                                            onClick={() => eliminarTarea(tarea.id_tarea)}
                                        >
                                            Eliminar Tarea
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted">No tienes tareas registradas.</p>
                    )}
                </div>
            </section>
        </div>

            {/* Formulario para agregar nuevo recordatorio */}
            <section className="card mb-4">
                <div className="card-header text-center">
                    <h2>Agregar Recordatorio</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nombre de la Tarea:</label>
                            <input
                                type="text"
                                className="form-control"
                                value={nombreTarea}
                                onChange={(e) => setNombreTarea(e.target.value)}
                                placeholder="Ingresa el nombre de la tarea"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Descripción:</label>
                            <textarea
                                className="form-control"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                placeholder="Descripción de la tarea"
                                required
                            ></textarea>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Fecha de Inicio:</label>
                            <input
                                type="date"
                                className="form-control"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Frecuencia:</label>
                            <select
                                className="form-control"
                                value={frecuencia}
                                onChange={(e) => setFrecuencia(e.target.value)}
                                required
                            >
                                <option value="">Selecciona la frecuencia</option>
                                <option value="Diario">Diario</option>
                                <option value="Semanal">Semanal</option>
                                <option value="Mensual">Mensual</option>
                                <option value="Anual">Anual</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Mascota:</label>
                            <select
                                className="form-control"
                                value={idMascota || ''}
                                onChange={(e) => setIdMascota(e.target.value)}
                                required
                            >
                                <option value="">Selecciona una mascota</option>
                                {mascotas.map((mascota) => (
                                    <option key={mascota.id_mascota} value={mascota.id_mascota}>
                                        {mascota.nombre_mascota}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Agregar Recordatorio</button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default ProfileAndReminders;
