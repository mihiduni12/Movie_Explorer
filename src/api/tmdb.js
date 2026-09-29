import axios from 'axios';

// Single axios instance; the API key and language are sent with every request.
const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000,
  params: { api_key: process.env.REACT_APP_TMDB_API_KEY, language: 'en-US' },
});

/** Build a full image URL from a TMDb image path. */
export const imageUrl = (path, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

export const getTrending = () =>
  api.get('/trending/movie/week').then((r) => r.data.results);

export const getGenres = () =>
  api.get('/genre/movie/list').then((r) => r.data.genres);

/** Details + cast + videos in a single request. */
export const getMovieDetails = (id) =>
  api.get(`/movie/${id}`, { params: { append_to_response: 'credits,videos' } }).then((r) => r.data);

/**
 * Search (when a query exists) or discover (when only filters are set).
 * /search/movie supports `year` but not genre/rating, so those are filtered client-side.
 */
export async function getMovies({ query = '', genre = '', year = '', rating = 0, page = 1 }) {
  if (query.trim()) {
    const { data } = await api.get('/search/movie', {
      params: { query: query.trim(), page, year: year || undefined },
    });
    const results = data.results.filter(
      (m) => (!genre || m.genre_ids.includes(Number(genre))) && m.vote_average >= rating
    );
    return { ...data, results };
  }
  const { data } = await api.get('/discover/movie', {
    params: {
      page,
      sort_by: 'popularity.desc',
      with_genres: genre || undefined,
      primary_release_year: year || undefined,
      'vote_average.gte': rating || undefined,
      'vote_count.gte': 50, // hides obscure titles with unreliable ratings
    },
  });
  return data;
}

/** Convert any axios error into a friendly message. */
export function friendlyError(err) {
  if (!process.env.REACT_APP_TMDB_API_KEY) return 'TMDb API key is missing. Add REACT_APP_TMDB_API_KEY to your .env file.';
  if (!err.response) return 'Cannot reach the movie service. Check your internet connection and try again.';
  switch (err.response.status) {
    case 401: return 'The TMDb API key was rejected. Check the key in your .env file.';
    case 404: return 'That movie could not be found.';
    case 429: return 'Too many requests. Wait a moment and try again.';
    default: return 'Something went wrong on the movie service. Please try again later.';
  }
}
