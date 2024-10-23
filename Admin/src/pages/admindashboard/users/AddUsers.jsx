import { Alert, Box, Button, Collapse, FormControl, FormHelperText, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import Axios from 'axios';
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import CloseIcon from '@mui/icons-material/Close';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
const AddUsers = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const [isAdded, setIsAdded] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage,  setErrorMessage] = useState('');
  const [openAlert, setOpenAlert] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCashier, setIsCashier] = useState(false);
  const [warehouseList, setwarehouseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const colors = tokens(theme.palette.mode);
  const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  fullname: yup.string().required("Full name required"),
  warehouse: yup.string().when('isCashier', {
    is: true,
    then: yup.string().required('Warehouse name is required'),
  }),
  substoreController: yup.string().when('isCashier', {
    is: true,
    then: yup.string().required('Substore controller is required'),
  }),
  type: yup.string().required("User type required"),
  email: yup.string().email("invalid email").required("Email required"),
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid").required('Phone Number required'),
  password: yup.string().required("Password required"),
  rpassword: yup.string().required("Confirm password required"),
});
const initialValues = {
  fullname: "",
  email: "",
  phone: "",
  password: "",
  rpassword: "",
  type: "",
  warehouse: "",
  substoreController:""
};
  const navigate = useNavigate();
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPasssword = () => setShowConfirmPassword((show) => !show);
  const handleFormSubmit = (values) => {
    setIsAdded(true);
    Axios.post('/auth/add', {
      adminName:values.fullname,
      email: values.email,
      phone: values.phone,
      warehouseName: values.warehouse,
      isSubstore: values.substoreController,
      type: values.type,
      password: values.password,
    }).then((response) => {
        setOpenAlert(true);
        setMessage(`User added successfully!`);
        setIsAdded(false);
        navigate('/view_users');
    }).catch((error) => {
      if (error.response && error.response.data) {
        setOpenAlert(true);
        setErrorMessage(error.response.data);
      } else {
        setOpenAlert(true);
        setErrorMessage("An error occurred");
      }
      setIsAdded(false);
    })
  };
  const handleUserTypeChange = (event, handleChange) => {
    const selecteduserType = event.target.value;
   if(selecteduserType === "admin"){
    setIsAdmin(true);
    setIsCashier(false);
   }else if(selecteduserType === "cashier"){
    setIsCashier(true);
    setIsAdmin(false);
   }
    handleChange(event); 
  };
  useEffect(() => {
    Axios.get('/warehouse/getall').then((response) => {
        setwarehouseList(response.data.filter((data) => data.type === "Shop"));
        setLoading(false);
       }).catch((error) => {
        if (error.response && error.response.data) {
          setOpenAlert(true);
          setErrorMessage(error.response.data);
        } else {
          setOpenAlert(true);
          setErrorMessage("An error occurred");
        }
        setLoading(false);
       })
}, []);
  return (
    <Box m="10px">
      <Header title="ADD NEW USER" subtitle="" />
      {errorMessage && <Box sx={{ width: '100%' }}>
      <Collapse in={openAlert}>
        <Alert
        severity="error"
          action={
            <IconButton
              aria-label="close"
              color="warning"
              size="small"
              onClick={() => {
                setOpenAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {errorMessage}
        </Alert>
      </Collapse>
    </Box>}
    {message && <Box sx={{ width: '100%' }}>
      <Collapse in={openAlert}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpenAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      </Collapse>
    </Box>}
    <Box sx={{ display: 'flex', justifyContent: 'flex-end',mb:'20px' }}>
        <Button
          variant="contained"
          href="/view_users"
          startIcon={<FontAwesomeIcon icon={faList}  size="30px"/>}
          sx={{ marginLeft: 'auto' }}
        >
          User List
        </Button>
      </Box>
    {isCashier && loading && <LinearProgress color="secondary"/>}
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                marginBottom:'30px',
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                borderRadius: '10px',
                backgroundColor: colors.primary[400],
                padding: '30px',
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >

              <TextField
                fullWidth
                variant="outlined"
                type="text"
                label="Full Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fullname}
                name="fullname"
                error={!!touched.fullname && !!errors.fullname}
                helperText={touched.fullname && errors.fullname}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="outlined"
                type="email"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 2" }}
              />
               <TextField
                fullWidth
                variant="outlined"
                type="text"
                label="Phone Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone}
                name="phone"
                error={!!touched.phone && !!errors.phone}
                helperText={touched.phone && errors.phone}
                sx={{ gridColumn: "span 2" }}
              />
              <FormControl sx={{gridColumn: "span 2" }}
                error={!!touched.type && !!errors.type}>
                <InputLabel id="demo-simple-select-helper-label">Choose User Type</InputLabel>
               <Select
               fullWidth
               variant="outlined"
               error={!!touched.type && !!errors.type}
               helperText={touched.type && errors.type}
               sx={{ gridColumn: "span 2" ,color: "white"}}
               value={values.type}
               name="type"
               label="User Type"
               onBlur={handleBlur}
               onChange={(e) => handleUserTypeChange(e, handleChange)}
              >
                <MenuItem value='admin'>Admin</MenuItem>
                <MenuItem value='cashier'>Cashier</MenuItem>
              </Select>
              <FormHelperText>{touched.type && errors.type}</FormHelperText>
              </FormControl>

              {
             !isAdmin && isCashier && <FormControl sx={{gridColumn: "span 4" }}
                 error={ isCashier && !!touched.warehouse && !!errors.warehouse}>
                 <InputLabel id="demo-simple-select-helper-label">Choose the warehouse that the cashier will oversee.</InputLabel>
                <Select
                fullWidth
                variant="outlined"
                error={isCashier && !!touched.warehouse && !!errors.warehouse}
                helperText={isCashier && touched.warehouse && errors.warehouse}
                sx={{ gridColumn: "span 4" ,color: "white"}}
                value={values.warehouse}
                name="warehouse"
                label="Warehouse name"
                onBlur={handleBlur}
                onChange={(e) => handleUserTypeChange(e, handleChange)}
               >
                  {
                 warehouseList.map((warehouse) => (
                    <MenuItem key={warehouse.id} value={warehouse.name}>{warehouse.name}</MenuItem>
                  ))
                  }
               </Select>
              { isCashier && <FormHelperText>{ touched.warehouse && errors.warehouse}</FormHelperText>}
               </FormControl>
              }
              {
              !isAdmin &&  isCashier && <FormControl sx={{gridColumn: "span 4" }}
                 error={isCashier && !!touched.substoreController && !!errors.substoreController}>
                 <InputLabel id="demo-simple-select-helper-label">Does the cashier oversee the substore?</InputLabel>
                <Select
                fullWidth
                variant="outlined"
                error={ isCashier && !!touched.substoreController && !!errors.substoreController}
                helperText={ isCashier && touched.substoreController && errors.substoreController}
                sx={{ gridColumn: "span 4" ,color: "white"}}
                value={values.substoreController}
                name="substoreController"
                label="Warehouse name"
                onBlur={handleBlur}
                onChange={(e) => handleUserTypeChange(e, handleChange)}
               >
                 <MenuItem value = {true}>Yes</MenuItem>
                 <MenuItem value = {false}>No</MenuItem>
               </Select>
               {isCashier && <FormHelperText>{ touched.substoreController && errors.substoreController}</FormHelperText>}
               </FormControl>
              }
              <FormControl sx={{gridColumn: "span 4" }} fullWidth>
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                fullWidth
                variant="outlined"
                type={showPassword ? "text" : "password"}
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: "span 4" }}
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
              <FormControl sx={{gridColumn: "span 4" }} fullWidth>
              <InputLabel>Confirm Password</InputLabel>
              <OutlinedInput
                fullWidth
                variant="outlined"
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.rpassword}
                name="rpassword"
                error={!!touched.rpassword && !!errors.rpassword}
                helperText={touched.rpassword && errors.rpassword}
                sx={{ gridColumn: "span 4" }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPasssword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              </FormControl>
              <Box display="flex" justifyContent="end" mt="10px"  >
              <Button type="submit" color="secondary" variant="contained" disabled ={isAdded}>
                {isAdded ? <CircularProgress color="secondary" size={30}/> : 'ADD NEW USERS'}
              </Button>
            </Box>
            </Box>
            
          </form>
        )}
      </Formik>
    </Box>
  );
};



export default AddUsers;
