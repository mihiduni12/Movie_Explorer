import { Stack, TextField, MenuItem, Button } from '@mui/material';
import { useMovies } from '../context/MovieContext';

const thisYear = new Date().getFullYear();
const years = Array.from({ length: 60 }, (_, i) => thisYear - i);

/** Bonus: filter by genre, release year and minimum rating. */
export default function FilterBar() {
  const { filters, setFilters, genres } = useMovies();
  const set = (key) => (e) => setFilters((f) => ({ ...f, [key]: e.target.value }));
  const dirty = Boolean(filters.genre || filters.year || filters.rating);

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
      <TextField select fullWidth size="small" label="Genre" value={filters.genre} onChange={set('genre')}>
        <MenuItem value="">Any genre</MenuItem>
        {genres.map((g) => <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)}
      </TextField>
      <TextField select fullWidth size="small" label="Year" value={filters.year} onChange={set('year')}>
        <MenuItem value="">Any year</MenuItem>
        {years.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
      </TextField>
      <TextField select fullWidth size="small" label="Minimum rating" value={filters.rating} onChange={set('rating')}>
        <MenuItem value={0}>Any rating</MenuItem>
        {[5, 6, 7, 8, 9].map((r) => <MenuItem key={r} value={r}>{r}+ stars</MenuItem>)}
      </TextField>
      {dirty && (
        <Button onClick={() => setFilters({ genre: '', year: '', rating: 0 })} sx={{ whiteSpace: 'nowrap' }}>
          Reset filters
        </Button>
      )}
    </Stack>
  );
}
