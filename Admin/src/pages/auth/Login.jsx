import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, useTheme } from "@mui/material";
import { tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';
import  Axios  from 'axios';
import { useState } from 'react';
import Message from '../../components/admincomponents/Message';
import CircularProgress from '@mui/material/CircularProgress';
import { useContext } from 'react';
import { AuthContext } from '../../context/Context';
import { Visibility, VisibilityOff } from '@mui/icons-material';
const defaultTheme = createTheme();

export default function SignIn() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openAlert, setOpenAlert] = useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useContext(AuthContext)
  const { currentUser } = useContext(AuthContext)
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleSubmit = (event) => {
    setIsLoggedIn(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    Axios.post('/auth/login', {
        email: data.get('email'),
        password: data.get('password'),
       }).then((response) => {
        setIsLoggedIn(false);
        refreshUser(response.data||  null)
        localStorage.setItem("user", JSON.stringify(response.data  ||null))
          navigate('/');
       }).catch((error) => {
        if (error.response && error.response.data) {
          setOpenAlert(true);
          setErrorMessage(error.response.data);
        } else {
          setOpenAlert(true);
          setErrorMessage("An error occurred" + error);
        }
        setIsLoggedIn(false)
       })
  };
  React.useEffect(() => {
    if (currentUser) {
      navigate("/")
    }
  }
  );
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            px: 4,
            py: 6,
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow:'scroll'
          }}
        >
         <Message message={errorMessage} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='error'/>
         
         <Avatar sx={{ m: 0, bgcolor: 'secondary.main', width: '80px', 
           height: '80px'}} >
           <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/user.ico`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
          </Avatar>
          <Typography mt={5}  variant="h6" color={colors.grey[300]}  
          sx={{
            fontSize: 14, 
              }}>
          Enter your credentials below
        </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="text"
              label="Username"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <FormControl fullWidth>
              <InputLabel>Password</InputLabel>
            <OutlinedInput
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
            {isLoggedIn ? (<span style={{display:"flex"}}>please wait... <CircularProgress color='primary' size={30} /></span>) : 'Sign In'}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/forgotPass" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}