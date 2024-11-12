import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Slider from 'react-slick';
import { Dog, User, Settings, Calendar, MapPin } from 'lucide-react';
import './CSS/Welcome.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Welcome = () => {
    const { user } = useAuth();
    const [images, setImages] = useState([]);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    const fetchImages = async () => {
        const randomPage = Math.floor(Math.random() * 100) + 1;
        try {
            const response = await fetch(`https://api.pexels.com/v1/search?query=happy pets&per_page=5&page=${randomPage}`, {
                headers: {
                    Authorization: 'pC6o1u6zUq39HDTlDQ54xdphF4z8rjpKnaqPdJlU1O92jD0BfGV8ydIV',
                },
            });
            const data = await response.json();
            setImages(data.photos.map(photo => photo.src.original));
        } catch (error) {
            console.error('Error al obtener las imágenes:', error);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <div className="welcome-container max-w-3xl mx-auto text-center p-8">
            <header className="welcome-header mb-8">
                <h2 className="text-3xl font-bold text-gray-800">¡Bienvenido, {user?.nombre_completo}!</h2>
                <p className="text-gray-600">Administra el cuidado de tus amigos peludos fácilmente.</p>
            </header>

            <Slider {...sliderSettings}>
                {images.length > 0 ? (
                    images.map((image, index) => (
                        <div key={index} className="carousel-image-container">
                            <img src={image} alt={`Imagen ${index + 1}`} className="carousel-image w-full h-96 object-cover rounded-lg shadow-md" />
                        </div>
                    ))
                ) : (
                    <div className="no-images text-lg text-gray-500">No hay imágenes disponibles.</div>
                )}
            </Slider>

            <div className="welcome-buttons flex flex-wrap gap-4 justify-center mt-8">
                <Link to="/reminders" className="button-link">
                    <Calendar className="mr-2" /> Recordatorios
                </Link>
                <Link to="/SeeProfile" className="button-link">
                    <User className="mr-2" /> Perfil
                </Link>
                <Link to="/tips" className="button-link">
                    <Dog className="mr-2" /> Tips
                </Link>
                <Link to="/contact" className="button-link">
                    <Settings className="mr-2" /> Contacto
                </Link>
                <Link to="/update-user" className="button-link">
                    <User className="mr-2" /> Actualizar Usuario
                </Link>
                <Link to="/metas" className="button-link">
                    <MapPin className="mr-2" /> Metas
                </Link>
                <Link to="/ia" className="button-link">
                    <Dog className="mr-2" /> Inteligencia Artificial
                </Link>
                <Link to="/agregar-mascota" className="button-link">
                    <User className="mr-2" /> Agregar Mascota
                </Link>
                <Link to="/galeria" className="button-link">
                    <Settings className="mr-2" /> Galería
                </Link>
                <Link to="/Mapa" className="button-link">
                    <MapPin className="mr-2" /> Mapa
                </Link>

                <Link to="/editar-mascota" className="button-link">
                    <MapPin className="mr-2" /> editar-mascota
                </Link>

                <Link to="/database" className="button-link">
                    <MapPin className="mr-2" /> DataBase
                </Link>


                
                
                {/* Mostrar el botón especial solo para el usuario root */}
                {user?.email === 'root@root.com' && (
                    <Link to="/admin-profiles" className="button-link">
                        <Settings className="mr-2" /> Administrar Perfiles
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Welcome;
