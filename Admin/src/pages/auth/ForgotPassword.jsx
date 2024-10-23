import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FormControl, Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, useTheme } from "@mui/material";
import { tokens } from '../../theme';
import { Link, useNavigate } from 'react-router-dom';
import  Axios  from 'axios';
import { useState } from 'react';
import Message from '../../components/admincomponents/Message';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import { useContext } from 'react';
import { AuthContext } from '../../context/Context';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { MuiOtpInput } from 'mui-one-time-password-input';
const defaultTheme = createTheme();
export default function ForgotPassword() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmited, setIsSubmited] = useState(false);
  const [openAlert, setOpenAlert] = useState(true);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isPhoneSubmitted, setIsphoneSubmitted] = useState(false);
  const [isPhoneSent, setIsPhoneSent] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpSubmited, setIsOtpSubmitted] = useState(false);
  const [isPassword, setIsPassword] =useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const { refreshUser } = useContext(AuthContext)
  const { currentUser } = useContext(AuthContext)
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handlleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  React.useEffect(() => {
    if (currentUser) {
      navigate("/")
    }
  }
  );
        const handlePhone = () => {
          setIsphoneSubmitted(true);
            Axios.post('/auth/forgot', {
              phone: phone,
            }).then((response) => {
              setIsPhoneSent(true);
              setIsOtpSent(true);
              setIsphoneSubmitted(false);
            }).catch((error) => {
              setIsPhoneSent(false);
              setIsOtpSent(false);
              setIsphoneSubmitted(false);
              if (error.response && error.response.data) {
                setOpenAlert(true);
                setErrorMessage(error.response.data);
              } else {
                setOpenAlert(true);
                setErrorMessage("An error occurred");
              }
            })
        
        }
        const handleReset = () => {
          setIsSubmited(true);
          if(password !== confirmPassword){
            setErrorMessage("Password should be the same.");
          }else{
          Axios.post('/auth/reset', {
            phone:phone,
            newPassword:password,
            otp:otp,
          }).then((response) => {
            refreshUser(null)
            localStorage.setItem("user", JSON.stringify(null))
              navigate('/login');
              setIsSubmited(false);
          }).catch((error) => {
            if (error.response && error.response.data) {
              setOpenAlert(true);
              setErrorMessage(error.response.data);
            } else {
              setOpenAlert(true);
              setErrorMessage("An error occurred");
            }
            setIsSubmited(false);
          })
        }
        }
        const handleChange = (newValue) => {
          setOtp(newValue);
        }
        const handleOtp = (value) => {
          setIsOtpSubmitted(true);
        Axios.post('/auth/otpcheck', {
          phone:phone,
          otp:value,
        }).then((response) => {
           setIsOtpSent(false);
           setIsOtpSubmitted(false);
           setIsPassword(true);
        }).catch((error) => {
         setIsOtpSent(true);
         setIsOtpSubmitted(false);
         if (error.response && error.response.data) {
          setOpenAlert(true);
          setErrorMessage(error.response.data);
        } else {
          setOpenAlert(true);
          setErrorMessage("An error occurred");
        }
        })
        }
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            px: 2,
            py: 6,
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
          {!isPhoneSent ? 'Enter Your phone number' : (isOtpSent ? "Please enter the 6-digit OTP sent to your phone within 3 minutes." : 'Enter the credentials below to reset your password')}
        </Typography>
          <Box   sx={{ mt: 1 }} width='100%' padding={0} margin={0}>
            {!isPhoneSent &&<TextField
              margin="normal"
              required
              fullWidth
              id="number"
              label="Enter Phone Number"
              name="phone"
              autoComplete="phone"
              autoFocus
              onChange={(e) => setPhone(e.target.value)}
            />}
            {!isPhoneSent &&  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            // sx={{ marginLeft: 'auto' }}
            onClick={() => handlePhone()}
          >
            {isPhoneSubmitted ? (<span style={{display:"flex"}}>please wait... <CircularProgress color='primary' size={30} /></span>) : 'Submit Phone'}
          </Button>
        </Box>}
        {isOtpSubmited && <LinearProgress  color='secondary'/>}
        {isOtpSent && <MuiOtpInput value={otp} onChange={handleChange} length={6} onComplete={handleOtp}/>}
        {isOtpSent &&  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            sx={{ marginLeft: 'auto', mt:'5px'}}
            onClick={() => handlePhone()}
          >
            {isPhoneSubmitted ? (<span style={{display:"flex"}}>please wait... <CircularProgress color='primary' size={30} /></span>) : "Did not receive the OTP?"}
          </Button>
        </Box>}
            {isPassword &&   <FormControl fullWidth>
              <InputLabel>Enter New Password</InputLabel>
            <OutlinedInput
              margin="normal"
              required
              fullWidth
              name="password"
              label="Enter New Password"
              type={showPassword ? "text" : "password"}
              id="password"
              sx={{mb:'5px'}}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
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
            }
            {isPassword &&  <FormControl fullWidth>
              <InputLabel>Confirm Password</InputLabel>
            <OutlinedInput
              margin="normal"
              required
              fullWidth
              name="cpassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              id="password"
              autoComplete="c-password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handlleClickShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            </FormControl>
            }
          {isPassword && <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => handleReset()}
            >
            {isSubmited ? (<span style={{display:"flex"}}>please wait... <CircularProgress color='primary' size={30} /></span>) : 'Submit'}
            </Button>}
            <Grid container>
              <Grid item xs>
                <Link to="/login" variant="body2">
                 Back to login
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}