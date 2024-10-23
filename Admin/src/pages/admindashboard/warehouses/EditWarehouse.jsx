import { Alert, Box, Button, Collapse, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, TextField, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import Axios from 'axios';
import {  useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from "@mui/material/CircularProgress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
const EditWareHouse = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEdited, setIsEdited] = useState(false);
  const [openAlert, setOpenAlert] = useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const navigate = useNavigate();
  const  rowData = location.state.rowData;
  const initialValues = {
    type: rowData.type,
    name: rowData.name,
   
  };
  const handleFormSubmit = (values, {resetForm}) => {
    setIsEdited(true);
   Axios.post(`/warehouse/update/${rowData._id}`, {
    name: values.name,
    type: values.type,
   }).then((response) => {
    setIsEdited(false);
    setOpenAlert(true);
    setMessage('Warehouse Updated Successfully!');
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
    setIsEdited(false);
   })
  };
  return (
    <Box m="20px">
      <Header title="EDIT WAREHOUSE" />
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
              <Button type="submit" color="secondary" variant="contained"  disabled ={isEdited}>
                {isEdited ? <CircularProgress color="secondary" size={30}/> : 'EDIT WAREHOUSE'}
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
  name: yup.string().required("required"),
  type: yup.string().required("required"),
});


export default EditWareHouse;
