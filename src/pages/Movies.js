import React, { useEffect, useState } from "react";
import axios from "axios";
import './CSS/Movies.css';

const API_URL = "https://api.themoviedb.org/3";
const API_KEY = "674684d28cd5c404ad1bf06cd1a5d482";
const IMAGE_PATH = "https://image.tmdb.org/t/p/original";

// Lista de IDs de películas que deseas mostrar

const movieIds = [
    1184918,
    8587, 
    28178,
    10340,
    512895,
    18269,
    381289,
    522518,
    399174,
    929204,
    11674,
    12230,
    13654,
    10481,
    17908,
    953,
    80321,
    270946,
    10527,
    25472,
    72391,
    1207830,
    412117,
    328111,
    307115,
    22660,
    11497,
    14306,
    15189,
    481848,
    606856,
    9487,
    604774,
    127380,
    12,
    87827,
    140300,
    1011985,
    49444,
    425,
    411,
    420818,
    762509,
    9732,
    11430,
    359983

];


function App() {
    const [movies, setMovies] = useState([]);
    const [movie, setMovie] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [cast, setCast] = useState([]);
    const [directors, setDirectors] = useState([]);

    // Función para obtener detalles de las películas por sus IDs
    const fetchMoviesByIds = async () => {
        const promises = movieIds.map(id => 
            axios.get(`${API_URL}/movie/${id}`, {
                params: {
                    api_key: API_KEY,
                    append_to_response: "videos,credits",
                },
            })
        );

        try {
            const results = await Promise.all(promises);
            setMovies(results.map(response => response.data));
            if (results.length > 0) {
                selectMovie(results[0].data); // Seleccionar la primera película por defecto
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };

    // Función para obtener los detalles de la película seleccionada
    const fetchMovieDetails = async (id) => {
        try {
            const { data } = await axios.get(`${API_URL}/movie/${id}`, {
                params: {
                    api_key: API_KEY,
                    append_to_response: "videos,credits",
                },
            });

            // Encontrar el tráiler en los videos de la película
            const trailerVideo = data.videos.results.find(
                (vid) => vid.type === "Trailer"
            );
            setTrailer(trailerVideo ? trailerVideo.key : null);

            // Filtrar directores del equipo
            setDirectors(data.credits.crew.filter((member) => member.job === "Director"));

            // Configurar el estado con la información de la película y el elenco
            setMovie(data);
            setCast(data.credits.cast.slice(0, 10)); // Solo mostrar los 10 primeros actores
        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    };

    // Seleccionar una película y obtener sus detalles
    const selectMovie = (movie) => {
        fetchMovieDetails(movie.id);
        setMovie(movie);
    };

    // Ejecutar al montar el componente
    useEffect(() => {
        fetchMoviesByIds();
    }, []);

    return (
        <div className="App">
            <main>
                {movie && (
                    <div className="featured-movie" style={{ backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")` }}>
                        <h2>{movie.title}</h2>
                        <p>{movie.overview}</p>
                        <p>Rating: {movie.vote_average}</p>

                        {trailer && (
                            <div className="trailer-container">
                                <iframe
                                    width="560"
                                    height="315"
                                    src={`https://www.youtube.com/embed/${trailer}`}
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}

                        <div className="cast-container">
                            <h2>Directors</h2>
                            <ul>
                                {directors.map((director) => (
                                    <li key={director.id}>{director.name}</li>
                                ))}
                            </ul>
                            <h2>Cast</h2>
                            <ul>
                                {cast.map((actor) => (
                                    <li key={actor.id}>
                                        {actor.name} as {actor.character}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </main>

            <div className="movies-list">
    <h1>Movies</h1>
    <div className="row_movies">
        {movies.map((movie) => (
            <div key={movie.id} className="col_movies" onClick={() => selectMovie(movie)}>
                <img src={`${IMAGE_PATH}${movie.poster_path}`} alt={movie.title} />
                <h4>{movie.title}</h4>
                <p>ID: {movie.id}</p> {/* Aquí mostramos el ID de la película */}
                <p>Rating: {movie.vote_average}</p>
            </div>
        ))}
    </div>
</div>

        </div>
    );
}

export default App;
