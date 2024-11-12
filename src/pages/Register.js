// Register.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './CSS/Register.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add('register-body');
        return () => {
            document.body.classList.remove('register-body');
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    nombre_completo: name,
                    nickname,
                    pass: password,
                    telefono: phone,
                }),
            });

            if (response.ok) {
                console.log('Registro exitoso');
                setName('');
                setEmail('');
                setNickname('');
                setPassword('');
                setPhone('');
                navigate('/'); // Redirigir a la página de inicio de sesión u otra página
            } else {
                console.error('Error en el registro');
            }
        } catch (error) {
            console.error('Error en la conexión:', error);
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-title">Registrarse</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <div className="input-group">
                    <label>Nombre Completo:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Ingresa tu nombre completo"
                        required 
                    />
                </div>
                <div className="input-group">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Ingresa tu email"
                        required 
                    />
                </div>
                <div className="input-group">
                    <label>Nickname:</label>
                    <input 
                        type="text" 
                        value={nickname} 
                        onChange={(e) => setNickname(e.target.value)} 
                        placeholder="Ingresa tu nickname"
                        required 
                    />
                </div>
                <div className="input-group">
                    <label>Teléfono:</label>
                    <input 
                        type="tel" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        placeholder="Ingresa tu teléfono"
                        required 
                    />
                </div>
                <div className="input-group">
                    <label>Contraseña:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Ingresa tu contraseña"
                        required 
                    />
                </div>
                <button type="submit" className="register-button">Registrarse</button>
            </form>
            <p className="login-link">
                ¿Ya tienes una cuenta? <Link to="/">Inicia sesión aquí</Link>
            </p>
        </div>
    );
};

export default Register;
