import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useTheme } from "@mui/material";
import Axios from 'axios';
import {React, useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';
import Message from "../../../components/admincomponents/Message";
import { styled } from '@mui/material/styles';
import CircularProgress from "@mui/material/CircularProgress";
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
const PendingExpense = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [expenseList , setExpenseList] = useState([]);
  const [openAlert, setOpenAlert] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
    useEffect(() => {
        Axios.get('/expense/getall').then((response) => {
            setExpenseList(response.data);
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
    const handleClickOpen = (row) => {
        setOpen(true);
        setSelectedRow(row);
    }
    const handleApprove = (selectedrow) => {
        setIsApproved(true);
        Axios.post(`/expense/approve/${selectedrow._id}`).then((response) => {
            setOpen(false);
            setIsApproved(false);
            setOpenAlert(true);
            setMessage(`Approving  successfull!`);
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
    const getRowId = (row) => {
        return row._id;
      };
      const columns = [
        {
            field: "warehouseName",
            headerName: "Shop Name",
            width:isMobile&& 120,
            flex:!isMobile&&1,
            cellClassName: "name-column--cell",
          },
          {
            field: "amount",
            headerName: "Expense Amount",
            width:isMobile&& 120,
            flex:!isMobile&&1,
            cellClassName: "name-column--cell",
          },
          {
            field: "reason",
            headerName: "Expense Reason",
            width:isMobile&& 120,
            flex:!isMobile&&1,
            cellClassName: "name-column--cell",
          },
          {
            field: "createdAt",
            headerName: "Date",
            width:isMobile&& 120,
            flex:!isMobile&&1,
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
          },
          {
            field: "approve",
            headerName: "Approve",
            renderCell: ({ row }) => {
              return <button onClick={()=>handleClickOpen(row)} className="btn btn-success mx-1">Approve</button>;
            },
          },
      ]
    return (
        <Box 
        margin={0}
        padding={0}
        >
          <Header
            title="ON-PENDING EXPENSES"
          />
          <Message message={message} openAlert={openAlert}  setOpenAlert={setOpenAlert} severity='success'/>
          <Message message={errorMessage} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='error'/>
          <BootstrapDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        fullWidth
      >
      <DialogTitle id="delete-confirmation-dialog-title" >Approve Expense</DialogTitle>
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
            Are you sure you want to Approve this Expense?
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
                rows={expenseList}
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
      );
}

export default PendingExpense