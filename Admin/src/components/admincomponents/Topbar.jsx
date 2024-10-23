import * as React from 'react';
import { Avatar, Box, Button, Divider, IconButton, ListItemIcon, Menu, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import Badge from '@mui/material/Badge';
import { MenuItem } from 'react-pro-sidebar';
import { Logout, Person, PersonAdd, Settings } from '@mui/icons-material';
import axios from 'axios';
import Axios from 'axios';
import { useEffect, useState } from "react";
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/Context';
import { formatDistanceToNow } from 'date-fns';
import Account from './Account';
const styles = {
  notification: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  notificationInfo: {
    fontSize: '12px',
    color: 'white',
  },
  cashier: {
    fontWeight: 'bold',
    marginRight: '5px',
  },
  quantity: {
    fontWeight: 'bold',
    marginRight: '5px',
  },
};
const Topbar = () => {
 
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [openAccount, setOpenAccount] = React.useState(false);
  const [showMore, setShowMore] = useState(false);
  const [anchorE2, setAnchorE2] = React.useState(null);
  const openNot = Boolean(anchorE2);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickNot = (event) => {
    setAnchorE2(event.currentTarget);
  };
  const closePopUp = (value) => {
    setAnchorE2(value);
  }
  const handleClickOpen = () => {
    setOpenAccount(true);
};

    const handleCloseAccount = () => {
      setOpenAccount(false);
    };
   
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseNot = () => {
    setAnchorE2(null);
  };
  const { refreshUser } = useContext(AuthContext)


  const logout = async (e) => {

    try {
      await axios.post('/auth/logout').then((response) => {
        refreshUser(null)
        localStorage.setItem("user", JSON.stringify(null))
        Navigate("/")
      }).catch((error) => {
      })
    } catch (err) {
    }
  }
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const colorMode = useContext(ColorModeContext);
  const [notifications, setNotifiCations] = useState([]);
  const [count, setCount] = useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');
  useEffect(() => {
    Axios.get('/toshoppending/getall').then((response) => {
    setNotifiCations(response.data);
    setCount(response.data.length);
     }).catch((error) => {
     })
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Box display="flex" justifyContent= {isMobile ? `flex-end` : `flex-end`} py={2}>
  <Account  fullScreen ={fullScreen} open= {openAccount}  handleClose = {handleCloseAccount}/>
      <Box >
        <IconButton onClick={colorMode.toggleColorMode}>
          <Tooltip title={theme.palette.mode === "dark" ? "Light mode" : "Dark mode"}>
            {theme.palette.mode === "dark" ? (
              <LightModeOutlinedIcon />
            ) : (
              <DarkModeOutlinedIcon />
            )}
          </Tooltip>
        </IconButton>
        <IconButton >
          <Tooltip title="notifications">
            <Badge badgeContent={count} color="error"> 
              <NotificationsOutlinedIcon  onClick={handleClickNot}/>
            </Badge>
          </Tooltip>
        </IconButton>
    
        <IconButton>
          <Tooltip title="Account">
            <PersonOutlinedIcon
              onClick={handleClick} />
          </Tooltip>
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            p: 2,
            paddingRight: 5,
            paddingTop: 2,
            paddingLeft: 2,
            paddingBottom: 2,
            '& .MuiAvatar-root': {
              width: 30,
              height: 30,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleClickOpen()} >
          <ListItemIcon >
            <Person  fontSize= 'small'/>
          </ListItemIcon>
          My account
        </MenuItem>
        <Divider sx={{
          marginTop: '10px'
        }}/>
        <Link to="/add_users" >
          <MenuItem >
            <ListItemIcon>
              <PersonAdd fontSize="small" />
            </ListItemIcon>
            <span style={{color:'white'}}>
            New account
            </span>
          </MenuItem>
        </Link>
        <MenuItem onClick={handleClose}>
          <Link to="/changePass">
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <span style={{color:'white'}}>
          Change Password
          </span>
          </Link>
        </MenuItem>
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <Logout fontSize="medium" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={anchorE2}
        id="account-menu"
        open={openNot}
        onClose={handleCloseNot}
        
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            p: 2,
            paddingRight: 5,
            paddingTop: 2,
            paddingLeft: 2,
            paddingBottom: 2,
            '& .MuiAvatar-root': {
              width: 30,
              height: 30,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
              {notifications
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, showMore ? notifications.length : 3)
  .map((message) => (
    <div key={message._id} style={styles.notification}>
      <Avatar style={{ width: '20px', height: '20px' }} />
      <p style={styles.notificationInfo} onClick={() => closePopUp(false)}>
        <Link style={{ color: 'white' }} to='/pendingshopitems'>
          <span style={styles.cashier}>{message.cashierName}</span> requested <span style={styles.quantity}>{message.quantity}</span> {message.name} {formatDistanceToNow(new Date(message.createdAt))} ago
        </Link>
      </p>
    </div>
  ))}
  {notifications.length > 3 && !showMore && (
    <Box  sx={{
      display:'flex',
      justifyContent:isMobile ? 'flex-end': 'flex-end'
    }}>
      <Button
      variant="outlined"
      onClick={() => setShowMore(true)}
      sx={{
        color:'white'
      }}
    >
      More
    </Button>
    </Box>
    )}

{showMore && (<>{notifications
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(notifications.length)
  .map((message) => (
    <div key={message._id} style={styles.notification}>
      <Avatar style={{ width: '20px', height: '20px' }} />
      <p style={styles.notificationInfo} onClick={() => closePopUp(false)}>
        <Link style={{ color: 'white' }} to='/pendingshopitems' >
          <span style={styles.cashier}>{message.cashierName}</span> requested <span style={styles.quantity}>{message.quantity}</span> {message.name} {formatDistanceToNow(new Date(message.createdAt))} ago
        </Link>
      </p>
    </div>
  ))}
  <Box sx={{
      display:'flex',
      justifyContent:isMobile ? 'flex-end': 'flex-end'
    }}>
  <Button
  variant="outlined"
  onClick={() => setShowMore(false)}
  sx={{
    color: 'white', 
  }}
>
  Less
</Button>
</Box>
  </>
  )}
      </Menu>
    </Box>
  );
};

export default Topbar;