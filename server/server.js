const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Movies data
const hardcodedMovies = [
    { id: 1, title: 'Mean Girls' },
    { id: 2, title: 'Hackers' },
    { id: 3, title: 'The Grey' },
    { id: 4, title: 'Sunshine' },
    { id: 5, title: 'Ex Machina' },
];

let userMovies = []; // Movies added by users

// Get all user-added movies
app.get('/api/movies', (req, res) => {
    res.json(userMovies);
});

// Add a movie
app.post('/api/movies', (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    const newMovie = { id: Date.now(), title }; // Unique ID based on timestamp
    userMovies.push(newMovie);
    res.status(201).json(newMovie);
});

// Delete a movie
app.delete('/api/movies/:id', (req, res) => {
    const movieId = parseInt(req.params.id, 10);
    const movieIndex = userMovies.findIndex((movie) => movie.id === movieId);

    if (movieIndex === -1) {
        return res.status(404).json({ error: 'Movie not found' });
    }

    userMovies.splice(movieIndex, 1); // Remove movie from userMovies
    res.status(204).send(); // No content response
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



