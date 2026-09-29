import { useEffect, useRef } from 'react';
import { Container, Typography, Stack, Box, Button, CircularProgress, Alert, ToggleButton, ToggleButtonGroup } from '@mui/material';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MovieGrid from '../components/MovieGrid';
import { useMovies } from '../context/MovieContext';
import useLocalStorage from '../hooks/useLocalStorage';

export default function Home() {
  const { results, loading, error, hasMore, loadMore, isActive, retry, trending, trendingError, query } = useMovies();
  // Infinite scroll (required) or a "Load more" button (bonus)
  const [mode, setMode] = useLocalStorage('scrollMode', 'infinite');
  const sentinel = useRef(null);

  // Infinite scroll: load the next page when the sentinel nears the viewport
  useEffect(() => {
    if (mode !== 'infinite' || !sentinel.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && hasMore && !loading && !error) loadMore(); },
      { rootMargin: '300px' }
    );
    obs.observe(sentinel.current);
    return () => obs.disconnect();
  }, [mode, hasMore, loading, error, loadMore, results.length]);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Stack spacing={2} sx={{ mb: 4 }}>
        <SearchBar />
        <FilterBar />
      </Stack>

      {!isActive && (
        <>
          <Typography variant="h5" sx={{ mb: 2 }}>Trending this week</Typography>
          {trendingError && <Alert severity="error">{trendingError}</Alert>}
          {!trendingError && trending.length === 0 && <Box sx={{ textAlign: 'center', py: 6 }}><CircularProgress /></Box>}
          <MovieGrid movies={trending} />
        </>
      )}

      {isActive && (
        <>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5">{query.trim() ? `Results for "${query.trim()}"` : 'Filtered movies'}</Typography>
            <ToggleButtonGroup size="small" exclusive value={mode} onChange={(_, v) => v && setMode(v)} aria-label="Paging mode">
              <ToggleButton value="infinite">Infinite scroll</ToggleButton>
              <ToggleButton value="button">Load more</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          {error && (
            <Alert severity="error" action={<Button color="inherit" size="small" onClick={retry}>Try again</Button>} sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {!loading && !error && results.length === 0 && (
            <Typography color="text.secondary">No movies matched. Try a different title or loosen the filters.</Typography>
          )}

          <MovieGrid movies={results} />

          {mode === 'infinite' && <div ref={sentinel} style={{ height: 1 }} />}
          <Box sx={{ textAlign: 'center', py: 4 }}>
            {loading && <CircularProgress />}
            {!loading && hasMore && mode === 'button' && <Button variant="outlined" onClick={loadMore}>Load more</Button>}
          </Box>
        </>
      )}
    </Container>
  );
}
