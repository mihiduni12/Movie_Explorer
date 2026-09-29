import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getTrending, getGenres, getMovies, friendlyError } from '../api/tmdb';
import useLocalStorage from '../hooks/useLocalStorage';

const MovieContext = createContext();
export const useMovies = () => useContext(MovieContext);

export function MovieProvider({ children }) {
  // Persisted: last searched movie + favourites
  const [query, setQuery] = useLocalStorage('lastSearch', '');
  const [favorites, setFavorites] = useLocalStorage('favorites', []);

  const [filters, setFilters] = useState({ genre: '', year: '', rating: 0 });
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [trending, setTrending] = useState([]);
  const [trendingError, setTrendingError] = useState('');
  const [genres, setGenres] = useState([]);

  const reqId = useRef(0); // ignore responses from outdated requests
  const isActive = Boolean(query.trim() || filters.genre || filters.year || filters.rating);

  // Trending + genre list load once
  useEffect(() => {
    getTrending().then(setTrending).catch((e) => setTrendingError(friendlyError(e)));
    getGenres().then(setGenres).catch(() => {});
  }, []);

  const fetchPage = useCallback(
    async (p) => {
      const id = ++reqId.current;
      setLoading(true);
      setError('');
      try {
        const data = await getMovies({ query, ...filters, page: p });
        if (id !== reqId.current) return;
        setResults((prev) => (p === 1 ? data.results : [...prev, ...data.results]));
        setPage(p);
        setTotalPages(data.total_pages);
      } catch (e) {
        if (id === reqId.current) setError(friendlyError(e));
      } finally {
        if (id === reqId.current) setLoading(false);
      }
    },
    [query, filters]
  );

  // New query/filters -> debounce 400ms then load page 1
  useEffect(() => {
    if (!isActive) {
      reqId.current++;
      setResults([]);
      setLoading(false);
      setError('');
      return;
    }
    const t = setTimeout(() => fetchPage(1), 400);
    return () => clearTimeout(t);
  }, [fetchPage, isActive]);

  const hasMore = page < totalPages;
  const loadMore = useCallback(() => { if (hasMore && !loading) fetchPage(page + 1); }, [hasMore, loading, fetchPage, page]);

  const isFavorite = (id) => favorites.some((m) => m.id === id);
  const toggleFavorite = (movie) =>
    setFavorites((favs) =>
      favs.some((m) => m.id === movie.id)
        ? favs.filter((m) => m.id !== movie.id)
        : [...favs, { id: movie.id, title: movie.title, poster_path: movie.poster_path,
            release_date: movie.release_date, vote_average: movie.vote_average }]
    );

  return (
    <MovieContext.Provider
      value={{ query, setQuery, filters, setFilters, results, loading, error, hasMore, loadMore,
               isActive, retry: () => fetchPage(1), trending, trendingError, genres,
               favorites, isFavorite, toggleFavorite }}
    >
      {children}
    </MovieContext.Provider>
  );
}
