import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Alert, Stack } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  const submit = (e) => {
    e.preventDefault();
    const err = login(username, password);
    if (err) setError(err); else navigate('/');
  };

  return (
    <Container maxWidth="xs" sx={{ mt: { xs: 4, sm: 10 } }}>
      <Paper component="form" onSubmit={submit} sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h4">Sign in</Typography>
          <Typography color="text.secondary">Log in to search films and save your favorites.</Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus autoComplete="username" />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          <Button type="submit" variant="contained" size="large">Sign in</Button>
        </Stack>
      </Paper>
    </Container>
  );
}
