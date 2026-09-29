import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Tooltip, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import { useThemeMode } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../context/MovieContext';

export default function Navbar() {
  const { mode, toggle } = useThemeMode();
  const { user, logout } = useAuth();
  const { favorites } = useMovies();
  const navigate = useNavigate();

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar sx={{ gap: 1 }}>
        <Typography variant="h6" component={Link} to="/" sx={{ color: 'primary.main', textDecoration: 'none', flexGrow: 1 }}>
          Movie Explorer
        </Typography>
        {user && (
          <>
            <Tooltip title="Favorites">
              <IconButton component={Link} to="/favorites" aria-label="Favorites">
                <Badge badgeContent={favorites.length} color="primary"><FavoriteIcon /></Badge>
              </IconButton>
            </Tooltip>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2">{user.username}</Typography>
            </Box>
          </>
        )}
        <Tooltip title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          <IconButton onClick={toggle} aria-label="Toggle light or dark mode">
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
        {user && (
          <Button size="small" startIcon={<LogoutIcon />} onClick={() => { logout(); navigate('/login'); }}>
            Log out
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
