import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './CSS/Login.css';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/login', {
                email,
                pass: password
            });

            const usuarioEncontrado = response.data.user;
            if (usuarioEncontrado) {
                // Convertir la imagen a base64 si está presente
                console.log(usuarioEncontrado);
                //if (usuarioEncontrado.foto_perfil) {
                    //usuarioEncontrado.foto_perfil = `data:image/jpg;base64,${Buffer.from(usuarioEncontrado.foto_perfil, 'binary').toString('base64')}`;
                //}
                
                login(usuarioEncontrado);
                alert('Login exitoso');
                navigate('/welcome');
            } else {
                setError('Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error al autenticar:', error);
            setError('Error al ingresar usuario intentelo de nuevo');
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    return (
        <div className="login-body">
            <div className="login-container">
                <h1 className="login-title">Iniciar Sesión</h1>
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Ingresa tu correo"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ingresa tu contraseña"
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    <button type="submit" className="login-button">Iniciar Sesión</button>
                    <button onClick={handleRegisterRedirect} className="login-button">
                    Crear una cuenta
                </button>
                    
                </form>

                

                
            </div>
        </div>
    );
};

export default Login;
