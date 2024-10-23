import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useTheme } from "@mui/material";
import Axios from 'axios';
import { useEffect, useState } from "react";
import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from "@mui/material/CircularProgress";
import Message from "../../../components/admincomponents/Message";
import { styled } from '@mui/material/styles';
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

const PendingShopItem = () => {
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [pendingList , setPendingList] = useState([]);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCancled, setIsCancled] = useState(false);
  const [openCancle, setOpenCancle] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [selectedCancleRow, setSelectedCancleRow] = useState(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [reload, setReload] = useState(false);
  const [openHover, setOpenHover] = useState(false);
  const [data, setData] = useState(null);
  const handleDelete = (row) => {
    setIsCancled(true);
    Axios.delete(`/ToShopPending/undo/${row._id}`).then((response) => {
      setOpenCancle(false);
      setIsCancled(false);
      setOpenAlert(true);
      setMessage(`Item Movement  Cancled successfully!!!`);
      setReload(!reload);
     }).catch((error) => {
      setOpenCancle(true);
      if (error.response && error.response.data) {
        setOpenAlert(true);
        setErrorMessage(error.response.data);
      } else {
        setOpenAlert(true);
        setErrorMessage("An error occurred");
      }
      setIsCancled(false);
     })
  };
  const handleCancleClickOpen = (row) => {
    setOpenCancle(true);
    setSelectedCancleRow(row);
};
const handleCancleClose = () => {
  setOpenCancle(false);
  setSelectedCancleRow(null);
};
  const handleApprove = (selectedrow) => {
    setIsApproved(true);
    Axios.post(`/ToShopPending/approve/${selectedrow._id}`, {
        warehouseName: selectedrow.to,
        quantity: selectedrow.quantity,
       }).then((response) => {
        setOpen(false);
        setIsApproved(false);
        setOpenAlert(true);
        setMessage(`Sales Approved successfully!`);
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
  const handleClickOpen = (row) => {
            setOpen(true);
            setSelectedRow(row);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  useEffect(() => {
    Axios.get('/toshoppending/getall').then((response) => {
        setPendingList(response.data);
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
        field: "name",
        headerName: "Item Name",
        width:isMobile&& 120,
        flex:!isMobile&&1,
        cellClassName: "name-column--cell",
      },
   
    {
        field: "specification",
        headerName: "Specification",
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
        field: "cashierName",
        headerName: "Cashier Name",
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
        field: "from",
        headerName: "From",
        width:isMobile&& 120,
        flex:!isMobile&&1,
        cellClassName: "name-column--cell",
      },
      {
        field: "to",
        headerName: "To",
        width:isMobile&& 120,
        flex:!isMobile&&1,
        cellClassName: "name-column--cell",
    },
    {
      field: "createdAt",
      headerName: "Date",
      width: isMobile && 120,
      flex: !isMobile && 1,
      cellClassName: "name-column--cell",
      valueGetter: (params) => {
        const createdAt = params.row.createdAt;
        const date = new Date(createdAt);
        const formattedDate = date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        return formattedDate;
      },
      renderCell: function (params) {
        return (
          <div style={{color:'white', cursor:'pointer'}} onClick={() => handleHoverOpen(params.value)}>{params.value}</div>
        );
      }
    },
    {
      field: "delete",
      headerName: "Delete",
      renderCell: ({ row }) => {
        return <button onClick={() => handleCancleClickOpen(row)} className="btn btn-danger mx-1 ">Cancle</button>;
      },
    },
    {
        field: "approve",
        headerName: "Approve",
        renderCell: ({ row }) => {
          return <button onClick={()=>handleClickOpen(row)} className="btn btn-success mx-1">Approve</button>;
        },
      },
  ];
  return (
    <>
     <div>
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
       <DialogTitle
      id="customized-dialog-title"
    >
      Approve Moved Items
    </DialogTitle>
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
         Do yo want to approve this movement?
         </Typography>
        </DialogContent>
        <DialogActions dividers style={{ justifyContent: 'center' }}>
        <Button variant="outlined" color="inherit" onClick={() => handleClose()} >
            No
          </Button>
          <Button variant="contained" color="primary" onClick={() => handleApprove(selectedRow)}  disabled ={isApproved}>
            {isApproved ? <CircularProgress color="secondary" size={30}/> : 'Yes'}
          </Button>
        </DialogActions>
      </BootstrapDialog>
            <BootstrapDialog
        open={openCancle}
        onClose={handleCancleClose}
        aria-labelledby="customized-dialog-title"
        fullWidth
        
      >
        <DialogTitle id="customized-dialog-title" >
          Cancel Item Movement
        </DialogTitle>
        <IconButton
        aria-label="close"
        onClick={handleCancleClose}
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
            Are you sure you want to cancel this movement?
          </Typography>
        </DialogContent>
        <DialogActions dividers style={{ justifyContent: 'center' }}>
          <Button variant="outlined" color="inherit" onClick={handleCancleClose}>
            No
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleDelete(selectedCancleRow)}
            disabled={isCancled}
          >
            {isCancled ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              'Yes'
            )}
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
    <Box padding={0}
    margin={0}>
      <Header
        title="PENDING SHOP ITEMS" 
      />
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
        <DataGrid
            rows={pendingList}
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
          />
      </Box>
    </Box>
    </>
  );
};

export default PendingShopItem;
