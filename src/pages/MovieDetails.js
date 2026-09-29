import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Grid, Typography, Chip, Stack, Button, Box, CircularProgress, Alert, Avatar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import { getMovieDetails, imageUrl, friendlyError } from '../api/tmdb';
import { useMovies } from '../context/MovieContext';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useMovies();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setMovie(null);
    setError('');
    getMovieDetails(id)
      .then((d) => !cancelled && setMovie(d))
      .catch((e) => !cancelled && setError(friendlyError(e)));
    return () => { cancelled = true; };
  }, [id]);

  const back = <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>Back</Button>;

  if (error) return <Container sx={{ py: 3 }}>{back}<Alert severity="error">{error}</Alert></Container>;
  if (!movie) return <Box sx={{ textAlign: 'center', py: 10 }}><CircularProgress /></Box>;

  // Prefer an official YouTube trailer, otherwise any YouTube video
  const yt = (movie.videos?.results || []).filter((v) => v.site === 'YouTube');
  const trailer = yt.find((v) => v.type === 'Trailer' && v.official) || yt.find((v) => v.type === 'Trailer') || yt[0];
  const cast = (movie.credits?.cast || []).slice(0, 10);
  const fav = isFavorite(movie.id);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {back}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          {movie.poster_path && (
            <Box component="img" src={imageUrl(movie.poster_path, 'w500')} alt={`${movie.title} poster`}
                 sx={{ width: '100%', maxWidth: 360, borderRadius: 2, display: 'block', mx: 'auto' }} />
          )}
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h3" component="h1">{movie.title}</Typography>
          {movie.tagline && <Typography color="text.secondary" sx={{ fontStyle: 'italic', mb: 1 }}>{movie.tagline}</Typography>}

          <Stack direction="row" sx={{ my: 2, flexWrap: 'wrap', gap: 1 }}>
            <Chip icon={<StarIcon />} color="primary" label={`${(movie.vote_average || 0).toFixed(1)} (${movie.vote_count} votes)`} />
            {movie.release_date && <Chip label={movie.release_date.slice(0, 4)} />}
            {movie.runtime > 0 && <Chip label={`${movie.runtime} min`} />}
            {movie.genres.map((g) => <Chip key={g.id} variant="outlined" label={g.name} />)}
          </Stack>

          <Button variant={fav ? 'contained' : 'outlined'} startIcon={fav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  onClick={() => toggleFavorite(movie)}>
            {fav ? 'Saved to favorites' : 'Add to favorites'}
          </Button>

          <Typography variant="h6" sx={{ mt: 3 }}>Overview</Typography>
          <Typography sx={{ maxWidth: '70ch' }}>{movie.overview || 'No overview available.'}</Typography>

          {cast.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Cast</Typography>
              <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
                {cast.map((c) => (
                  <Chip key={c.id} label={c.name} avatar={<Avatar alt={c.name} src={imageUrl(c.profile_path, 'w185')} />} />
                ))}
              </Stack>
            </>
          )}

          <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Trailer</Typography>
          {trailer ? (
            <>
              <Box sx={{ position: 'relative', pt: '56.25%', borderRadius: 2, overflow: 'hidden' }}>
                <iframe title={`${movie.title} trailer`} src={`https://www.youtube.com/embed/${trailer.key}`}
                        allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
              </Box>
              <Button href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer" sx={{ mt: 1 }}>
                Watch on YouTube
              </Button>
            </>
          ) : (
            <Typography color="text.secondary">No trailer is available for this movie.</Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
