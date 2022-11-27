import React from "react";

// TODO use a dynamic generic poster created with javascript
const DEFAULT_MOVIE_POSTER = "https://patito.club/patitoninja.svg";

const Movie = ({ movie }) => {
  const poster = movie.Poster === "N/A" ? DEFAULT_MOVIE_POSTER : movie.Poster;
  return (
    <div className="movie">
      <h3>{movie.Title}</h3>
      <div>
        <img width="200" alt={`Movie title: ${movie.Title}`} src={poster} />
      </div>
      <p>({movie.Year})</p>
    </div>
  );
};

export default Movie;
