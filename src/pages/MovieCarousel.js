import React from 'react';
import Slider from 'react-slick';

function MovieCarousel({ movies, selectMovie }) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 5,
        slidesToScroll: 5,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />
    };

    function CustomPrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", background: "black" }}
                onClick={onClick}
            />
        );
    }

    function CustomNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", background: "black", marginRight: "4px" }}
                onClick={onClick}
            />
        );
    }

    return (
        <div style={{ maxWidth: '1800px', margin: '20px auto' }}>
            <Slider {...settings}>
                {movies.map(movie => (
                    <div key={movie.id} onClick={() => selectMovie(movie)} style={{ padding: "5px", textAlign: 'center' }}>
                        <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} style={{ maxWidth: "400px", height: "auto" }} />
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default MovieCarousel;
