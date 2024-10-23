import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import React from 'react'
import { tokens } from '../../theme';
import { useState } from 'react';
import { useEffect } from 'react';
import Axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Message from './Message';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import StatCard from './StatCard';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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

const RecentSales = ({ name }) => {
  const theme = useTheme(); const [selectedRow, setSelectedRow] = React.useState(null);
  const [open, setOpen] = useState(false);

  const colors = tokens(theme.palette.mode);
  const [todaySales, setTodaySales] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openCancle, setOpenCancle] = useState(false);
  const [openCard, setOpenCard] = useState(false);
  const [selectedCancleRow, setSelectedCancleRow] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [isCancled, setIsCancled] = useState(false);
  const [openAlert, setOpenAlert] = useState(true);
  const [message, setMessage] = useState('');
  const [reload, setReload] = useState(false);
  const [total, setTotal] = useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const totalSale = Number(total.totalSale) || 0;
  const totalSaleTransfer = Number(total.totalSaleTransfer) || 0;
  const totalSaleCredit = Number(total.totalSaleCredit) || 0;
  const totalExpense = Number(total.totalExpense) || 0;
  const netIncome = (totalSale + totalSaleTransfer + totalSaleCredit) - totalExpense;
  const netSale = totalSale + totalSaleTransfer + totalSaleCredit;
  const netCash = totalSale - totalExpense;
  const BootstrapDialogCard = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
      backgroundColor: `${colors.primary[700]}`
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
    '& .MuiDialog-paper': {
      width: '100%',
    },
  }));
  const handleApprove = (selectedrow) => {
    setIsApproved(true);
    Axios.post(`/sallespending/approve/${selectedrow._id}`).then((response) => {
      setOpen(false);
      setIsApproved(false);
      setMessage(`Sale Approved successfully!!!`);
      setReload(!reload);
    }).catch((error) => {
      setOpen(true);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("An error occurred");
      }
      setIsApproved(false);
    })
  }
  const handleCancleClickOpen = (row) => {
    setOpenCancle(true);
    setSelectedCancleRow(row);
  };
  const handleCancleClose = () => {
    setOpenCancle(false);
    setSelectedCancleRow(null);
  };
  const handleCardClickOpen = (row) => {
    setOpenCard(true);
  };
  const handleCardClose = () => {
    setOpenCard(false);
  };
  const handleCancle = (row) => {
    setIsCancled(true);
    Axios.delete(`/sallespending/undo/${row._id}`).then((response) => {
      setOpenCancle(false);
      setIsCancled(false);
      setMessage(`Sale Cancled successfully!!!`);
      setReload(!reload);
    }).catch((error) => {
      setOpenCancle(true);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("An error occurred");
      }
      setIsCancled(false);
    })
  };
  useEffect(() => {
    const fetchData = async () => {
      await Axios.get("/sallespending/getall").then((response) => {
        const filteredSales = response.data.filter(
          (sale) =>
            sale.from === name &&
            new Date(sale.createdAt).toLocaleDateString() ===
            new Date().toLocaleDateString()
        );
        setTodaySales(filteredSales);
      }).catch((error) => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data);
        } else {
          setErrorMessage("An error occurred");
        }
      });
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  useEffect(() => {
    const fetchTotal = async () => {
      await Axios.post('/expense/total', {
        warehouseName: name,
      }).then((response) => {
        setTotal(response.data);
      }).catch((error) => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data);
        } else {
          setErrorMessage("An error occurred");
        }
      })
    }
    fetchTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };
  const handleClickOpen = (row) => {
    setOpen(true);
    setSelectedRow(row);
  }
  const getRowId = (row) => {
    return row._id;
  };
  const columns = [
    {
      field: "itemCode",
      headerName: "Item Code",
      width: isMobile && 100,
      flex: !isMobile && 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "name",
      headerName: "Name",
      width: isMobile && 100,
      flex: !isMobile && 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "specification",
      headerName: "Specification",
      width: isMobile && 100,
      flex: !isMobile && 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: isMobile && 100,
      flex: !isMobile && 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "to",
      headerName: "To",
      width: isMobile && 100,
      flex: !isMobile && 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "paymentMethod",
      headerName: "Payment Method",
      width: isMobile && 100,
      flex: !isMobile && 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "amount",
      headerName: "Amount",
      width: isMobile && 120,
      flex: !isMobile && 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "cancle",
      headerName: "cancle",
      renderCell: ({ row }) => {
        return <button onClick={() => handleCancleClickOpen(row)} className="btn btn-danger mx-1 ">Cancle</button>;
      },
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
    <>
      <BootstrapDialogCard
        open={openCard}
        onClose={handleCardClose}
        aria-labelledby="customized-dialog-title"
        fullWidth
        marginTop='10px'

      >
        <DialogTitle
          id="customized-dialog-title"
          style={{ textAlign: 'start', backgroundColor: `${colors.primary[700]}` }}
        >
          Today's Sales From {name}
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={() => { handleCardClose() }}
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
          <Box
            display="grid"
            gridTemplateColumns="1fr"
            gridAutoRows="120px"
            gap="10px"
            fullWidth
            mt={1}
          >

            {total && <Box
              gridColumn={"span 3"}
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                borderRadius: '5px',
              }}

            >
              <Link style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <StatCard
                  cash={total.totalSale}
                  transfer={total.totalSaleTransfer}
                  credit={total.totalSaleCredit}
                  title="TODAY'S SALE"
                  isSale={true}
                  isExpense={false}
                  isNet={false}
                />
              </Link>
            </Box>}
            {total && <Box
              gridColumn={"span 3"}
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              padding={0}
              sx={{
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                borderRadius: '5px',
              }}

            >
              <Link style={{ display: 'flex', justifyContent: 'center' }}>
                <StatCard
                  title="TODAY'S EXPENSE"
                  expense={total.totalExpense}
                  isSale={false}
                  isExpense={true}
                  isNet={false}
                />
              </Link>
            </Box>}
            {total && <Box
              gridColumn={"span 3"}
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              padding={0}
              sx={{
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                borderRadius: '5px',
              }}

            >
              <Link style={{ display: 'flex', justifyContent: 'center' }}>
                <StatCard
                  title="TODAY'S NET"
                  netIncome={netIncome}
                  netSale={netSale}
                  netCash={netCash}
                  isSale={false}
                  isExpense={false}
                  isNet={true}
                />
              </Link>
            </Box>}
          </Box>
        </DialogContent>
        <DialogActions dividers style={{ justifyContent: isMobile ? 'flex-end' : 'flex-end', backgroundColor: `${colors.primary[700]}` }}>
          <Button variant="outlined" color="inherit" onClick={() => handleCardClose()} >
            Close
          </Button>
        </DialogActions>
      </BootstrapDialogCard>
      <BootstrapDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        fullWidth
      >
        <DialogTitle
          id="customized-dialog-title"
          style={{ textAlign: 'center' }}
        >
          Approve Sales
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => { handleClose() }}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        {message && <DialogTitle>
          <Message message={message} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='success' />
        </DialogTitle>}
        {errorMessage && <DialogTitle>
          <Message message={errorMessage} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='error' />
        </DialogTitle>}
        <DialogContent dividers style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="body1">
            Do yo want to approve this sale?
          </Typography>
        </DialogContent>
        <DialogActions dividers style={{ justifyContent: 'center' }}>
          <Button variant="outlined" color="inherit" onClick={() => handleClose()} >
            No
          </Button>
          <Button variant="contained" color="primary" onClick={() => handleApprove(selectedRow)} disabled={isApproved}>
            {isApproved ? <CircularProgress color="secondary" size={30} /> : 'Yes'}
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <BootstrapDialog
        open={openCancle}
        onClose={handleCancleClose}
        aria-labelledby="customized-dialog-title"
        // maxWidth="md" // Set the desired width here
        fullWidth
      >
        <DialogTitle id="customized-dialog-title" style={{ textAlign: 'center' }}>
          Cancel Sale
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => { handleCancleClose() }}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography variant="body1">
            Are you sure you want to cancel this sale?
          </Typography>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }}>
          <Button variant="outlined" color="inherit" onClick={() => handleCancleClose()} >
            No
          </Button>
          <Button variant="contained"
            color="primary" onClick={() => handleCancle(selectedCancleRow)} disabled={isCancled}>
            {isCancled ? <CircularProgress color="secondary" size={30} /> : 'Yes'}
          </Button>
        </DialogActions>
      </BootstrapDialog>
      {!isMobile && todaySales.length !== 0 && <Box
        gridColumn={{ xs: "span 1", sm: "span 12" }}
        mt={3}
      >
        <Typography variant="h5" fontWeight="600" pl={1}>
          Recent Sales From {name}
        </Typography>
        {!isMobile && <Box
          display="grid"
          gridTemplateColumns="repeat(11, 1fr)"
          gridAutoRows="120px"
          gap="50px"
          fullWidth
          mt={1}
        >

          {total && <Box
            gridColumn={{ xs: "span 12", sm: "span 3", }}
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
              borderRadius: '5px',
            }}
          >
            <Link style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <StatCard
                cash={total.totalSale}
                transfer={total.totalSaleTransfer}
                credit={total.totalSaleCredit}
                title="TODAY'S SALE"
                isSale={true}
                isExpense={false}
                isNet={false}
              />
            </Link>
          </Box>}
          {total && <Box
            gridColumn={{ xs: "span 12", sm: "span 3", }}
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            padding={0}
            sx={{
              boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
              borderRadius: '5px',
            }}

          >
            <Link style={{ display: 'flex', justifyContent: 'center' }}>
              <StatCard
                title="TODAY'S EXPENSE"
                expense={total.totalExpense}
                isSale={false}
                isExpense={true}
                isNet={false}
              />
            </Link>
          </Box>}
          {total && <Box
            gridColumn={{ xs: "span 12", sm: "span 3", }}
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            padding={0}
            sx={{
              boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
              borderRadius: '5px',
            }}

          >
            <Link style={{ display: 'flex', justifyContent: 'center' }}>
              <StatCard
                title="TODAY'S NET"
                netIncome={netIncome}
                netSale={netSale}
                netCash={netCash}
                isSale={false}
                isExpense={false}
                isNet={true}
              />
            </Link>
          </Box>}
        </Box>}
      </Box>}

      {!isMobile && todaySales.length !== 0 && <Box
        gridColumn={"span 12"}
        gridRow={'span 3'}

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
          marginTop: '20px'
        }}
      >


        <DataGrid
          rows={todaySales}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={getRowId}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              style: { color: "red" },
            },
          }}
          disableColumnFilter={isMobile}
          disableDensitySelector={isMobile}
          disableColumnSelector={isMobile}
          pagination
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
        />


      </Box>
      }


      {isMobile && todaySales.length !== 0 && <Box
        gridColumn={"span 12"}
        gridRow={'span 3'}

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
          marginTop: '20px'
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5" fontWeight="600" pl={1}>
            Today's Sale From {name}
          </Typography>

          {isMobile && (
            <MoreVertIcon
              onClick={handleCardClickOpen}
              sx={{ color: colors.greenAccent, fontSize: "30px", marginRight: '5px' }}
            />
          )}
        </Box>

        <DataGrid
          rows={todaySales}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          getRowId={getRowId}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              style: { color: "red" },
            },
          }}
          disableColumnFilter={isMobile}
          disableDensitySelector={isMobile}
          disableColumnSelector={isMobile}
        />


      </Box>
      }
    </>
  )
}

export default RecentSales;

