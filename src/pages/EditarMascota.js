import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'; // Importamos el contexto de autenticación

const EditarMascota = () => {
    const { user } = useAuth(); // Accedemos al usuario actual desde el contexto
    const [mascotas, setMascotas] = useState([]);
    const [tareas, setTareas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMascota, setSelectedMascota] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const mascotasResponse = await axios.get('http://localhost:5000/mascotas');
            const metasResponse = await axios.get('http://localhost:5000/vermetas');
            const tareasResponse = await axios.get('http://localhost:5000/vertareas');

            const mascotasData = mascotasResponse.data;
            const metasData = metasResponse.data;
            const tareasData = tareasResponse.data;

            setTareas(tareasData);

            // Filtrar solo las mascotas del usuario actual
            const mascotasConDetalles = mascotasData
                .filter(mascota => mascota.id_usuario === user.id_usuario)
                .map(mascota => ({
                    ...mascota,
                    metas: metasData.filter(meta => meta.id_mascota === mascota.id_mascota),
                }));

            setMascotas(mascotasConDetalles);
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar los datos:', err);
            setError('Hubo un problema al cargar los datos.');
            setLoading(false);
        }
    };

    const handleEditMascota = (mascota) => {
        setSelectedMascota(mascota);
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

    const handleSubmit = async (e) => {
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

    return (
        <Container className="my-5">
            <h1>Información de Mascotas del Usuario Actual</h1>

            <section className="mb-4">
                <h2>Mascotas</h2>
                <ul className="list-group">
                    {mascotas.map(mascota => (
                        <li key={mascota.id_mascota} className="list-group-item">
                            <strong>Nombre Mascota:</strong> {mascota.nombre_mascota} <br />
                            <button className="btn btn-secondary mt-2" onClick={() => handleEditMascota(mascota)}>
                                Editar Mascota
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            {selectedMascota && (
                <Card className="shadow-sm border-0 mt-5">
                    <Card.Body>
                        <h2 className="text-center text-primary mb-4">Editar Mascota</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="nombreMascota" className="mb-3">
                                <Form.Label>Nombre de la Mascota</Form.Label>
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
                                <Form.Label>Peso (kg)</Form.Label>
                                <Form.Control
                                    type="number"
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

                            <Form.Group controlId="foto" className="mb-3">
                                <Form.Label>Foto de la Mascota</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleImageChange}
                                />
                            </Form.Group>

                            {selectedMascota.foto_perfil && (
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                    <img
                                        src={`data:image/jpeg;base64,${selectedMascota.foto_perfil}`}
                                        alt={`Foto de ${selectedMascota.nombre_mascota}`}
                                        style={{ width: '100px', borderRadius: '50%' }}
                                    />
                                </div>
                            )}

                            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                            <Button variant="primary" type="submit" className="w-100">
                                Actualizar Mascota
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default EditarMascota;
