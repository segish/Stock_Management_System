import { Box, Button,  FormControl,  FormHelperText,  InputLabel,  MenuItem,  Select,  TextField, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Axios from 'axios';
import CircularProgress from "@mui/material/CircularProgress";
import Message from "../../../components/admincomponents/Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
import LinearProgress from "@mui/material/LinearProgress";
const EditUsers = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [isEdited, setIsEdited] = useState(false);
  const [openAlert, setOpenAlert] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCashier, setIsCashier] = useState(false);
  const [warehouseList, setwarehouseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const  rowData = location.state.rowData;
  const initialValues = {
    fullname: rowData.adminName,
    email: rowData.email,
    phone: rowData.phone,
    warehouse: rowData.warehouseName,
    substoreController:rowData.isSubstore,
  };
  const handleFormSubmit = (values, {resetForm}) => {
    setIsEdited(true);
   Axios.post(`/auth/update/${rowData._id}`, {
    adminName: values.fullname,
    email: values.email,
    phone: values.phone,
    warehouseName:values.warehouse,
    isSubstore: values.substoreController,
   }).then((response) => {
    setIsEdited(false);
    setOpenAlert(true);
    setMessage('User Updated Successfully!');
    resetForm();
    navigate('/view_users');
   }).catch((error) => {
    if (error.response && error.response.data) {
      setOpenAlert(true);
      setErrorMessage(error.response.data);
    } else {
      setOpenAlert(true);
      setErrorMessage("An error occurred");
    }
    setIsEdited(false);
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
   useEffect(() =>{
    if(rowData.type === "admin"){
      setIsAdmin(true);
      setIsCashier(false);
     }else if(rowData.type === "cashier"){
      setIsCashier(true);
      setIsAdmin(false);
      console.log('ware:' + rowData.warehouseName);
      console.log('status' + rowData.isSubstore);
     }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
  return (
    <Box m="20px">
      <Header title="EDIT USERS" subtitle="" />
      <Message message={message} openAlert={openAlert}  setOpenAlert={setOpenAlert} severity='success'/>
      <Message message={errorMessage} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='error'/>
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
              <Box display="flex" justifyContent="end" mt="10px"  >
              <Button type="submit" color="secondary" variant="contained">
               {isEdited ? <CircularProgress color="secondary" size={25}/> : 'EDIT USER'}
              </Button>
            </Box>
            </Box>
            
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  fullname: yup.string().required("required"),
  warehouse: yup.string().when('isCashier', {
    is: true,
    then: yup.string().required('Warehouse name is required'),
  }),
  substoreController: yup.string().when('isCashier', {
    is: true,
    then: yup.string().required('Substore controller is required'),
  }),
  email: yup.string().email("invalid email").required("Email required"),
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
});


export default EditUsers;
