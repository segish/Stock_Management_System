import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, useTheme } from "@mui/material";
import { tokens } from '../../theme';
import { useNavigate } from 'react-router-dom';
import  Axios  from 'axios';
import { useState, useContext } from 'react';
import Message from '../../components/admincomponents/Message';
import CircularProgress from '@mui/material/CircularProgress';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthContext } from '../../context/Context';

export default function ChangePassword() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmited, setIsSubmited] = useState(false);
  const [openAlert, setOpenAlert] = useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
  const handleSubmit = (event) => {
    setIsSubmited(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    Axios.post('/auth/pwdchange', {
      oldPassword: data.get('oldpassword'),
      newPassword: data.get('newpassword'),
       }).then((response) => {
        setIsSubmited(false);
        refreshUser(null)
        localStorage.setItem("user", JSON.stringify(null))
          navigate('/login');
       }).catch((error) => {
        if (error.response && error.response.data) {
          setOpenAlert(true);
          setErrorMessage(error.response.data);
        } else {
          setOpenAlert(true);
          setErrorMessage("An error occurred");
        }
        setIsSubmited(false)
       })
  };
  const { refreshUser } = useContext(AuthContext)
  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            px: 4,
            py: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor:`${colors.primary[400]}`
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
            textAlign: 'center'
              }}>
          Enter the credentials below to change your password
        </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <FormControl fullWidth>
              <InputLabel>Enter Old Password</InputLabel>
            <OutlinedInput
              margin="normal"
              required
              fullWidth
              name="oldpassword"
              label="Enter Old Password"
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
            <FormControl fullWidth>
              <InputLabel>Enter New Password</InputLabel>
            <OutlinedInput
              margin="normal"
              required
              fullWidth
              name="newpassword"
              label="Enter New Password"
              type={showNewPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowNewPassword}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
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
            {isSubmited ? (<span style={{display:"flex"}}>please wait... <CircularProgress color='primary' size={30} /></span>) : 'Submit'}
            </Button>
           
          </Box>
        </Box>
      </Container>
  );
}