import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import { useMovies } from '../context/MovieContext';

export default function Favorites() {
  const { favorites } = useMovies();
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Your favorites</Typography>
      {favorites.length === 0 ? (
        <>
          <Typography color="text.secondary" sx={{ mb: 2 }}>You haven't saved any movies yet. Tap the heart on a poster to save it.</Typography>
          <Button component={Link} to="/" variant="contained">Find movies</Button>
        </>
      ) : (
        <MovieGrid movies={favorites} />
      )}
    </Container>
  );
}
