import { useState } from 'react';
import { TextField, Button, Container, Typography, Paper, Avatar, CssBaseline } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { auth, firestore } from '../firebase';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      const userDoc = await firestore.collection('profiles').doc(user.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();

        if (userData.role === 'admin') {
          console.log('Logged in as Admin');
          navigate('/dashboard');
        } else {
          setError('Access denied: Not an admin user.');
        }
      } else {
        setError('User data not found in Firestore.');
      }
    } catch (error) {
      setError(`Sign-in failed: ${error.message}`);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper elevation={3} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4 }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </form>
      </Paper>
    </Container>
  );
};

export default SignIn;
