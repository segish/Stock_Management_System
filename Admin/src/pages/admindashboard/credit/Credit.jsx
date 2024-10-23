import {  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useTheme } from "@mui/material";
import Axios from 'axios';
import {React,  useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import Message from "../../../components/admincomponents/Message";
import CircularProgress from "@mui/material/CircularProgress";
import { darken, lighten } from '@mui/material/styles';
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
const getBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.7) : lighten(color, 0.7);

const getHoverBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

const getSelectedBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

const getSelectedHoverBackgroundColor = (color, mode) =>
  mode === 'dark' ? darken(color, 0.4) : lighten(color, 0.4);

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .super-app-theme--Filled': {
    backgroundColor: getBackgroundColor(theme.palette.error.main, theme.palette.mode),
    '&:hover': {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.error.main,
        theme.palette.mode,
      ),
    },
    '&.Mui-selected': {
      backgroundColor: getSelectedBackgroundColor(
        theme.palette.error.main,
        theme.palette.mode,
      ),
      '&:hover': {
        backgroundColor: getSelectedHoverBackgroundColor(
          theme.palette.error.main,
          theme.palette.mode,
        ),
      },
    },
  },
}));
const Credit = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [creditList , setCreditList] = useState([]);
  const [openAlert, setOpenAlert] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [reload, setReload] = useState(false);
  const [openHover, setOpenHover] = useState(false);
  const [data, setData] = useState(null);
  const handleApprove = (selectedrow) => {
    setIsApproved(true);
    Axios.post(`/credit/approve/${selectedrow._id}`).then((response) => {
        setOpen(false);
        setIsApproved(false);
        setOpenAlert(true);
        setMessage(`Approving  successfull!`);
        setReload(!reload);
       }).catch((error) => {
        setOpen(true);
        if (error.response && error.response.data) {
          setOpenAlert(true);
          setErrorMessage(error.response.data);
        } else {
          setOpenAlert(true);
          setErrorMessage("An error occurred");
        }
        setIsApproved(false);
       })
    }
  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };


 const handleClickOpen = (row) => {
  setOpen(true);
  setSelectedRow(row);

 }


  useEffect(() => {
    Axios.get('/credit/getall').then((response) => {
        setCreditList(response.data);
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
}, [reload]);
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
      field: "customerName",
      headerName: "Customer Name",
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
        field: "amount",
        headerName: "Amount",
        width:isMobile&& 120,
        flex:!isMobile&&1,
        cellClassName: "name-column--cell",
      },
      {
        field: "phone",
        headerName: "Phone Number",
        width:isMobile&& 120,
        flex:!isMobile&&1,
        cellClassName: "name-column--cell",
      },
      {
        field: "warehouseName",
        headerName: "Warehouse Name",
        width:isMobile&& 120,
        flex:!isMobile&&1,
        cellClassName: "name-column--cell",
      },
      {
        field: "cheque",
        headerName: "Cheque Number",
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
      field: "creditedDate",
      headerName: "Credited Date",
      width: isMobile && 120,
      flex: !isMobile && 2,
      cellClassName: "name-column--cell",
      renderCell: function (params) {
        return (
          <div style={{color:'white', cursor:'pointer'}} onClick={() => handleHoverOpen(params.value)}>{params.value}</div>
        );
      }
    },
     
    {
      field: "approve",
      headerName: "Approve",
      renderCell: ({ row }) => {
        return <button onClick={() => handleClickOpen(row)} className="btn btn-success mx-1">Approve</button>;
      },
    },
   
  ];
  return (
    <Box 
    margin={0}
    padding={0}
    >
      <Header
        title="CREDIT INFORMATION"
      />
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
        aria-labelledby="customized-dialog-title"
        fullWidth
      >
      <DialogTitle id="delete-confirmation-dialog-title" >Approve Credit</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => handleClose()}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
        <DialogContent dividers style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="body1">
            Are you sure you want to Approve this credit?
          </Typography>
        </DialogContent>
        <DialogActions dividers style={{ justifyContent: 'center' }}>
        <Button variant="outlined" color="inherit" onClick={() => handleClose()} >
            No
          </Button>
          <Button  variant="contained"
            color="primary" onClick={() => handleApprove(selectedRow)}  disabled ={isApproved}>
            {isApproved ? <CircularProgress color="secondary" size={30}/> : 'Yes'}
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <Message message={message} openAlert={openAlert}  setOpenAlert={setOpenAlert} severity='success'/>
      <Message message={errorMessage} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='error'/>
    {loading && <LinearProgress color="secondary" />}
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
        }}
      >
        <StyledDataGrid
            rows={creditList}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={getRowId}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                style: { color: "red" },
              },
            }}
            disableColumnFilter = {isMobile}
           disableDensitySelector ={isMobile}
           disableColumnSelector ={isMobile}
           getRowClassName={(params) => params.row.approvedByCashier && 'super-app-theme--Filled'}

          />
      </Box>
    </Box>
  );
};

export default Credit;
