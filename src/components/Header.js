// Importación de dependencias
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Settings, LogOut, Home, Target, Calendar, Brain, Mail, Film } from 'lucide-react';
import logo from '../assets/logo.png'; // Asegúrate de que la ruta sea correcta
import '../assets/Header.css'; // Cambia esta línea a la ruta correcta de tu CSS
import { useAuth } from '../context/AuthContext'; // Importa el contexto de autenticación

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="logo flex items-center">
                <Link to="/welcome">
                    <img src={logo} alt="Logo" className="h-12 mr-3" />
                </Link>
                
            </div>
            <nav>
                <ul className="nav-links flex items-center space-x-6">
                    <li>
                        <Link to="/welcome" className="flex items-center text-white">
                            <Home className="mr-1" /> Bienvenido
                        </Link>
                    </li>
                    <li>
                        <Link to="/Metas" className="flex items-center text-white">
                            <Target className="mr-1" /> Metas
                        </Link>
                    </li>
                    <li>
                        <Link to="/reminders" className="flex items-center text-white">
                            <Calendar className="mr-1" /> Recordatorios
                        </Link>
                    </li>
                    <li>
                        <Link to="/ia" className="flex items-center text-white">
                            <Brain className="mr-1" /> IA
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact" className="flex items-center text-white">
                            <Mail className="mr-1" /> Contacto
                        </Link>
                    </li>
                    <li>
                        <Link to="/movies" className="flex items-center text-white">
                            <Film className="mr-1" /> Movies
                        </Link>
                    </li>
                    {user && (
                        <>
                            <li>
                                <Link to="/update-user" className="flex items-center text-white">
                                    <Settings className="mr-1" /> Settings
                                </Link>
                            </li>
                            <li>
                                <button 
                                    onClick={handleLogout} 
                                    className="logout-button flex items-center text-white">
                                    <LogOut className="icon" />
                                    <span>Cerrar Sesión</span>
                                </button>

                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
