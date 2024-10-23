import { Alert, Box, Button, Collapse, IconButton, TextField, useTheme } from "@mui/material";
import { Formik} from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Axios from 'axios';
import { useState } from "react";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from '@mui/icons-material/Close';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
const AddItemType = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEdited, setisEdited] = useState(false);
  const [openAlert, setOpenAlert] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const handleFormSubmit = (values, {resetForm}) => {
    setisEdited(true);
   Axios.post('/type/add', {
    type: values.itemtype,
   }).then((response) => {
    setisEdited(false);
    setOpenAlert(true);
    setMessage('Item Type Added Successfully!');
    resetForm();
    navigate('/view_item_type');
   }).catch((error) => {
    if (error.response && error.response.data) {
      setOpenAlert(true);
      setErrorMessage(error.response.data);
    } else {
      setOpenAlert(true);
      setErrorMessage("An error occurred");
    }
    setisEdited(false);
   })
  };

  return (
    <Box m="20px">
      <Header title="ADD ITEM TYPE" subtitle= {message} />
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
          href="/view_item_type"
          startIcon={<FontAwesomeIcon icon={faList}  size="30px"/>}
          sx={{ marginLeft: 'auto' }}
        >
          Item-type List
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
                label="Add Item Type"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.itemtype}
                name="itemtype"
                error={!!touched.itemtype && !!errors.itemtype}
                helperText={touched.itemtype && errors.itemtype}
                sx={{ gridColumn: "span 4" }}
              />
              
    
              
              <Box display="flex" justifyContent="end" mt="10px" >
              <Button type="submit" color="secondary" variant="contained" disabled = {isEdited}>
                {isEdited ? <CircularProgress color="secondary" size={30}/> : 'ADD ITEM TYPE'}
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
  itemtype: yup.string().required("required"),
});
const initialValues = {
  itemtype: "",
 
};

export default AddItemType;
