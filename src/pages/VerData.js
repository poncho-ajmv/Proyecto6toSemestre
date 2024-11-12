import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ConfigProfile = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [mascotas, setMascotas] = useState([]);
    const [tareas, setTareas] = useState([]);
    const [metas, setMetas] = useState([]);

    // Obtener datos de las tablas
    useEffect(() => {
        axios.get('http://localhost:5000/usuarios')
            .then(response => setUsuarios(response.data))
            .catch(error => console.error('Error:', error));

        axios.get('http://localhost:5000/mascotas')
            .then(response => setMascotas(response.data))
            .catch(error => console.error('Error:', error));

        axios.get('http://localhost:5000/tareas')
            .then(response => setTareas(response.data))
            .catch(error => console.error('Error:', error));

        axios.get('http://localhost:5000/metas')
            .then(response => setMetas(response.data))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <div>
            <h1>Información de la Base de Datos de Mascotas</h1>

            <section>
                <h2>Usuarios</h2>
                <ul>
                    {usuarios.map(usuario => (
                        <li key={usuario.id_usuario}>
                            <strong>Nombre Completo:</strong> {usuario.nombre_completo} <br />
                            <strong>Nickname:</strong> {usuario.nickname} <br />
                            <strong>Email:</strong> {usuario.email} <br />
                            <strong>Teléfono:</strong> {usuario.telefono} <br />
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Mascotas</h2>
                <ul>
                    {mascotas.map(mascota => (
                        <li key={mascota.id_mascota}>
                            <strong>Nombre Mascota:</strong> {mascota.nombre_mascota} <br />
                            <strong>Edad:</strong> {mascota.edad} años <br />
                            <strong>Peso:</strong> {mascota.peso} kg <br />
                            <strong>Raza:</strong> {mascota.raza} <br />
                            <strong>ID Usuario:</strong> {mascota.id_usuario} <br />
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Tareas</h2>
                <ul>
                    {tareas.map(tarea => (
                        <li key={tarea.id_tarea}>
                            <strong>Nombre Tarea:</strong> {tarea.nombre_tarea} <br />
                            <strong>Descripción:</strong> {tarea.descripcion} <br />
                            <strong>Fecha Inicio:</strong> {tarea.fecha_inicio} <br />
                            <strong>Frecuencia:</strong> {tarea.frecuencia} <br />
                            <strong>Completado:</strong> {tarea.completado ? 'Sí' : 'No'} <br />
                            <strong>ID Mascota:</strong> {tarea.id_mascota} <br />
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Metas</h2>
                <ul>
                    {metas.map(meta => (
                        <li key={meta.id_meta}>
                            <strong>Descripción:</strong> {meta.descripcion} <br />
                            <strong>Frecuencia:</strong> {meta.frecuencia} <br />
                            <strong>Fecha:</strong> {meta.fecha} <br />
                            <strong>ID Usuario:</strong> {meta.id_usuario} <br />
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default ConfigProfile;
