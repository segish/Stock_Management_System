import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useTheme } from "@mui/material";
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from '@mui/material/styles';
import Message from "../../../components/admincomponents/Message";
import AddIcon from '@mui/icons-material/Add';
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
const ViewItemType = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [itemType , setItemType] = useState([]);
  const [openAlert, setOpenAlert] = useState(true);
  const [openCancle, setOpenCancle] = useState(false);
  const [selectedCancleRow, setSelectedCancleRow] = useState(null);
  const [isCancled, setIsCancled] = useState(false);
  const [reload, setReload] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  const handleEdit = (row) => {
    navigate(`/edit_item_type`, { state: { rowData: row } });
  };
  
  const handleDelete = (row) => {
    setIsCancled(true);
   Axios.delete(`/type/delete/${row._id}`).then((response) => {
     setOpenAlert(true);
     setMessage(`${row.name} deleted successfully!`);
     setIsCancled(false);
     setOpenCancle(false);
     setReload(!reload);
   }).catch((error) => {
     if (error.response && error.response.data) {
      setOpenAlert(true);
       setErrorMessage(error.response.data);
     } else {
      setOpenAlert(true);
       setErrorMessage("An error occurred");
     }
     setIsCancled(false);
     setOpenCancle(true);
   })
 };
 const handleCancleClose = () => {
   setOpenCancle(false);
   setSelectedCancleRow(null);
 };
 const handleCancleClickOpen = (row) => {
   setOpenCancle(true);
   setSelectedCancleRow(row);
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
       })
       // eslint-disable-next-line react-hooks/exhaustive-deps
}, [reload]);
const getRowId = (row) => {
    return row._id;
  };
  const columns = [
    {
      field: "type",
      headerName: "Item Type",
      width:isMobile&& 120,
      flex:!isMobile&&1,
      cellClassName: "name-column--cell",
    },
   
    {
      field: "edit",
      headerName: "Edit",
      renderCell: ({ row }) => {
        return <button onClick={() => handleEdit(row)} className="btn btn-primary mx-1 ">Edit</button>;
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      renderCell: ({ row }) => {
        return <button onClick={() => handleCancleClickOpen(row)} className="btn btn-danger mx-1 ">Delete</button>;
      },
    },
  ];
  return (
    <Box margin={0}
    padding={0}>
      <Header
        title="ITEM TYPE"
      />
      
       <BootstrapDialog
        open={openCancle}
        onClose={handleCancleClose}
        aria-labelledby="costomized-dialog-title"
        // maxWidth="md" // Set the desired width here
        fullWidth
      >
      <DialogTitle id="delete-confirmation-dialog-title" >Confirm Delete</DialogTitle>
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
        <DialogContent dividers style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="body1">
            Are you sure you want to delete this item?
          </Typography>
        </DialogContent>
        <DialogActions dividers style={{ justifyContent: 'center' }}>
        <Button variant="outlined" color="inherit" onClick={() => handleCancleClose()} >
            No
          </Button>
          <Button  variant="contained"
            color="primary" onClick={() => handleDelete(selectedCancleRow)}  disabled ={isCancled}>
            {isCancled ? <CircularProgress color="secondary" size={30}/> : 'Yes'}
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <Message message={message} openAlert={openAlert}  setOpenAlert={setOpenAlert} severity='success'/>
      <Message message={errorMessage} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='error'/>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            href="/add_item_type"
            startIcon={<AddIcon />}
            sx={{ marginLeft: 'auto' }}
          >
            Add Item Type
          </Button>
        </Box>
      {loading && <LinearProgress color="secondary"/>}
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
            rows={itemType}
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
};

export default ViewItemType;
