import { Grid } from '@mui/material';
import MovieCard from './MovieCard';


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
