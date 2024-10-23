import { Box,Typography, useMediaQuery, useTheme } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LineChart from "../../../components/LineChart";
import StatBox from "../../../components/StatBox";
import  List from "@mui/icons-material/List";
import Store from "@mui/icons-material/Store";
import  LockClockOutlined  from "@mui/icons-material/LockClockOutlined";
import Shop2Outlined from "@mui/icons-material/Shop2Outlined";
import HistoryOutlined from "@mui/icons-material/HistoryOutlined";
import { tokens } from "../../../theme";
import { useEffect, useState } from "react";
import Axios from 'axios';
import { Link } from "react-router-dom";
import RecentSales from "../../../components/admincomponents/RecentSales";
import LinearProgress from "@mui/material/LinearProgress";
import Message from "../../../components/admincomponents/Message";
const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [totalItem, setTotalItem] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [totalWarehouse, setTotalWarehouse] = useState(0);
  const [totalSale, setTotalSale] = useState(0);
  const [totalMainStoreItems, setTotalMainStoreItems] = useState(0);
  const [totalSubStoreItems, setTotalSubStoreItems] = useState(0);
  const [totalShopItems, setTotalShopItems] = useState(0);
  const [itemLoading, setItemLoading] =useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [warLoading, setWarLoading] =useState(false);
  const [saleLoading, setSaleLoading] =useState(false);
  const [mainLoading, setMainLoading] =useState(false);
  const [subLoading, setSubloading]= useState(false);
  const [shopLoading, setShopLoading] = useState(false);
  const [warehouseList, setWarehouseList] =useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [lineData, setLineData] = useState([]);
  const [openAlert, setOpenAlert] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const amountResponse = await Axios.get("/salleshistory/lineamount");
        const quantityResponse = await Axios.get("/salleshistory/linequantity");
  
        const AmountData = {
          id: "Amount Salled",
          color: tokens("dark").greenAccent[500],
          data: amountResponse.data,
        };
  
        const QuantityData = {
          id: "Total Item",
          color: tokens("dark").blueAccent[300],
          data: quantityResponse.data,
        };
        setLineData([AmountData, QuantityData]);
      } catch (error) {
      }
    };
  
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
   
  useEffect(() => {
    setItemLoading(true);
   Axios.get('/items/getall').then((response) => {
     setTotalItem(response.data.length);
     setItemLoading(false);
   }).catch((error) => {
    if (error.response && error.response.data) {
      setOpenAlert(true);
      setErrorMessage(error.response.data);
    } else {
      setOpenAlert(true);
      setErrorMessage("An error occurred");
    }
    setItemLoading(false);
   })
  }, []);
  useEffect(() => {
    setUserLoading(true);
    Axios.get('/auth/getall').then((response) => {
      setUserLoading(false);
      setTotalUsers(response.data.length);
    }).catch((error) => {
     if (error.response && error.response.data) {
      setOpenAlert(true);
       setErrorMessage(error.response.data);
     } else {
      setOpenAlert(true);
       setErrorMessage("An error occurred");
     }
     setUserLoading(false);
    })
   }, []);
   useEffect(() => {
    setPendingLoading(true);
    Axios.get('/pending/getall').then((response) => {
      setPendingLoading(false);
      setTotalPending(response.data.length);
    }).catch((error) => {
     if (error.response && error.response.data) {
      setOpenAlert(true);
       setErrorMessage(error.response.data);
     } else {
      setOpenAlert(true);
       setErrorMessage("An error occurred");
     }
     setPendingLoading(false);
    })
   }, []);
   useEffect(() => {
    setWarLoading(true);
    Axios.get('/warehouse/getall').then((response) => {
      setWarLoading(false);
      setTotalWarehouse(response.data.length);
      setWarehouseList(response.data);
    }).catch((error) => {
     if (error.response && error.response.data) {
      setOpenAlert(true);
       setErrorMessage(error.response.data);
     } else {
      setOpenAlert(true);
       setErrorMessage("An error occurred");
     }
     setWarLoading(false);
    })
   }, []);
   useEffect(() => {
    setSaleLoading(true);
    Axios.get('/salleshistory/getall').then((response) => {
      setSaleLoading(false);
      setTotalSale(response.data.length);
    }).catch((error) => {
     if (error.response && error.response.data) {
      setOpenAlert(true);
       setErrorMessage(error.response.data);
     } else {
      setOpenAlert(true);
       setErrorMessage("An error occurred");
     }
     setSaleLoading(false);
    })
   }, []);
   useEffect(() => {
    setMainLoading(true);
    Axios.get('/mainstore/getall').then((response) => {
      setMainLoading(false);
      setTotalMainStoreItems(response.data.length);
    }).catch((error) => {
     if (error.response && error.response.data) {
      setOpenAlert(true);
       setErrorMessage(error.response.data);
     } else {
      setOpenAlert(true);
       setErrorMessage("An error occurred");
     }
     setMainLoading(false);
    })
   }, []);
   useEffect(() => {
    setSubloading(true);
    Axios.get('/Substore/getall').then((response) => {
      setSubloading(false);
      setTotalSubStoreItems(response.data.length);
    }).catch((error) => {
     if (error.response && error.response.data) {
       setErrorMessage(error.response.data);
     } else {
       setErrorMessage("An error occurred");
     }
     setSubloading(false);
    })
   }, []);
   useEffect(() => {
    setShopLoading(true);
    Axios.get('/Shop/getall').then((response) => {
      setShopLoading(false);
      setTotalShopItems(response.data.length);
    }).catch((error) => {
     if (error.response && error.response.data) {
      setOpenAlert(true);
       setErrorMessage(error.response.data);
     } else {
      setOpenAlert(true);
       setErrorMessage("An error occurred");
     }
     setShopLoading(false);
    })
   }, []);
  return (
    <Box m="0px"
    mb={isMobile ? 10 : undefined}
    >
    <Message message={errorMessage} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='error'/>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
       gap={2}
      >
        <Box
          gridColumn={{ xs: "span 12", sm: "span 3", }} 
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          
        >
          <Link  to='/view_items' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <StatBox
            title={totalItem}
            subtitle="Items"
            loading={itemLoading}
            icon={
              <List 
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
          </Link>
        </Box>
        <Box
          gridColumn={{ xs: "span 12", sm: "span 3" }} 
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
           <Link  to='/view_users' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <StatBox
            title={totalUsers}
            loading={userLoading}
            subtitle="Users"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
              
            }
          />
          </Link>
        </Box>
        <Box
          gridColumn={{ xs: "span 12", sm: "span 3" }} 
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Link  to='/pending' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <StatBox
            title={totalPending}
            loading={pendingLoading}
            subtitle="Orderd Pendings"
            icon={
              <LockClockOutlined
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
          </Link>
        </Box>


        <Box
          gridColumn={{ xs: "span 12", sm: "span 3" }} 
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Link  to='/view_ware_house' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <StatBox
            title={totalWarehouse}
            loading={warLoading}
            subtitle="WareHouses"
            icon={
              <Shop2Outlined
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
          </Link>
        </Box>

        <Box
          gridColumn={{ xs: "span 12", sm: "span 3" }} 
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Link  to='/saleshistory' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <StatBox
            title={totalSale}
            loading={saleLoading}
            subtitle="Sales"
            icon={
              <HistoryOutlined
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
          </Link>
        </Box>
        <Box
          gridColumn={{ xs: "span 12", sm: "span 3" }} 
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Link  to='/mainstore' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <StatBox
            title={totalMainStoreItems}
            loading={mainLoading}
            subtitle="Main Store Items"
            icon={
              <Store
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
          </Link>
        </Box>
        <Box
          gridColumn={{ xs: "span 12", sm: "span 3" }} 
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
           <Link  to='/sub_store_items' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <StatBox
            title={totalSubStoreItems}
            loading={subLoading}
            subtitle="Sub Store Items"
            icon={
              <Store
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
          </Link>
        </Box>
        <Box
          gridColumn={{ xs: "span 12", sm: "span 3" }} 
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
           <Link  to='/shop_items' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <StatBox
            title={totalShopItems}
            loading={shopLoading}
            subtitle="Shop Items"
            icon={
              <Store
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
          </Link>
        </Box>
       
      { <Box
          gridColumn={{ xs: "span 12", sm: "span 12" }} 
          gridRow={{xs:'span 2', sm: 'span 3'}}
          backgroundColor={colors.primary[400]}
        >
           {lineData.length === 0 && <LinearProgress color="secondary"/>}
        { lineData.length !== 0 &&  <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Sales Report
              </Typography>
             
            </Box>
          </Box>}
         { lineData.length !== 0 &&  <Box height={{xs:'250px', sm:'400px'}} m="-20px 0 0 0">
           {lineData && <LineChart isDashboard={true}  lineData={lineData}/>}
          </Box>}
        </Box>}
       {
        warehouseList.map((warehouse) => (
          <RecentSales  name={warehouse.name}/>
        ))
       }
      </Box>
    </Box>
  );
};

export default Dashboard;
