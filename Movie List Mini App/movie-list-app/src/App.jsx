import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [userMovies, setUserMovies] = useState([]);
  const [newMovie, setNewMovie] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  // Fetch added movies from the server
  useEffect(() => {
    fetch('http://localhost:8080/api/movies')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        return response.json();
      })
      .then((data) => {
        const updatedData = data.map((movie) => ({
          ...movie,
          watched: false,
        }));
        setUserMovies(updatedData);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  // Handle adding a new movie
  const handleAddMovie = (e) => {
    e.preventDefault();
    if (!newMovie.trim()) {
      alert('Movie title cannot be empty');
      return;
    }

    fetch('http://localhost:8080/api/movies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newMovie.trim() }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add movie');
        }
        return response.json();
      })
      .then((addedMovie) => {
        const newMovieWithWatched = { ...addedMovie, watched: false };
        setUserMovies([...userMovies, newMovieWithWatched]);
        setNewMovie('');
      })
      .catch((error) => alert(`Error: ${error.message}`));
  };

  // Handle deleting a movie
  const handleDeleteMovie = (id) => {
    fetch(`http://localhost:8080/api/movies/${id}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete movie');
        }
        setUserMovies(userMovies.filter((movie) => movie.id !== id));
      })
      .catch((error) => alert(`Error: ${error.message}`));
  };

  // Toggle the "watched" status of a movie
  const toggleWatched = (id) => {
    setUserMovies(
      userMovies.map((movie) =>
        movie.id === id ? { ...movie, watched: !movie.watched } : movie
      )
    );
  };

  // Filter movies 
  const filteredMovies =
    filter === 'watched'
      ? userMovies.filter((movie) => movie.watched)
      : filter === 'toWatch'
      ? userMovies.filter((movie) => !movie.watched)
      : userMovies;

  return (
    <div className="container">
      <h1>Movie List</h1>

      <form onSubmit={handleAddMovie}>
        <input
          type="text"
          placeholder="Add a new movie..."
          value={newMovie}
          onChange={(e) => setNewMovie(e.target.value)}
        />
        <button type="submit">Add Movie</button>
      </form>

      <div className="filter-buttons">
        <button onClick={() => setFilter('all')}>Show All</button>
        <button onClick={() => setFilter('watched')}>Show Watched</button>
        <button onClick={() => setFilter('toWatch')}>Show Must Watch</button>
      </div>

      <h2>My Movies</h2>
      {isLoading && <p className="loading">Loading movies...</p>}
      {error && <p className="error">{error}</p>}
      {filteredMovies.length > 0 ? (
        <ul>
          {filteredMovies.map((movie) => (
            <li key={movie.id} className="list-item">
              {movie.title}{' '}
              <button
                onClick={() => toggleWatched(movie.id)}
                className={`watched-button ${
                  movie.watched ? 'watched' : 'to-watch'
                }`}
              >
                {movie.watched ? 'Watched' : 'Must Watch'}
              </button>
              <button
                onClick={() => handleDeleteMovie(movie.id)}
                className="delete-button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !isLoading && <p>No movies to display.</p>
      )}
    </div>
  );
}

export default App;


