import {  Box, Button,  FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import Axios from 'axios';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Message from "../../../components/admincomponents/Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
const AddWareHouse = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isAdded, setIsAdded] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openAlert, setOpenAlert] = useState(true);
  const navigate = useNavigate();
  const handleFormSubmit = (values, {resetForm}) => {
    setIsAdded(true);
   Axios.post('/warehouse/add', {
    name: values.name,
    type: values.type,
   }).then((response) => {
    setIsAdded(false);
    setOpenAlert(true);
    setMessage('Warehouse Added Successfully!');
    resetForm();
    navigate('/view_ware_house');
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



  return (
    <Box m="20px">
      <Header title="ADD WAREHOUSE" />
      <Message message={message} openAlert={openAlert}  setOpenAlert={setOpenAlert} severity='success'/>
      <Message message={errorMessage} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='error'/>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end',mb:'20px' }}>
        <Button
          variant="contained"
          href="/view_ware_house"
          startIcon={<FontAwesomeIcon icon={faList}  size="30px"/>}
          sx={{ marginLeft: 'auto' }}
        >
          Warehouse List
        </Button>
      </Box>
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
                label="Warehouse Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />
              <FormControl sx={{gridColumn: "span 4" }}
                error={!!touched.type && !!errors.type}>
                <InputLabel id="demo-simple-select-helper-label">Select Warehouse Type</InputLabel>
              <Select
               fullWidth
               variant="outlined"
               error={!!touched.type && !!errors.type}
               helperText={touched.type && errors.type}
               sx={{ gridColumn: "span 4" ,color: "white"}}
               value={values.type}
               name="type"
               label="Store Type"
               onBlur={handleBlur}
               onChange={handleChange}
              >
                <MenuItem value='Main Store'>Main Store</MenuItem>
                <MenuItem value='Sub Store'>Sub Store</MenuItem>
                <MenuItem value='Shop'>Shop</MenuItem>
              </Select>
              <FormHelperText>{touched.type && errors.type}</FormHelperText>
              </FormControl>
              
              <Box display="flex" justifyContent="end" mt="10px">
              <Button type="submit" color="secondary" variant="contained" disabled ={isAdded}>
                {isAdded ? <CircularProgress color="secondary" size={30}/> : 'ADD WAREHOUSE'}
              </Button>
            </Box>
            </Box>
            
          </form>
        )}
      </Formik>
    </Box>
  );
};


const checkoutSchema = yup.object().shape({
  name: yup.string().required("Warehouse name required"),
  type: yup.string().required("Warehouse type required"),
});
const initialValues = {
  type: "",
  name: ""
 
};

export default AddWareHouse;
