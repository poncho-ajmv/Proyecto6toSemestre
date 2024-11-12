import React from 'react';
import '../assets/Footer.css';
import { Github, Instagram } from 'lucide-react'; // Importamos los íconos específicos de Lucide

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="footerContainer">
        <div className="socialIcons">
          <a href="https://github.com/poncho-ajmv/Proyecto6toSemestre" target="_blank" rel="noopener noreferrer">
            <Github size={24} color="black" />
          </a>
          <a href="https://www.instagram.com/pet__path/" target="_blank" rel="noopener noreferrer">
            <Instagram size={24} color="black" />
          </a>
        </div>
        
        <div className="footerText">
          <p>Aplicación de Autenticación © {currentYear}</p>
          <p>Desarrollado por Pet Path</p>
          <p>
            <a href="https://www.termsandconditions.com" target="_blank" rel="noopener noreferrer">
              Términos y Condiciones
            </a> | 
            <a href="https://www.privacypolicy.com" target="_blank" rel="noopener noreferrer">
              Política de Privacidad
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
