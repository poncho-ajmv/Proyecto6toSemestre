import React, { useState, useEffect, useRef } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";

import ChatBot from './ChatBot';
import { useBestGuess } from '../context/BestGuessContext';
import './CSS/IA.css';

const IA = () => {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [results, setResults] = useState([]);
  const [animalType, setAnimalType] = useState(""); // Tipo general de animal

  const { setBestGuess } = useBestGuess();

  const imageRef = useRef(null);
  const textInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Diccionario de tipos de animales con palabras clave
  const animalCategories = {
    perro: [
      "labrador", "bulldog", "beagle", "chihuahua", "terrier", "retriever", 
      "poodle", "doberman", "german shepherd", "golden retriever", "rottweiler",
      "boxer", "dalmatian", "husky", "pug", "cocker spaniel", "schnauzer"
    ],
    gato: [
      "siamese", "persian", "sphynx", "maine coon", "bengal", "ragdoll", 
      "british shorthair", "siberian", "devon rex", "scottish fold", "abysinnian"
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
  

  const getAnimalType = (className) => {
    className = className.toLowerCase();
    for (const [type, keywords] of Object.entries(animalCategories)) {
      if (keywords.some(keyword => className.includes(keyword))) {
        return type;
      }
    }
    return ""; // Si no encuentra un tipo de animal
  };

  const uploadImage = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageUrl(url);
      setResults([]);
      setAnimalType(""); // Reinicia el tipo de animal
    } else {
      setImageUrl(null);
    }
  };

  const uploadTrigger = () => {
    fileInputRef.current.click();
  };

  const handleInputChange = (e) => {
    setImageUrl(e.target.value);
    setResults([]);
    setAnimalType(""); // Reinicia el tipo de animal
  };

  const loadModel = async () => {
    setIsModelLoading(true);
    try {
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
    } catch (error) {
      console.error("Error loading model:", error);
    }
    setIsModelLoading(false);
  };

  useEffect(() => {
    loadModel();
  }, []);

  const detectImage = async () => {
    if (model && imageRef.current) {
      const classificationResults = await model.classify(imageRef.current);
      setResults(classificationResults);
      
      if (classificationResults.length > 0) {
        const bestGuess = classificationResults[0].className;
        setBestGuess(bestGuess);
        
        // Determina el tipo general de animal
        const detectedType = getAnimalType(bestGuess);
        setAnimalType(detectedType); // Establece el tipo general de animal
      }
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      padding: '20px',
    },
    imageArea: {
      flex: '1',
      maxWidth: '700px',
      marginRight: '20px',
    },
    tips: {
      flex: '1',
      marginLeft: '20px',
    },
    imageWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '20px',
    },
    image: {
      maxWidth: '100%',
      maxHeight: '450px',
      borderRadius: '8px',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    },
    resultsContainer: {
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      marginTop: '15px',
      width: '100%',
    },
    resultItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px',
      borderBottom: '1px solid #e0e0e0',
      fontSize: '16px',
    },
    bestGuess: {
      color: '#28a745',
      fontWeight: 'bold',
      marginLeft: '5px',
    },
    animalMessage: {
      color: '#ff6347',
      fontWeight: 'bold',
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.imageArea}>
        <h1>Image Detection</h1>
        <div className="inputField">
          <input
            type="file"
            accept="image/*"
            capture="camera"
            className="uploadInput"
            onChange={uploadImage}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <button
            className="uploadImage"
            onClick={uploadTrigger}
            aria-label="Upload Image from device"
          >
            Upload Image
          </button>
          <span className="or">OR</span>
          <input
            type="text"
            placeholder="Enter Image URL"
            ref={textInputRef}
            onChange={handleInputChange}
            aria-label="Enter Image URL"
          />
        </div>
        <div style={styles.imageWrapper}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Preview of the uploaded content"
              crossOrigin="anonymous"
              ref={imageRef}
              style={styles.image}
            />
          )}
          {imageUrl && (
            <button className="button" onClick={detectImage} aria-label="Detect Image">
              Detect Image
            </button>
          )}
        </div>
        {results.length > 0 && (
          <div style={styles.resultsContainer}>
            {results.map((result, index) => (
              <div style={styles.resultItem} key={result.className}>
                <span className="name" style={{ fontWeight: "bold" }}>{result.className}</span>
                <span className="accuracy">
                  Accuracy: {(result.probability * 100).toFixed(2)}%{" "}
                  {index === 0 && <span style={styles.bestGuess}>Best Guess</span>}
                </span>
              </div>
            ))}
            {animalType && (
              <div style={styles.animalMessage}>
                ¡Este es un {animalType}!
              </div>
            )}
          </div>
        )}
      </div>
      <div style={styles.tips}>
        <ChatBot />
      </div>
    </div>
  );
};

export default IA;
