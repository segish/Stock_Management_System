import { Alert, Box, Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Select, TextField, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import Axios from 'axios';
import {useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import { useLocation, useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import { faEdit, faList, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { styled } from '@mui/material/styles';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialog-paper': {
    width: '100%',
  },
}));
const EditItems = () => {
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isEddited, setIsEddited] = useState(false);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();
  const [openAlert, setOpenAlert] = useState(true);
  const location = useLocation();
  const rowData = location.state.rowData;
  const [itemType, setItemType] = useState([]);
  const [specifi, setSpecification] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecifications, setSelectedSpecifications] = useState([]);
  const [specii, setSpeci] = useState('');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isSpecificationAdded, setIsSpecificationAdded] = useState(false);
  const [editedSpecification, setEditedSpecification] = useState('');
  const [openCancle, setOpenCancle] = useState(false);
  const navigate = useNavigate();
  
  const initialValues = {
    itemcode: rowData.itemCode,
    itemname: rowData.name,
    itemtype: rowData.type
  };
  const colors = tokens(theme.palette.mode);
  const handleFormSubmit = (values, {resetForm}) => {
    setIsEddited(true);
    Axios.post(`/items/update/${rowData._id}`, {
      initialItemcode: rowData.itemCode,
      name: values.itemname,
      itemCode: values.itemcode,
      type:values.itemtype,
      specification:selectedSpecifications.join("/"),
    }).then((response) => {
      setOpenAlert(true);
      setMessage(`Item Updated Successfully!`);
      resetForm();
      setIsEddited(false);
      navigate('/view_items');
    }).catch((error) => {
      if (error.response && error.response.data) {
        setOpenAlert(true);
        setErrorMessage(error.response.data);
      } else {
        setOpenAlert(true);
        setErrorMessage("An error occurred");
      }
      setIsEddited(false);
    });
  };
  const handleSpecificationChange = () => {
    setIsSpecificationAdded(false);
    const isSpecification = selectedSpecifications.includes(specii);
      if (!isSpecification) {
        setSelectedSpecifications([...selectedSpecifications, specii]);
        setSpeci('');
        setIsSpecificationAdded(true);
      } else {
        setOpenAlert(true);
        setErrorMessage('The specification is already added.');
        setIsSpecificationAdded(true);
      }
  };
  const handleSpecificationEdit = () => {
    const index = selectedSpecifications.indexOf(specifi);
    if (index !== -1) {
      const updatedSpecifications = [...selectedSpecifications];
      updatedSpecifications.splice(index, 1, editedSpecification);
      setSelectedSpecifications(updatedSpecifications);
      setOpenCancle(false);
    } else {
      setSelectedSpecifications([...selectedSpecifications, editedSpecification]);
      setOpenCancle(false);
    }
  };
  const handleRemoveSpecification = (specification) => {
    const updatedSpecifications = selectedSpecifications.filter(
      (spec) => spec !== specification
    );
    setSelectedSpecifications(updatedSpecifications);
  };
  const handleCancleClose = () => {
    setOpenCancle(false);
  };
  const handleCancleClickOpen = (speci) => {
    setSpecification(speci);
    setEditedSpecification(speci);
    setOpenCancle(true);
};
useEffect(() => {
  Axios.get('/type/getall').then((response) => {
    setItemType(response.data);
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
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
  useEffect(() => {
  setSelectedSpecifications(rowData.specification.split('/'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Box m="20px">
      <Header title="EDIT ITEM "  />
      {errorMessage && <Box sx={{ width: '100%' }}>
      <Collapse in={openAlert}>
        <Alert
        severity="error"
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
    {loading && <LinearProgress color="secondary"/>}
    <Box sx={{ display: 'flex', justifyContent: 'flex-end',mb:'20px' }}>
        <Button
          variant="contained"
          href="/view_items"
          startIcon={<FontAwesomeIcon icon={faList}  size="30px"/>}
          sx={{ marginLeft: 'auto' }}
        >
          Item List
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
          <form onSubmit={handleSubmit} action="" method="post">
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                marginBottom: '30px',
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
                label="Item Code"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.itemcode}
                name="itemcode"
                error={!!touched.itemcode && !!errors.itemcode}
                helperText={touched.itemcode && errors.itemcode}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                label="Item Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.itemname}
                name="itemname"
                error={!!touched.itemname && !!errors.itemname}
                helperText={touched.itemname && errors.itemname}
                sx={{ gridColumn: "span 4" }}
              />
             
             <FormControl sx={{gridColumn: "span 4" }}
                error={!!touched.itemtype && !!errors.itemtype}>
                <InputLabel id="demo-simple-select-helper-label">Choose Item Type</InputLabel>
              <Select
                fullWidth
                variant="outlined"
                error={!!touched.itemtype && !!errors.itemtype}
                helperText={touched.itemtype && errors.itemtype}
                sx={{ gridColumn: "span 4", color: "white" }}
                value={values.itemtype}
                name="itemtype"
                label="Item Type"
                onBlur={handleBlur}
                onChange={handleChange}
              >
                {itemType.map((item) => (
                  <MenuItem key={item.id} value={item.type}>{item.type}</MenuItem>
                ))}
              </Select>
              <FormHelperText>{touched.type && errors.type}</FormHelperText>
              </FormControl>
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                disabled ={!values.itemtype}
                label={values.itemtype ? "Add new Specifications" : "Item Type must be selected first"}
                onBlur={handleBlur}
                onChange={(e) => setSpeci(e.target.value)}
                value={specii}
                name="specification"
                error={!!touched.specification && !!errors.specification}
                helperText={touched.specification && errors.specification}
                sx={{ gridColumn: isMobile ? "span 3" : "span 3" }}
              />
              <Box display="flex" justifyContent="flex-end" fullWidth>
                <Button onClick={() => handleSpecificationChange()} color="secondary" variant="contained" disabled ={!values.itemtype || specii === ''}>
                 {isSpecificationAdded ? 'ADD MORE' : 'ADD SPECIFICATIONS'}
                </Button>
              </Box>
             { selectedSpecifications.length !== 0  && <div className="row" >
             <div className="d-flex align-items-center" style={{ display: 'flex', flexWrap: 'wrap' }}>
                {selectedSpecifications.map((specification) => (
                  <div key={specification} className="col-auto d-flex align-items-center" >
                    <Button variant="primary" >
                      {specification}
                    </Button>
                    <FontAwesomeIcon onClick={() => handleCancleClickOpen(specification)} icon={faEdit} />
                    <FontAwesomeIcon style={{marginLeft: '10px'}} onClick={() => handleRemoveSpecification(specification)} icon={faTimes} />
                        <BootstrapDialog
                          open={openCancle}
                          onClose={handleCancleClose}
                          aria-labelledby="customized-dialog-title"
                          fullWidth
                        >
                        <IconButton
                          aria-label="close"
                          onClick={() => handleCancleClose()}
                          sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                        <DialogTitle
                          >
                            Edit {specifi}
                          </DialogTitle>
                          <DialogContent dividers style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <TextField
                                sx={{
                                  marginBottom: '5px'
                                }}
                                required
                                fullWidth
                                variant="outlined"
                                type="text"
                                label={`Specification`}
                                value={editedSpecification}
                                name="quantity"
                                onChange={(e) => setEditedSpecification(e.target.value)}
                              />
                          </DialogContent>
                          <DialogActions dividers style={{ justifyContent: 'end' }}>
                          
                            <Button  variant="contained"
                              color="primary"  onClick={() => handleSpecificationEdit()}>
                              {'Edit'}
                            </Button>
                          </DialogActions>
                        </BootstrapDialog>
                  </div>
                   
                ))}
                </div>
              </div>}
              <Box display="flex" justifyContent="flex-end" mt="10px" py={1} fullWidth>
                <Button type="submit" color="secondary" variant="contained" disabled ={specii !== '' && selectedSpecifications.length !== 0} >
                 {isEddited ? <CircularProgress color="secondary" size={30} /> : 'EDIT ITEMS'}
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
  itemcode: yup.string().required("required"),
  itemname: yup.string().required("required"),
  itemtype: yup.string().required("required"),
});

export default EditItems;


