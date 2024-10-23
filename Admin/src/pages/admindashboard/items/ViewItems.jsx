import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { useTheme } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';
import Message from "../../../components/admincomponents/Message";
import { styled } from '@mui/material/styles';
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
const ViewItems = () => {
  const [itemList , setItemList] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true);
  const [openHover, setOpenHover] = useState(false);
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openAlert, setOpenAlert] = useState(true);
  const [openCancle, setOpenCancle] = useState(false);
  const [selectedCancleRow, setSelectedCancleRow] = useState(null);
  const [isCancled, setIsCancled] = useState(false);
  const [reload, setReload] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  const handleEdit = (row) => {
    navigate(`/edit_items`, { state: { rowData: row } });
  };
  
  const handleDelete = (row) => {
    setIsCancled(true);
      Axios.delete(`/items/delete/${row._id}`).then((response) => {
        setOpenAlert(true);
        setMessage(`${row.name} deleted successfully!`);
        setReload(!reload);
        setIsCancled(false);
        setOpenCancle(false);
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
    Axios.get('/items/getall').then((response) => {
      setItemList(response.data);
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
      field: "type",
      headerName: "Item Type",
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
      field: "edit",
      headerName: "Edit",
      renderCell: ({ row }) => {
        // Render the edit button here
        return <button onClick={() => handleEdit(row)} className="btn btn-primary mx-1 ">Edit</button>;
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      renderCell: ({ row }) => {
        // Render the delete button here
        return <button onClick={() => handleCancleClickOpen(row)} className="btn btn-danger mx-1 " >Delete</button>;
      },
    },
  ];
  return (
    <Box 
    margin={0}
    padding={0}
    >
      <Header
        title="ITEMS"
      />
      {message && <Message message={message} openAlert={openAlert}  setOpenAlert={setOpenAlert} severity='success'/>}
      {errorMessage && <Message message={errorMessage} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='error'/>}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            href="/add_items"
            startIcon={<AddIcon />}
            sx={{ marginLeft: 'auto' }}
          >
            Add Items
          </Button>
        </Box>
    {loading && <LinearProgress color="secondary"/>}
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
        open={openCancle}
        onClose={handleCancleClose}
        aria-labelledby="costomized-dialog-title"
        // maxWidth="md" // Set the desired width here
        fullWidth
      >
       <DialogTitle id="delete-confirmation-dialog-title">Confirm Delete</DialogTitle>
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
    <Box
        margin={0}
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            marginBottom: "20px",
            overflowX: "auto",
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
          width: "100%",
          overflow: "hidden",
        }}
      >
        <DataGrid
            rows={itemList}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={getRowId}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                style: { color: "red" },
              },
            }}
            disableColumnFilter ={isMobile}
            disableDensitySelector ={isMobile}
            disableColumnSelector ={isMobile}
          />
      </Box>
    </Box>
  );
};

export default ViewItems;
