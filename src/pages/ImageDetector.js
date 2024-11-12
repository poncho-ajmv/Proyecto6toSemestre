import React, { useState, useEffect, useRef } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";

const ImageDetector = ({ onDetect, onImageLoad }) => {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [results, setResults] = useState([]);

  const imageRef = useRef(null);
  const fileInputRef = useRef(null);

  const uploadImage = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setResults([]);

      // Convertir la imagen a base64 y enviarla al componente padre
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        onImageLoad(base64Image); // Llamada a onImageLoad con la imagen en base64
      };
      reader.readAsDataURL(file);
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
      onDetect(classificationResults); // Llamamos a onDetect con los resultados
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
    },
    image: {
      maxWidth: '100%',
      maxHeight: '450px',
      borderRadius: '8px',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      marginTop: '20px',
    },
    resultsContainer: {
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      backgroundColor: '#f9f9f9',
      marginTop: '15px',
      width: '100%',
      maxWidth: '400px',
    },
    resultItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px',
      borderBottom: '1px solid #e0e0e0',
      fontSize: '16px',
    },
  };

  return (
    <div style={styles.container}>
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
          onChange={handleInputChange}
          aria-label="Enter Image URL"
        />
      </div>
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
        <button onClick={detectImage} aria-label="Detect Image">
          Detect Image
        </button>
      )}
      {results.length > 0 && (
        <div style={styles.resultsContainer}>
          {results.map((result, index) => (
            <div style={styles.resultItem} key={result.className}>
              <span>{result.className}</span>
              <span>Accuracy: {(result.probability * 100).toFixed(2)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageDetector;
