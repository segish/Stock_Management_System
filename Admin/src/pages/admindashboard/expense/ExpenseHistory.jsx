import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Axios from 'axios';
import {React, useState } from "react";
import LinearProgress from '@mui/material/LinearProgress';
import { useEffect } from "react";
import Message from "../../../components/admincomponents/Message";
const ExpenseHistory = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [loading, setLoading] = useState(true);
    const [openAlert, setOpenAlert] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [expenseHistory , setExpenseHistory] = useState([]);
    const isMobile = useMediaQuery('(max-width: 768px)');
    useEffect(() => {
        Axios.get('/expense/getexpensehistory').then((response) => {
            setExpenseHistory(response.data);
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
    ]
    return (
        <Box 
        margin={0}
        padding={0}
        >
          <Header
            title="EXPENSES HISTORY"
          />
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
                rows={expenseHistory}
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

export default ExpenseHistory