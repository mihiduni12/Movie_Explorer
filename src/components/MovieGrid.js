import { Grid } from '@mui/material';
import MovieCard from './MovieCard';

/** Mobile-first grid: 2 columns on phones up to 6 on large screens. */
export default function MovieGrid({ movies }) {
  return (
    <Grid container spacing={2}>
      {movies.map((m) => (
        <Grid item key={m.id} xs={6} sm={4} md={3} lg={2}>
          <MovieCard movie={m} />
        </Grid>
      ))}
    </Grid>
  );
}
