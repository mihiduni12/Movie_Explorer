import { Card, CardActionArea, CardMedia, CardContent, Typography, Box, IconButton, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import { imageUrl } from '../api/tmdb';
import { useMovies } from '../context/MovieContext';

// Inline SVG placeholder for movies without a poster
const NO_POSTER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750"><rect width="100%" height="100%" fill="#444"/><text x="50%" y="50%" fill="#ddd" font-family="sans-serif" font-size="32" text-anchor="middle">No poster</text></svg>');

/** Poster, title, release year and rating. Click opens the details page. */
export default function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useMovies();
  const fav = isFavorite(movie.id);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'TBA';

  return (
    <Card sx={{ position: 'relative', height: '100%' }}>
      <CardActionArea component={Link} to={`/movie/${movie.id}`}>
        <CardMedia component="img" image={imageUrl(movie.poster_path) || NO_POSTER} alt={`${movie.title} poster`}
                   loading="lazy" sx={{ aspectRatio: '2 / 3', objectFit: 'cover' }} />
        <CardContent sx={{ p: 1.5 }}>
          <Typography variant="subtitle2" noWrap title={movie.title}>{movie.title}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">{year}</Typography>
            <Chip size="small" icon={<StarIcon />} label={(movie.vote_average || 0).toFixed(1)} />
          </Box>
        </CardContent>
      </CardActionArea>
      <IconButton
        aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
        onClick={() => toggleFavorite(movie)}
        sx={{ position: 'absolute', top: 6, right: 6, bgcolor: 'rgba(0,0,0,.55)', '&:hover': { bgcolor: 'rgba(0,0,0,.75)' } }}
      >
        {fav ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon sx={{ color: '#fff' }} />}
      </IconButton>
    </Card>
  );
}
