import {Box, Button,  Checkbox,  Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../../theme";
import Header from "../../../../components/Header";
import { useTheme } from "@mui/material";
import Axios from 'axios';
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Message from "../../../../components/admincomponents/Message";
import { styled } from '@mui/material/styles';
import { Link } from "react-router-dom";
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialog-paper': {
    width: '100%', // Adjust the width as needed
  },
}));
 function CustomTabPanel(props){
  const { children, value, index, shopitems, setReload, reload, ...other } = props;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(true);
  const [custName, setCustName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [phone, setPhone] = useState('');
  const [chequeNumber, setChequeNumber] = useState(null);
  const [credit, setCredit] = useState(false);
  const [transfer, setTransfer] = useState(false);
  const [isPtransfer, setIsPtransfer] = useState(false);
  const [cash, setCash] = useState(false);
  const [partialPayment, setPartialPayment] = useState(false);
  const [paidAmount, setPaidAmount] = useState('');
  const [cashOrTransfer, setCashOrTransfer] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaled, setIsSaled] = useState(false);
  const [checked, setChecked] = React.useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [openHover, setOpenHover] = useState(false);
  const [data, setData] = useState(null);
  const handleTransactionType = (value) => {
        if(value === "transfer"){
          setTransfer(true);
          setCredit(false);
          setPartialPayment(false);
          setIsPtransfer(false);
          setTransactionType(value);
        }else if(value === 'credit'){
          setCredit(true);
          setTransfer(false);
          setPartialPayment(false);
          setIsPtransfer(false);
          setTransactionType(value);
        }else if(value === 'partial_payment'){
          setPartialPayment(true);
          setCredit(false);
          setTransfer(false);
          setTransactionType(value);
        }else{
          setTransactionType(value);
          setTransfer(false);
          setPartialPayment(false);
          setIsPtransfer(false);
          setCredit(false);
        }
        setPaidAmount('');
        setPhone('');
        setChequeNumber(null);
        setBankName('');
        setAccountNumber('');
  }
const handleClickOpen = (row) => {
  setSelectedRow(row);
  setOpen(true);
};
    const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
    };
  const saleResetForm = () => {
    setCustName('');
    setPrice('');
    setQuantity('');
    setTransactionType('');
    setErrorMessage('');
    setCashOrTransfer('');
    setPaidAmount('');
    setPartialPayment(false);
    setIsPtransfer(false);
    setIsSaled(false);
    setTransfer(false);
    setChecked(false);
    setCredit(false);
  };
  const handleSale = (selectedrow) => {
    setIsSaled(true);
    if(transactionType ==='credit'){
      Axios.post(`/Shop/transaction/${selectedrow._id}`, {
        quantity: quantity,
        customerName: custName,
        paymentMethod: transactionType,
        amount: price,
        phone: phone,
        cheque: chequeNumber,
      }).then((response) => {
          setIsSaled(false);
          setOpenAlert(true);
          setMessage(`${quantity}  ${selectedrow.name} solled with credit successfully!!` );
          setOpen(false);
          setCustName('');
          setPrice('');
          setQuantity('');
          setTransfer(false);
          setCredit(false);
          setTransactionType('');
          setErrorMessage('');
          saleResetForm();
          setReload(!reload);
        }).catch((error) => {
          if (error.response && error.response.data) {
            setOpenAlert(true);
            setErrorMessage(error.response.data);
          } else {
            setOpenAlert(true);
            setErrorMessage("An error occurred");
          }
          setIsSaled(false);
        })
    }else if(transactionType ==='transfer'){
      Axios.post(`/Shop/transaction/${selectedrow._id}`, {
        quantity: quantity,
        amount: price,
        customerName: custName,
        paymentMethod: `${transactionType}(Bank N: ${bankName}, Acc No: ${accountNumber})`,
      }).then((response) => {
        setOpen(false);
        setIsSaled(false);
        setOpenAlert(true);
        setMessage("Sale Adedded successfully!! ");
        setCustName('');
        setPrice('');
        setQuantity('');
        setTransfer(false);
        setCredit(false);
        setTransactionType('');
        setErrorMessage('');
        saleResetForm();
        setReload(!reload);
      }).catch((error) => {
        if (error.response && error.response.data) {
          setOpenAlert(true);
          setErrorMessage(error.response.data);
        } else {
          setOpenAlert(true);
          setErrorMessage("An error occurred");
        }
        setIsSaled(false);
      })
    }else if(transactionType === 'partial_payment'){
      Axios.post(`/Shop/transaction/${selectedrow._id}`,{
        quantity: quantity,
        customerName: custName,
        paymentMethod: "halfpaid",
        amount: price,
        phone: phone,
        cheque: chequeNumber,
        halfPayMethod:cash ? cashOrTransfer : `${cashOrTransfer}(Bank N: ${bankName}, Acc No: ${accountNumber})`,
        paidamount: paidAmount
      }).then((response) => {
        setOpenAlert(true);
        setMessage(`${quantity}  ${selectedrow.name} solled with both ${cashOrTransfer} and credit successfully!!` );
        setOpen(false);
        setCustName('');
        setPrice('');
        setQuantity('');
        setTransactionType('');
        setErrorMessage('');
        setTransfer(false);
        setCredit(false);
        setIsSaled(false);
        saleResetForm();
        setReload(!reload);
      }).catch((error) => {
        if (error.response && error.response.data) {
          setOpenAlert(true);
          setErrorMessage(error.response.data);
        } else {
          setOpenAlert(true);
          setErrorMessage("An error occurred");
        }
        setIsSaled(false);
      })
       }else{
      Axios.post(`/Shop/transaction/${selectedrow._id}`, {
        quantity: quantity,
        amount: price,
        customerName: custName,
        paymentMethod: transactionType,
      }).then((response) => {
        setOpen(false);
        setIsSaled(false);
        setOpenAlert(true);
        setMessage(`${quantity}  ${selectedrow.name} solled successfully!!` );
        setCustName('');
        setPrice('');
        setQuantity('');
        setTransfer(false);
        setCredit(false);
        setTransactionType('');
        setErrorMessage('');
        saleResetForm();
        setReload(!reload);
      }).catch((error) => {
        if (error.response && error.response.data) {
          setOpenAlert(true);
          setErrorMessage(error.response.data);
        } else {
          setOpenAlert(true);
          setErrorMessage("An error occurred");
        }
        setIsSaled(false);
      })
    }
    }
  const handleChange = (event) => {
    setChecked(event.target.checked);
    if(event.target.checked === false){
      setChequeNumber(null)
    }
  };
  const handlePaymentType = (value) => {
    if(value === "transfer"){
      setIsPtransfer(true);
      setCash(false);
      setCashOrTransfer(value);
    }else{
      setCash(true);
      setIsPtransfer(false);
      setCashOrTransfer(value);
    }
  }
  const handleCloseHover = () => {
    setOpenHover(false);
    setData(null);
  };
  const handleHoverOpen = (data) => {
    setOpenHover(true);
    setData(data);
    };
  const getRowId = (row) => {
    return row._id;
  };
  const columns = [
    {
      field: "itemCode",
      headerName: "Item Code",
      width:isMobile&& 120,
      flex:!isMobile&&1,
      cellClassName: "name-column--cell",
    },
    {
      field: "name",
      headerName: "Item Name",
      width:isMobile&& 120,
      flex:!isMobile&&1,
      cellClassName: "name-column--cell",
    },
   
      {
        field: "specification",
        headerName: "Item Specification",
        width:isMobile&& 120,
        flex:!isMobile&&1,
        cellClassName: "name-column--cell",
        renderCell: function (params) {
          return (
            <div style={{color:'white', cursor:'pointer'}} onClick={() => handleHoverOpen(params.value)}>{params.value}</div>
          );
        }
      },
      {
        field: "quantity",
        headerName: "Quantity",
        width:isMobile&& 120,
        flex:!isMobile&&1,
        cellClassName: "name-column--cell",
      },
      {
        field: "pendingSaleQuantity",
        headerName: "Pending Sales",
        width:isMobile&& 120,
        flex:!isMobile&&1,
        cellClassName: "name-column--cell",
        renderCell: (params) => (
          <Link to={`/pendingshopsales`} style={{color:'white', cursor:'pointer'}}>
            {params.value}
          </Link>
        ),
      },
    {
        field: "sale",
        headerName: "Sale",
        renderCell: ({ row }) => {
          return <button onClick={() => handleClickOpen(row)} className="btn btn-primary mx-1 ">Sale</button>;
        },
      },
  ];
  return(
    <>
     <Message message={message} openAlert={openAlert}  setOpenAlert={setOpenAlert} severity='success'/>
      <Message message={errorMessage} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='error'/>
      <BootstrapDialog
        open={openHover}
        onClose={handleCloseHover}
        aria-labelledby="customized-dialog-title"
        fullWidth
      >
    <IconButton
        aria-label="close"
        onClick={() => handleCloseHover()} 
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
        <DialogContent dividers style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', textAlign:'center' }}>
        <Typography variant="body1">
         {data && data}
        </Typography>
        </DialogContent>
    </BootstrapDialog>
     <BootstrapDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="costomized-dialog-title"
      >
       <DialogTitle
      id="costomized-dialog-title"
    >
      Sale of {selectedRow && selectedRow.name} from Shop
    </DialogTitle>
    <IconButton
        aria-label="close"
        onClick={() => {handleClose(); saleResetForm()}}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
        {errorMessage && <DialogTitle>
        <Message message={errorMessage} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='error'/>
        </DialogTitle>}
        <DialogContent dividers>
          <TextField
            required
            label="Customer Name"
            value={custName}
            onChange={(e) => setCustName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            required
            type="number"
            label={`How Many ${ selectedRow && selectedRow.name} ?`}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
            margin="normal"
          />
           <TextField
            required
            label={`Unit Price (Price for 1 ${selectedRow && selectedRow.name})`}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl
           fullWidth
           sx={{gridColumn: "span 4" }}>
                 <InputLabel id="demo-simple-select-helper-label">Select Transaction Type</InputLabel>
           <Select
           required
            label="Transaction Type"
            value={transactionType}
            onChange={(e) => handleTransactionType(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="transfer">Transfer</MenuItem>
            <MenuItem value="cash">Cash</MenuItem>
            <MenuItem value="credit">Credit</MenuItem>
            <MenuItem value="partial_payment">PartialPayment</MenuItem>
          </Select>
          </FormControl>
          {transfer && 
           <TextField
           required
             label="Bank Name"
             type="text"
             value={bankName}
             onChange={(e) => setBankName(e.target.value)}
             fullWidth
             margin="normal"
           />
          }
          { transfer &&  <TextField
          required
            label="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            fullWidth
            margin="normal"
          />}
            { partialPayment &&  <TextField
       required
         label="Paid Amount"
         type="text"
         value={paidAmount}
         onChange={(e) => setPaidAmount(e.target.value)}
         fullWidth
         margin="normal"
       />}
        {partialPayment && 
       <FormControl
       fullWidth
       sx={{gridColumn: "span 4" }}>
         <InputLabel id="demo-simple-select-helper-label">Choose Payment Type</InputLabel>
       <Select
         required
         value={cashOrTransfer}
         onChange={(e) => handlePaymentType(e.target.value)}
         fullWidth
         margin="normal"
       >
         <MenuItem value="transfer">Transfer</MenuItem>
         <MenuItem value="cash">Cash</MenuItem>
       </Select>
       </FormControl>
       }
       { isPtransfer && !cash && <TextField
       required
         label="Bank Name"
         type="text"
         value={bankName}
         onChange={(e) => setBankName(e.target.value)}
         fullWidth
         margin="normal"
       />}

       { isPtransfer && !cash && <TextField
       required
         label="Account Number"
         value={accountNumber}
         onChange={(e) => setAccountNumber(e.target.value)}
         fullWidth
         margin="normal"
       />}
        {partialPayment && <TextField
       required
         label="phone Number"
         value={phone}
         onChange={(e) => setPhone(e.target.value)}
         fullWidth
         margin="normal"
         type="number"
       />}
       {partialPayment && <FormControlLabel required control={<Checkbox onChange={handleChange} />} label="Have Cheque book?"  />}
       {partialPayment && checked && <TextField
         required
         label="Enter Cheque Number?"
         value={chequeNumber}
         onChange={(e) => setChequeNumber(e.target.value)}
         fullWidth
         margin="normal"
         type="number"
       />}
          {credit && <FormControlLabel required control={<Checkbox onChange={handleChange} />} label="Have Cheque book?"  />}
          {credit && checked && <TextField
         required
         label="Enter Cheque Number?"
         value={chequeNumber}
         onChange={(e) => setChequeNumber(e.target.value)}
         fullWidth
         margin="normal"
         type="number"
       />}
          {credit && <TextField
          required
            label="phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            margin="normal"
          />}
        </DialogContent>
        <DialogActions>
          <Button style={{ color: 'white' }} onClick={() => {handleSale(selectedRow)}} disabled ={isSaled}>
            {isSaled ? <CircularProgress color="secondary" size={30} /> : 'Sale'}
          </Button>
        </DialogActions>
     </BootstrapDialog>
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
        margin={0}
         height="75vh"
         sx={{
           "& .MuiDataGrid-root": {
             border: "none",
           },
           "& .MuiDataGrid-cell": {
             borderBottom: "none",
           },
           "& .name-column--cell": {
             color: colors.greenAccent[300],
           },
           "& .MuiDataGrid-columnHeaders": {
             backgroundColor: colors.blueAccent[700],
             borderBottom: "none",
           },
           "& .MuiDataGrid-virtualScroller": {
             backgroundColor: colors.primary[400],
           },
           "& .MuiDataGrid-footerContainer": {
             borderTop: "none",
             backgroundColor: colors.blueAccent[700],
           },
           "& .MuiCheckbox-root": {
             color: `${colors.greenAccent[200]} !important`,
           },
           "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
             color: `${colors.grey[100]} !important`,
           },
           flexGrow: '1',
           overflowX: 'auto',
           scrollbarWidth: 'none',
           msOverflowStyle: 'none',
           '&::-webkit-scrollbar': {
             width: '0.4em', 
           },
           '&::-webkit-scrollbar-thumb': {
             backgroundColor: 'transparent', 
           },
          padding:'0px'
         }}
       
       >
       {
         <div style={{ height: 400, width: '100%' }}>
         <DataGrid
             rows={shopitems}
             columns={columns}
             components={{ Toolbar: GridToolbar }}
             getRowId={getRowId}
             slotProps={{
               toolbar: {
                 showQuickFilter: true,
                 style: { color: "red" },
               },
             }}
             initialState={{
               pagination: {
                 paginationModel: { page: 0, pageSize: 5 },
               },
             }}
             disableColumnFilter={isMobile}
             disableDensitySelector ={isMobile}
             disableColumnSelector ={isMobile}
           />
           </div>
           }
       </Box>
      )}
    </div>
    </>
  )
 }
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const ViewShopItems = () => {
  const [shopitems, setShopItems] = useState([]);
  const [openAlert, setOpenAlert] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [warehouse, setWarehouse] = useState([]);
  const [value, setValue] = React.useState(0);
  const [tabName, setTabName] = useState('');
  const [intialWarehouse, setInitialWarehouse] = useState('');
  const handleChange = (event, newValue) => {
    setValue(newValue);
    setTabName(warehouse[newValue].name);
  };
 
  useEffect(() => {
    Axios.get('/Shop/getall').then((response) => {
      setShopItems(response.data);
      setLoading(false);
       }).catch((error) => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data);
        } else {
          setErrorMessage("An error occurred");
        }
        setLoading(false);
       })
}, [reload]);
useEffect(() => {
  Axios.get('/warehouse/getall')
    .then((response) => {
      const filteredData = response.data.filter((data) => data.type === "Shop");
      if(filteredData && filteredData.length !== 0){
        setInitialWarehouse(filteredData[0].name);
        setWarehouse(filteredData);
      }
      setLoading(false);
      setValue(0);
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("An error occurred");
      }
      setLoading(false);
    });
}, []);
  return (
    <>
    <Box 
    margin={0}
    padding={0}
    >
       <Header
        title="SHOP ITEMS"
      />
      <Message message={errorMessage} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='error'/>
    {loading && <LinearProgress color="secondary" />}
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={value} onChange={handleChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
         aria-label="basic tabs example">
        {warehouse.map((item, index) => (
          <Tab label={item.name} key={index} sx={{
            '&.Mui-selected': {
              color: 'red', 
            },
          }} {...a11yProps(index)} />
        ))}
      </Tabs>
      </Box>
      <CustomTabPanel value={value} index={value}  shopitems ={value === 0 ? shopitems.filter((item) => item.warehouseName === intialWarehouse) : shopitems.filter((item) => item.warehouseName === tabName)} setReload ={setReload} reload = {reload}>
      </CustomTabPanel>
    </Box>
    </Box>
    </>
  );
};

export default ViewShopItems;
