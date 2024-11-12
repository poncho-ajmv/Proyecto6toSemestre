import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateUser = () => {
    const { user, setUser } = useAuth();
    const [name, setName] = useState(user?.nombre_completo || '');
    const [email, setEmail] = useState(user?.email || '');
    const [nickname, setNickname] = useState(user?.nickname || '');
    const [phone, setPhone] = useState(user?.telefono || '');
    const [profileImage, setProfileImage] = useState(null); // Nuevo estado para la imagen

    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImage(reader.result.split(',')[1]); // Convertimos la imagen a base64
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/update-user/${user.id_usuario}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    nombre_completo: name,
                    nickname,
                    telefono: phone,
                    foto_perfil: profileImage, // Añadimos la imagen en formato base64
                }),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                alert('Usuario actualizado exitosamente');
                navigate('/welcome');
            } else {
                console.error('Error al actualizar usuario');
            }
        } catch (error) {
            console.error('Error en la conexión:', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header text-center">
                            <h2>Actualizar Usuario</h2>
                        </div>
                        <div className="card-body">
                            {/* Mostrar la foto de perfil existente o la nueva */}
                            {user?.foto_perfil && !profileImage && (
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                    <img 
                                        src={`data:image/jpeg;base64,${user.foto_perfil}`} 
                                        alt={`Foto de perfil de ${user.nombre_completo}`} 
                                        style={{ width: '100px', borderRadius: '50%' }} 
                                    />
                                </div>
                            )}
                            {profileImage && (
                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                                    <img 
                                        src={`data:image/jpeg;base64,${profileImage}`} 
                                        alt="Nueva foto de perfil" 
                                        style={{ width: '100px', borderRadius: '50%' }} 
                                    />
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Nombre Completo:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Ingresa tu nombre completo"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Ingresa tu email"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Nickname:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        placeholder="Ingresa tu nickname"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Teléfono:</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Ingresa tu teléfono"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Foto de Perfil:</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Actualizar Usuario</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateUser;
