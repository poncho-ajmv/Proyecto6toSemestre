import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ImageDetector from './ImageDetector'; // Importa el detector de imagen
import './CSS/AgregarMascota.css';

const animalCategories = {
  perro: [
    "labrador", "bulldog", "beagle", "chihuahua", "terrier", "retriever", 
    "poodle", "doberman", "german shepherd", "golden retriever", "rottweiler",
    "boxer", "dalmatian", "husky", "pug", "cocker spaniel", "schnauzer"
  ],
  gato: [
    "siamese", "persian", "sphynx", "maine coon", "bengal", "ragdoll", 
    "british shorthair", "siberian", "devon rex", "scottish fold", "abysinnian", "velvet"
  ],
  caballo: [
    "thoroughbred", "arabian", "quarter horse", "clydesdale", "shetland pony",
    "belgian", "andalusian", "friesian", "morgan", "warmblood"
  ],
  pajaro: [
    "parrot", "sparrow", "eagle", "canary", "crow", "pigeon", "seagull", 
    "hawk", "owl", "peacock", "flamingo", "toucan"
  ],
  pez: [
    "salmon", "trout", "goldfish", "betta", "catfish", "guppy", "golden trout",
    "tuna", "shark", "clownfish", "carp", "bass"
  ],
  reptil: [
    "snake", "lizard", "turtle", "crocodile", "chameleon", "iguana", 
    "gecko", "alligator", "anaconda", "komodo dragon", "monitor lizard"
  ],
  insecto: [
    "butterfly", "bee", "ant", "grasshopper", "fly", "mosquito", "ladybug", 
    "dragonfly", "cockroach", "termite", "moth", "beetle"
  ],
  mamifero: [
    "elephant", "tiger", "lion", "bear", "deer", "rabbit", "fox", "kangaroo",
    "monkey", "hippopotamus", "panda", "giraffe", "zebra", "koala", "wolf"
  ]
};

// Función para determinar el tipo de animal a partir de la raza
const getAnimalType = (breed) => {
  for (const [type, breeds] of Object.entries(animalCategories)) {
    if (breeds.includes(breed.toLowerCase())) {
      return type;
    }
  }
  return "";
};

const AgregarMascota = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [nombreMascota, setNombreMascota] = useState('');
  const [edad, setEdad] = useState('');
  const [peso, setPeso] = useState('');
  const [raza, setRaza] = useState('');
  const [tipoAnimal, setTipoAnimal] = useState('');
  const [foto, setFoto] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await enviarDatos();
      navigate('/welcome');
    } catch (error) {
      console.error('Error al agregar la mascota:', error);
      setError('Error al agregar la mascota');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFoto(reader.result.replace("data:image/jpeg;base64,", "").replace("data:image/png;base64,", ""));
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // Nueva función para actualizar raza y tipo de animal con los resultados del detector de imagen
  const handleImageDetection = (results) => {
    if (results && results.length > 0) {
      const detectedBreed = results[0].className.toLowerCase();
      setRaza(detectedBreed);
      setTipoAnimal(getAnimalType(detectedBreed)); // Determina el tipo de animal según la raza
    }
  };

  // Función para establecer la imagen cargada en base64
  const handleImageLoad = (base64Image) => {
    setFoto(base64Image.replace("data:image/jpeg;base64,", "").replace("data:image/png;base64,", ""));
  };

  const enviarDatos = async () => {
    try {
      await axios.post('http://localhost:5000/add-mascotas', {
        id_usuario: user.id_usuario,
        nombre_mascota: nombreMascota,
        edad: edad,
        peso: peso,
        tipo_animal: tipoAnimal,
        raza: raza,
        foto_perfil: foto
      });
      alert('Mascota agregada con éxito');
    } catch (error) {
      console.error('Error al agregar la mascota:', error);
      setError('Error al agregar la mascota');
    }
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow-sm border-0 agregar-mascota-card">
            <Card.Body>
              <h2 className="text-center text-primary mb-4">Agregar Nueva Mascota</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="nombreMascota" className="mb-3">
                  <Form.Label>Nombre de la Mascota</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Introduce el nombre de tu mascota" 
                    value={nombreMascota} 
                    onChange={(e) => setNombreMascota(e.target.value)} 
                    required 
                  />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group controlId="edad" className="mb-3">
                      <Form.Label>Edad</Form.Label>
                      <Form.Control 
                        type="number" 
                        placeholder="Edad en años" 
                        value={edad} 
                        onChange={(e) => setEdad(e.target.value)} 
                        required 
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="peso" className="mb-3">
                      <Form.Label>Peso (kg)</Form.Label>
                      <Form.Control 
                        type="number" 
                        placeholder="Peso en kg" 
                        value={peso} 
                        onChange={(e) => setPeso(e.target.value)} 
                        required 
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="tipoAnimal" className="mb-3">
                  <Form.Label>Tipo de Animal</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Ej. Perro, Gato" 
                    value={tipoAnimal} 
                    onChange={(e) => setTipoAnimal(e.target.value)} 
                    required 
                  />
                </Form.Group>

                <Form.Group controlId="raza" className="mb-3">
                  <Form.Label>Raza</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Introduce la raza de tu mascota" 
                    value={raza} 
                    onChange={(e) => setRaza(e.target.value)} 
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

                {foto && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                    <img 
                      src={`data:image/jpeg;base64,${foto}`} 
                      alt={`Foto de ${nombreMascota}`} 
                      style={{ width: '100px', borderRadius: '50%' }} 
                    />
                  </div>
                )}

                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                <Button variant="primary" type="submit" className="w-100 agregar-mascota-btn">
                  Agregar Mascota
                </Button>
              </Form>

              {/* Aquí se llama a ImageDetector y se envía la función handleImageDetection como prop */}
              <ImageDetector onDetect={handleImageDetection} onImageLoad={handleImageLoad} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AgregarMascota;
