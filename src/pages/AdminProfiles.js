import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateUser from './UpdateUser';
import { Container, Form, Button, Card, Table } from 'react-bootstrap';

const AdminProfiles = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedMascota, setSelectedMascota] = useState(null);
    const [selectedMeta, setSelectedMeta] = useState(null);
    const [selectedTarea, setSelectedTarea] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const usuariosResponse = await axios.get('http://localhost:5000/usuarios');
            const mascotasResponse = await axios.get('http://localhost:5000/mascotas');
            const metasResponse = await axios.get('http://localhost:5000/vermetas');
            const tareasResponse = await axios.get('http://localhost:5000/vertareas');

            const usuariosData = usuariosResponse.data;
            const mascotasData = mascotasResponse.data;
            const metasData = metasResponse.data;
            const tareasData = tareasResponse.data;

            setTareas(tareasData);

            const mascotasConDetalles = mascotasData.map(mascota => ({
                ...mascota,
                metas: metasData.filter(meta => meta.id_mascota === mascota.id_mascota),
            }));

            const usuariosConMascotas = usuariosData.map(usuario => ({
                ...usuario,
                mascotas: mascotasConDetalles.filter(mascota => mascota.id_usuario === usuario.id_usuario)
            }));

            setUsuarios(usuariosConMascotas);
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar los datos:', err);
            setError('Hubo un problema al cargar los datos.');
            setLoading(false);
        }
    };

    const handleEditUser = (usuario) => {
        setSelectedUser(usuario);
        setSelectedMascota(null);
        setSelectedMeta(null);
    };

    const handleEditTarea = (tarea) => {
        setSelectedTarea(tarea);
        setSelectedUser(null);
        setSelectedMascota(null);
        setSelectedMeta(null);
    };

    const handleDeleteTask = async (id_tarea) => {
        try {
            await axios.delete(`http://localhost:5000/eliminartarea/${id_tarea}`);
            alert('Tarea eliminada exitosamente');
            fetchData();
        } catch (error) {
            console.error('Error en la conexión al eliminar la tarea:', error);
            alert('Error en la conexión al servidor');
        }
    };

    const handleEditMascota = (mascota) => {
        setSelectedMascota(mascota);
        setSelectedUser(null);
        setSelectedMeta(null);
    };

    const handleEditMeta = (meta) => {
        setSelectedMeta(meta);
        setSelectedUser(null);
        setSelectedMascota(null);
    };

    const handleUpdateUserSuccess = () => {
        fetchData();
        setSelectedUser(null);
    };

    const handleUpdateMascotaSuccess = () => {
        fetchData();
        setSelectedMascota(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedMascota({
                ...selectedMascota,
                foto_perfil: reader.result.replace("data:image/jpeg;base64,", "").replace("data:image/png;base64,", "")
            });
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleMascotaSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/update-mascota/${selectedMascota.id_mascota}`, {
                nombre_mascota: selectedMascota.nombre_mascota,
                edad: selectedMascota.edad,
                peso: selectedMascota.peso,
                tipo_animal: selectedMascota.tipo_animal,
                raza: selectedMascota.raza,
                foto_perfil: selectedMascota.foto_perfil
            });
            alert('Mascota actualizada con éxito');
            handleUpdateMascotaSuccess();
        } catch (error) {
            console.error('Error al actualizar la mascota:', error);
            setError('Error al actualizar la mascota');
        }
    };

    const handleMetaSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/update-meta/${selectedMeta.id_meta}`, {
                descripcion: selectedMeta.descripcion,
                frecuencia: selectedMeta.frecuencia,
                fecha: selectedMeta.fecha,
            });
            alert('Meta actualizada con éxito');
            fetchData();
            setSelectedMeta(null);
        } catch (error) {
            console.error('Error al actualizar la meta:', error);
            setError('Error al actualizar la meta');
        }
    };

    const handleDeleteMeta = async (id_meta) => {
        try {
            const response = await axios.delete(`http://localhost:5000/eliminarmetas/${id_meta}`);
            if (response.status === 200) {
                alert('Meta eliminada exitosamente');
                fetchData();
            } else {
                console.error('Error al eliminar la meta:', response);
                alert('Error al eliminar la meta');
            }
        } catch (error) {
            console.error('Error en la conexión al eliminar la meta:', error);
            alert('Error en la conexión al servidor');
        }
    };

    const convertBase64ToImage = (base64String) => {
        return `data:image/jpeg;base64,${base64String}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    if (loading) return <div className="container"><p>Cargando información...</p></div>;
    if (error) return <div className="container"><p className="text-danger">{error}</p></div>;

    return (
        <Container>
            <h1>Información de la Base de Datos de Mascotas</h1>

            <section className="mb-4">
                <h2>Usuarios</h2>
                <ul className="list-group">
                    {usuarios.map(usuario => (
                        <li key={usuario.id_usuario} className="list-group-item">
                            <div>
                                {usuario.foto_perfil && (
                                    <img
                                        src={convertBase64ToImage(usuario.foto_perfil)}
                                        alt={`Foto de ${usuario.nombre_completo}`}
                                        width="50"
                                        height="50"
                                        className="rounded-circle me-2"
                                    />
                                )}
                                <strong>ID Usuario:</strong> {usuario.id_usuario} <br />
                                <strong>Nombre Completo:</strong> {usuario.nombre_completo} <br />
                                <strong>Nickname:</strong> {usuario.nickname} <br />
                                <strong>Email:</strong> {usuario.email} <br />
                                <strong>Teléfono:</strong> {usuario.telefono} <br />
                                <strong>Administrador:</strong> {usuario.es_administrador ? 'Sí' : 'No'} <br />

                                
                                <button
                                    className="btn btn-primary mt-2"
                                    onClick={() => handleEditUser(usuario)}
                                >
                                    Editar Usuario
                                </button>

                                {usuario.mascotas.map(mascota => (
                                    <div key={mascota.id_mascota} className="mt-3">
                                        {mascota.foto_perfil && (
                                                        <img
                                                            src={convertBase64ToImage(mascota.foto_perfil)}
                                                            alt={`Foto de ${mascota.nombre_mascota}`}
                                                            width="50"
                                                            height="50"
                                                            className="rounded-circle me-2"
                                                        />
                                                    )}
                                                    <strong>ID Mascota:</strong> {mascota.id_mascota} <br />
                                                    <strong>Nombre Mascota:</strong> {mascota.nombre_mascota} <br />
                                                    <strong>Edad:</strong> {mascota.edad} años <br />
                                                    <strong>Peso:</strong> {mascota.peso} kg <br />
                                                    <strong>Raza:</strong> {mascota.raza} <br />
                                                
                                                
                                        <button
                                            className="btn btn-secondary mt-2"
                                            onClick={() => handleEditMascota(mascota)}
                                        >
                                            Editar Mascota
                                        </button>

                                        {/* Metas de la Mascota */}
                                        <div className="mt-2">
                                            <h5>Metas</h5>
                                            {mascota.metas.length > 0 ? (
                                                <ul className="list-group">
                                                    {mascota.metas.map(meta => (
                                                        <li key={meta.id_meta} className="list-group-item d-flex justify-content-between align-items-center">
                                                            <div>
                                                                <strong>ID:</strong> {meta.id_meta} <br />
                                                                <strong>Meta:</strong> {meta.descripcion} <br />
                                                                <strong>Frecuencia:</strong> {meta.frecuencia} <br />
                                                                <strong>Fecha:</strong> {formatDate(meta.fecha)} <br />
                                                            </div>
                                                            <button
                                                                className="btn btn-warning btn-sm me-2"
                                                                onClick={() => handleEditMeta(meta)}
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => handleDeleteMeta(meta.id_meta)}
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No hay metas registradas.</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
            
            {/* Sección de Tareas */}
            <section className="mt-5">
                <h2>Lista de Tareas</h2>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID Tarea</th>
                            <th>Tarea</th>
                            <th>Descripción</th>
                            <th>Frecuencia</th>
                            <th>Fecha y Hora</th>
                            <th>Usuario</th>
                            <th>Email Usuario</th>
                            <th>Mascota</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tareas.map(tarea => (
                            <tr key={tarea.id_tarea}>
                                <td>{tarea.id_tarea}</td>
                                <td>{tarea.nombre_tarea}</td>
                                <td>{tarea.descripcion}</td>
                                <td>{tarea.frecuencia}</td>
                                <td>{formatDateTime(tarea.fecha_inicio)}</td>
                                <td>{tarea.nombre_usuario}</td>
                                <td>{tarea.email}</td>
                                <td>{tarea.nombre_mascota}</td>
                                <td>
                                    y
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="ms-2"
                                        onClick={() => handleDeleteTask(tarea.id_tarea)}
                                    >
                                        Eliminar
                                    </Button>
                                </td>
                                
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </section>


            {selectedUser && (
                <UpdateUser user={selectedUser} onSuccess={handleUpdateUserSuccess} />
            )}

            {selectedMascota && (
                <Card className="shadow-sm border-0 mt-5">
                    <Card.Body>
                        <h2 className="text-center text-primary mb-4">Editar Mascota</h2>
                        <Form onSubmit={handleMascotaSubmit}>
                            <Form.Group controlId="nombreMascota" className="mb-3">
                                <Form.Label>Nombre Mascota</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedMascota.nombre_mascota}
                                    onChange={(e) => setSelectedMascota({ ...selectedMascota, nombre_mascota: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="edad" className="mb-3">
                                <Form.Label>Edad</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={selectedMascota.edad}
                                    onChange={(e) => setSelectedMascota({ ...selectedMascota, edad: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="peso" className="mb-3">
                                <Form.Label>Peso</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.1"
                                    value={selectedMascota.peso}
                                    onChange={(e) => setSelectedMascota({ ...selectedMascota, peso: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="tipoAnimal" className="mb-3">
                                <Form.Label>Tipo de Animal</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedMascota.tipo_animal}
                                    onChange={(e) => setSelectedMascota({ ...selectedMascota, tipo_animal: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="raza" className="mb-3">
                                <Form.Label>Raza</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedMascota.raza}
                                    onChange={(e) => setSelectedMascota({ ...selectedMascota, raza: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="fotoPerfil" className="mb-3">
                                <Form.Label>Foto de Perfil</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleImageChange}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100 mt-3">
                                Guardar Cambios
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            )}

            {selectedMeta && (
                <Card className="shadow-sm border-0 mt-5">
                    <Card.Body>
                        <h2 className="text-center text-primary mb-4">Editar Meta</h2>
                        <Form onSubmit={handleMetaSubmit}>
                            <Form.Group controlId="descripcionMeta" className="mb-3">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedMeta.descripcion}
                                    onChange={(e) => setSelectedMeta({ ...selectedMeta, descripcion: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="frecuenciaMeta" className="mb-3">
                                <Form.Label>Frecuencia</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={selectedMeta.frecuencia}
                                    onChange={(e) => setSelectedMeta({ ...selectedMeta, frecuencia: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="fechaMeta" className="mb-3">
                                <Form.Label>Fecha</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={selectedMeta.fecha}
                                    onChange={(e) => setSelectedMeta({ ...selectedMeta, fecha: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100 mt-3">
                                Guardar Cambios
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default AdminProfiles;
