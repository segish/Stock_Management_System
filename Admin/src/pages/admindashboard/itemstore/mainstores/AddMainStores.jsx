import { Box, Button,  FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../../../components/Header";
import Axios from 'axios';
import { useEffect, useState } from "react";
import { tokens } from "../../../../theme";
import CircularProgress from '@mui/material/CircularProgress';
import Message from "../../../../components/admincomponents/Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";
const AddMainStoreItems = () => {
  const [itemType , setItemType] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [filteredItemList, setFilteredItemList] = useState([]);
  const [warehouseName, setWarehouseName] = useState([]);
  const [specification, setSpecification] = useState([]);
  const [itemName, setItemName] = useState([]);
  const [itemCode, setItemCode] = useState([]);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openAlert, setOpenAlert] = useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(false);
  const handleFormSubmit = (values, { resetForm }) => {
    setLoading(true);
    Axios.post('/mainstore/add', {
    name: itemName,
    itemCode: itemCode,
    specification: specification,
    type: values.itemtype,
    warehouseName: values.warehouseName,
    quantity: values.quantity,
   }).then((response) => {
    setOpenAlert(true);
    setMessage(` ${response.data}`);
    setLoading(false);
    resetForm();
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
  };
  const handleItemTypeChange = (event, handleChange) => {
    const selectedItemType = event.target.value;
    const filteredItems = itemList
      .filter((item) => item.type === selectedItemType);
    setFilteredItemList(filteredItems);
    handleChange(event); 
  };
  const handleItemNameChange = (event, handleChange) => {
    const selectedItemCode = event.target.value;
    const filteredItems = filteredItemList.filter((item) => item.itemCode === selectedItemCode);
    if (filteredItems.length > 0) {
      const selectedName = filteredItems[0].name;
      const selectedItemCode = filteredItems[0].itemCode;
      const selectedSpecification = filteredItems[0].specification;
      setItemName(selectedName);
      setItemCode(selectedItemCode);
      setSpecification(selectedSpecification);
    } else {
      setItemName("");
      setSpecification([]);
    }
    handleChange(event);
  };
  useEffect(() => {
    Axios.get('/type/getall').then((response) => {
        setItemType(response.data);
        Axios.get('/items/getall').then((response) => {
        setItemList(response.data);
        }).catch((error) => {
            if (error.response && error.response.data) {
              setOpenAlert(true);
          setErrorMessage(error.response.data);
        } else {
          setOpenAlert(true);
          setErrorMessage("An error occurred");
        }
        })
       }).catch((error) => {
        if (error.response && error.response.data) {
          setOpenAlert(true);
          setErrorMessage(error.response.data);
        } else {
          setOpenAlert(true);
          setErrorMessage("An error occurred");
        }
       })
       // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
  useEffect(() => {
    Axios.get('/warehouse/getall').then((response) => {
      const filteredWarehouse = response.data.filter((warehouse) => warehouse.type === "Main Store");
      setWarehouseName(filteredWarehouse);
    }).catch((error) => {
      if (error.response && error.response.data) {
        setOpenAlert(true);
        setErrorMessage(error.response.data);
      } else {
        setOpenAlert(true);
        setErrorMessage("An error occurred");
      }
    })
  }, []);


  return (
    <Box m="20px">
      <Header title="IMPORT NEW ITEMS" />
      <Message message={message} openAlert={openAlert}  setOpenAlert={setOpenAlert} severity='success'/>
      <Message message={errorMessage} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='error'/>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end',mb:'20px' }}>
        <Button
          variant="contained"
          href="/mainstore"
          startIcon={<FontAwesomeIcon icon={faList}  size="30px"/>}
          sx={{ marginLeft: 'auto' }}
        >
          Main Store Items
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
              <FormControl sx={{gridColumn: "span 4" }}
                error={!!touched.itemtype && !!errors.itemtype}>
                <InputLabel id="demo-simple-select-helper-label">Choose Item Type</InputLabel>
              <Select
               fullWidth
               variant="outlined"
               error={!!touched.itemtype && !!errors.itemtype}
               helperText={touched.itemtype && errors.itemtype}
               sx={{ gridColumn: "span 4" ,color: "white"}}
               value={values.itemtype}
               name="itemtype"
               label="Item Type"
               onBlur={handleBlur}
               onChange={(event) => handleItemTypeChange(event, handleChange)}
              >
                {
                 itemType.map((item) => (
                    <MenuItem key={item.id} value={item.type}>{item.type}</MenuItem>
                  ))
                }
                
              </Select>
              <FormHelperText>{touched.itemtype && errors.itemtype}</FormHelperText>
              </FormControl>
              <FormControl sx={{gridColumn: "span 4" }}
                error={!!touched.name && !!errors.name}>
                <InputLabel id="demo-simple-select-helper-label">{'Choose  Item Name'}</InputLabel>
              <Select
               fullWidth
               variant="outlined"
               error={!!touched.name && !!errors.name}
               helperText={touched.name && errors.name}
               sx={{ gridColumn: "span 4" ,color: "white"}}
               value={values.name}
               name="name"
               label="Item Type"
               onBlur={handleBlur}
               onChange={(event) => handleItemNameChange(event, handleChange)}
              >
                {
                  filteredItemList.map((itemName) => (
                    <MenuItem key={itemName.id} value={itemName.itemCode}>{`${itemName.itemCode} / ${itemName.name} / ${itemName.specification}`}</MenuItem>
                    ))
                  }
                
              </Select>
              <FormHelperText>{touched.name && errors.name}</FormHelperText>
              </FormControl>
             
              <TextField
                fullWidth
                variant="outlined"
                type="number"
                label="Quantity"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.quantity}
                name="quantity"
                error={!!touched.quantity && !!errors.quantity}
                helperText={touched.quantity && errors.quantity}
                sx={{ gridColumn: "span 4" }}
              />
              <FormControl sx={{ gridColumn: "span 4" }}
                error={!!touched.warehouseName && !!errors.warehouseName}>
                <InputLabel id="demo-simple-select-helper-label">{'Choose warehouse Name'}</InputLabel>
                <Select
                  fullWidth
                  variant="outlined"
                  error={!!touched.warehouseName && !!errors.warehouseName}
                  helperText={touched.warehouseName && errors.warehouseName}
                  sx={{ gridColumn: "span 4", color: "white" }}
                  value={values.warehouseName}
                  name="warehouseName"
                  label="warehouse name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                >
                  {
                    warehouseName.map((warehouse) => (
                      <MenuItem key={warehouse.id} value={warehouse.name}>{warehouse.name}</MenuItem>
                    ))
                  }
                </Select>
                <FormHelperText>{touched.warehouseName && errors.warehouseName}</FormHelperText>
              </FormControl>
              <Box display="flex" justifyContent="end" mt="10px" >
              <Button type="submit" color="secondary" variant="contained" disabled={loading}>
              {loading ? <CircularProgress color="secondary" size={24} /> : 'ADD ITEMS'}
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
  itemtype: yup.string().required("Item type required!!!"),
  name: yup.string().required("Item name required!!!"),
  warehouseName: yup.string().required("warehouse name required!!!"),
  quantity: yup.string().required("Quantity required!!!"),
});
const initialValues = {
  itemtype: "",
  name: "",
  code: "",
  specification: "",
  warehouseName: "",
  quantity: "",
 
};

export default AddMainStoreItems;
