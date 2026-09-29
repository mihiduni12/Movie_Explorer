import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useMovies } from '../context/MovieContext';

/** Controlled search input; the (debounced) fetching happens in MovieContext. */
export default function SearchBar() {
  const { query, setQuery } = useMovies();
  return (
    <TextField
      fullWidth
      placeholder="Search for a movie"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      inputProps={{ 'aria-label': 'Search for a movie' }}
      InputProps={{
        startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
        endAdornment: query && (
          <InputAdornment position="end">
            <IconButton aria-label="Clear search" onClick={() => setQuery('')} edge="end"><ClearIcon /></IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}
