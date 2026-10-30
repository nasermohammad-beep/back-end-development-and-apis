import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../utils/db.js";

const router = express.Router();

router.use(authenticate);

// GET /api/watchlist/:userId
router.get("/:userId", (req, res) => {
  const userId = Number(req.params.userId);
  const watchlist = getWatchlist(userId);

  if (watchlist === null) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json(watchlist);
});

// POST /api/watchlist/:userId/movies
router.post("/:userId/movies", authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const movie = addMovie(userId, req.body);

  if (!movie) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(201).json(movie);
});

// PUT /api/watchlist/:userId/movies/:movieId
router.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const movieId = Number(req.params.movieId);

  const updatedMovie = updateMovie(userId, movieId, req.body);

  if (!updatedMovie) {
    return res.status(404).json({ error: "Movie or user not found" });
  }

  return res.status(200).json(updatedMovie);
});

// DELETE /api/watchlist/:userId/movies/:movieId
router.delete("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const movieId = Number(req.params.movieId);

  const success = deleteMovie(userId, movieId);

  if (!success) {
    return res.status(404).json({ error: "Movie or user not found" });
  }

  return res.status(200).json({ message: "Movie deleted successfully" });
});

export default router;
