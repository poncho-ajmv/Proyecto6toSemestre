import React, { useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import './CSS/Contact.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Asegúrate de importar tu contexto de autenticación

const Contact = () => {
  const form = useRef();
  const navigate = useNavigate();
  const { user } = useAuth(); // Obtener el usuario actual del contexto

  // Autocompletar el formulario con los datos del usuario
  useEffect(() => {
    if (user) {
      form.current.user_name.value = user.nombre_completo; // Completa el nombre
      form.current.user_email.value = user.email; // Completa el email
    }
  }, [user]);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
        "service_1y013fi",
        "template_iy39b25",
        form.current,
        "uMmzrZycT-ZpeSEMX"
      )
      .then(
        (result) => {
          console.log(result.text);
          alert("El mensaje ha sido enviado con éxito");
          navigate('/welcome');
        },
        (error) => {
          console.log(error.text);
          alert("Hubo un error al enviar el mensaje");
        }
      );
  };

  return (
    <div className="contact-form-container">
      <div className="contact-form">
        <form ref={form} onSubmit={sendEmail}>
          <label>Name</label>
          <input type="text" name="user_name" required />
          <label>Email</label>
          <input type="email" name="user_email" required />
          <label>Message</label>
          <textarea name="message" required />
          <input type="submit" value="Send" />
        </form>
      </div>
    </div>
  );
};

export default Contact;
