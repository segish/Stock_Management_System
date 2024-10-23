import { useEffect, useState } from "react";
import Axios from 'axios';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { Box, IconButton, Skeleton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { Collapse } from "@mui/material";
const Item = ({ title, to, icon, selected, setSelected, isCollapsed, isMobile, setIsCollapsed, handleSidebar }) => {
  const handleClick = (title) =>{
    if(isMobile){
      handleSidebar();
    }
    setSelected(title);
  }
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => !isCollapsed && handleClick(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      {!isCollapsed && <Link to={to} />}
    </MenuItem>
  );
};

const Itemtest = ({ title, to, icon, selected, setSelected, subMenu , isCollapsed, isMobile, setIsCollapsed, handleSidebar}) => {
   const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const handleSubMenuToggle = () => {
    setSelected(title);
    setIsSubMenuOpen(!isSubMenuOpen);
   
  };
  const handleIsMobile = () => {
    if(isMobile){
      handleSidebar();
    }
  }
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <>
      <MenuItem
        active={selected === title}
        style={{
          color: colors.grey[100],
          flexDirection: "row",
          alignItems: "center",
         
        }}
        onClick={() => !isCollapsed && handleSubMenuToggle()}
        icon={icon}
        suffix={!isCollapsed && ( isSubMenuOpen ? <i className="fa fa-sort-up"></i> : <i className="fa fa-sort-down"></i>)}
      >
        <Typography>{title}</Typography>
        {/* <Link to={to} /> */}
      </MenuItem>
      {subMenu && (
        <Collapse in={isSubMenuOpen}>
          <div onClick={() => handleIsMobile()} style={{ display: "flex", marginLeft: '20px', border: '1px solid #9e9e9e', boxSizing: 'border-box', marginRight: '5px', borderRadius: 4, backgroundColor: colors.blueAccent[800], color: "white", justifyContent: 'space-between' }}>{subMenu}</div>
        </Collapse>
      )}
    </>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [username, setUserName] = useState('');
  const [role, setRole] = useState('');
  const [isMobile, setisMobile] = useState(false);
  const [breakPoint, setBreakPoint] = useState(false);
  const [profilLoding, setProfilLoding] = useState(true);
  const [display, setDisplay] = useState('');
  useEffect(() => {
    setProfilLoding(true);
    Axios.post('/auth/refresh',{
      withCredentials: true,
    }).then((response) => {
        setUserName(response.data.adminName);
        setRole(response.data.type);
        setProfilLoding(false);
       }).catch((error) => {
        setProfilLoding(false);
       })
       // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth <= 768) {
          setIsCollapsed(true);
          setisMobile(true);
          setBreakPoint(true);
          setDisplay('');
        } else {
          setIsCollapsed(false);
          setisMobile(false);
          setBreakPoint(false);
          setDisplay('display');
        }
      };

      handleResize(); // Check initial screen size
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.innerWidth]);

    const handleSidebar = () => {
      setBreakPoint(!breakPoint);
      setIsCollapsed(!isCollapsed);
    }
  const handleCollapse = () =>{
    if(isMobile){
      handleSidebar();
    }else{
      setIsCollapsed(!isCollapsed);
    }
  }
  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: colors.greenAccent[400] + "!important",
        },
        "& .pro-menu-item.active": {
          color: colors.greenAccent[500] + "!important",
        },
        height: '100vh',
        width: isMobile ? '0px' : undefined,
        mb: isMobile ? '30px' :undefined,
      }}
    >
      <ProSidebar collapsed={isCollapsed} breakPoint={breakPoint ? 'sm': ''}>
        <Menu  style={{
          marginBottom: isMobile ? '40px' : undefined,
        }}>
          <MenuItem
            onClick={() => handleCollapse()}
            icon={isCollapsed ? <MenuOutlinedIcon /> :undefined }
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
                
              >
                <Typography variant="h3" color={colors.grey[100]}>
                 SMS
                </Typography>
                <IconButton onClick={() => handleCollapse()}>
                  <MenuOutlinedIcon />
                </IconButton>
               
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 10px 10px" }}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                 {profilLoding ?
                    <Skeleton variant="rounded" width={200} height={30} />:
                  username}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]} style={{ display: "flex", justifyContent: "center" }}>
                {profilLoding ?
                    <Skeleton variant="rounded" width={130} height={30} />: role}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "0px"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              isMobile={isMobile}
              handleSidebar = {handleSidebar}
            />

            <Item
              title="Items"
              to="/view_items"
              icon={<i class="fa fa-list"></i>}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              isMobile={isMobile}
              setIsCollapsed={setIsCollapsed}
              handleSidebar={handleSidebar}
            />
            <Itemtest
              title="Store Items"
              icon={<i class="fa fa-store"></i>}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              isMobile={isMobile}
              setIsCollapsed={setIsCollapsed}
              handleSidebar={handleSidebar}
              subMenu={
                <Menu>
                  <MenuItem
                    active={selected === "Main Store"}
                    icon= {<i class="fas fa-store"></i>}
                    onClick={() => setSelected("Main Store")}
                  >
                    <Typography>Main Store Items</Typography>
                    <Link to="/mainstore" />
                  </MenuItem>
                  <MenuItem
                    active={selected === "Order"}
                    icon= {<i class="fas fa-download"></i>}
                    onClick={() => setSelected("Order")}
                  >
                    <Typography>New Order</Typography>
                    <Link to="/import" />
                  </MenuItem>
                  <MenuItem
                    active={selected === "Sub Store Items"}
                    icon ={<i class="fas fa-building"></i>}
                    onClick={() => setSelected("Sub Store Items")}
                  >
                    <Typography>Sub Store Items</Typography>
                    <Link to="/sub_store_items" />
                  </MenuItem>
               
                  <MenuItem
                    active={selected === "Shop Items"}
                    icon ={<i class="fas fa-shopping-bag"></i>}
                    onClick={() => setSelected("Shop Items")}
                  >
                    <Typography>Shop Items</Typography>
                    <Link to="/shop_items" />
                  </MenuItem>
                 
                </Menu>
              }
            />
              <Itemtest
              title="History"
              icon={<i class="fa fa-history"></i>}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              isMobile={isMobile}
              setIsCollapsed={setIsCollapsed}
              handleSidebar={handleSidebar}
              subMenu={
                <Menu>
                  <MenuItem
                    active={selected === "Store to Store History"}
                    icon ={<i className="fas fa-exchange-alt"></i>}
                    onClick={() => setSelected("Store to Store History")}
                  >
                    <Typography>Store to Store History</Typography>
                    <Link to="/storehistory" />
                  </MenuItem>
                  <MenuItem
                    active={selected === "Sales History"}
                    icon={<i className="fas fa-history"></i>}
                    onClick={() => setSelected("Sales History")}
                  >
                    <Typography>Sales History</Typography>
                    <Link to="/saleshistory" />
                  </MenuItem>
                </Menu>
              }
            />
             <Itemtest
              title="Expense"
              icon={<ShoppingCartCheckoutIcon/>}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              isMobile={isMobile}
              setIsCollapsed={setIsCollapsed}
              handleSidebar={handleSidebar}
              subMenu={
                <Menu>
                  <MenuItem
                    active={selected === "On-Pending Expense"}
                    icon ={<i class="fa fa-clock"></i>}
                    onClick={() => setSelected("On-Pending Expense")}
                  >
                    <Typography>On-Pending Expense</Typography>
                    <Link to="/pending_expense" />
                  </MenuItem>
                  <MenuItem
                    active={selected === "Expense History"}
                    icon={<i className="fas fa-history"></i>}
                    onClick={() => setSelected("Expense History")}
                  >
                    <Typography>Expense History</Typography>
                    <Link to="/expense_history" />
                  </MenuItem>
                </Menu>
              }
            />
             <Itemtest
              title="Pending"
              icon={<i class="fa fa-clock"></i>}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              isMobile={isMobile}
              setIsCollapsed={setIsCollapsed}
              handleSidebar={handleSidebar}
              subMenu={
                <Menu>
                  <MenuItem
                    active={selected === "Pending Orders"}
                    icon ={<i className="fas fa-clock"></i>}
                    onClick={() => setSelected("Pending Orders")}
                  >
                    <Typography>Pending Orders</Typography>
                    <Link to="/pending" />
                  </MenuItem>
                  <MenuItem
                    active={selected === "Pending Shop Sales"}
                    icon={<i className="fas fa-clock"></i>}
                    onClick={() => setSelected("Pending Shop Sales")}
                  >
                    <Typography>Pending Sales</Typography>
                    <Link to="/pendingshopsales" />
                  </MenuItem>
                  <MenuItem
                    active={selected === "Pending Shop Items"}
                    icon={<i className="fas fa-exclamation-circle"></i>}
                    onClick={() => setSelected("Pending Shop Items")}
                  >
                    <Typography>Pending Items</Typography>
                    <Link to="/pendingshopitems" />
                  </MenuItem>
                </Menu>
              }
            />
             <Item
              title="Users"
              to='/view_users'
              icon={<i class="fa fa-user"></i>}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              isMobile={isMobile}
              setIsCollapsed={setIsCollapsed}
              handleSidebar={handleSidebar}
            />
             <Item
              title="Warehouses"
              to='/view_ware_house'
              icon={<i class="fa fa-store"></i>}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              isMobile={isMobile}
              setIsCollapsed={setIsCollapsed}
              handleSidebar={handleSidebar}
            />
             <Item
              title="Item Type"
              to= '/view_item_type'
              icon={<i class="fa-solid fa-file-contract"></i>}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              isMobile={isMobile}
              setIsCollapsed={setIsCollapsed}
              handleSidebar={handleSidebar}
            />
            
            <Item
              title="Credit"
              to="/credit"
              icon={<i className="fas fa-credit-card"></i>}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
              isMobile={isMobile}
              handleSidebar={handleSidebar}
            />
            
          </Box>
        </Menu>
      </ProSidebar>
      <IconButton sx={{
        marginLeft: '5px',
        marginTop:'15px'
      }} className={display} onClick={() => handleSidebar()}>
                <MenuOutlinedIcon />
       </IconButton>
    </Box>
  );
};

export default Sidebar;
