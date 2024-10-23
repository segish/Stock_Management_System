// import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Avatar } from "@mui/material";
import  Axios  from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CircularProgress from '@mui/material/CircularProgress';
import Message from './Message';
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
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
const Account = ({fullScreen, open, handleClose}) => {
  const [userId, setUserId] =useState('');
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [role, setRole] = useState('');
  const [profile, setProfile] = useState('');
  const [isUploaded, setIsUploaded] = useState(true);
  const [upload, setUpload] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openAlert, setOpenAlert] = useState(true);
  const [reload, setReload] = useState(false);
  const covertToBase64 = (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setProfileImage((prev) => ({ ...prev, profile: reader.result }))
    };
    reader.onerror = error => {
        
    };
}
const handleUpload = () => {
  setUpload(true);
  Axios.post(`/auth/update/${userId}`, {
    profile: profileImage.profile,
  }).then((response) => {
    setOpenAlert(true);
    setMessage('Profile Updated successfully!!!');
    setUpload(false);
    setReload(!reload);
 setIsUploaded(false);
  }).catch((error) => {
   if (error.response && error.response.data) {
    setOpenAlert(true);
        setErrorMessage(error.response.data);
      } else {
        setOpenAlert(true);
        setErrorMessage("An error occurred");
      }
      setIsUploaded(true);
      setUpload(false);
  })
}
  useEffect(() => {
    Axios.post('/auth/refresh',{
      withCredentials: true,
    }).then((response) => {
      setAdminName(response.data.adminName);
      setEmail(response.data.email);
      setPhone(response.data.phone);
      setRole(response.data.type);
      setUserId(response.data._id);
      setProfile(response.data.profile);
       }).catch((error) => {
        
       })
}, [reload]);
  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Manage Profile
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      {message && <Message message={message} openAlert={openAlert}  setOpenAlert={setOpenAlert} severity='success'/>}
      {errorMessage && <Message message={errorMessage} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='error'/>}
      <DialogContent dividers sx={{ display: 'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}> 
      <Avatar sx={{ m: 0, bgcolor: 'secondary.main', width: '150px',  
           height: '150px'}} >
           <img
                  alt="profile-user"
                  width="150px"
                  height="150px"
                  src=  {profile ? profile : (profileImage.profile ? profileImage.profile :`../../assets/user.png`)}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                  
                />
          </Avatar>
          <Typography gutterBottom variant="body1" style={{display: 'flex', justifyContent: 'center', alignItems:'center', marginTop: '5px'}}>
            {adminName}
          </Typography>
          <Typography gutterBottom variant="body1" style={{display: 'flex', justifyContent: 'center', alignItems:'center', marginTop: '5px'}}>
           {email}
          </Typography>
          <Typography gutterBottom variant="body1" style={{display: 'flex', justifyContent: 'center', alignItems:'center', marginTop: '5px'}}>
           {role}
          </Typography>
          <Typography gutterBottom variant="body1" style={{display: 'flex', justifyContent: 'center', alignItems:'center', marginTop: '5px'}}>
           {phone}
          </Typography>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center' }}> 
          <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
          Upload file
          <VisuallyHiddenInput name="profile" id="file" type="file" accept="image/star" onChange={(e) => covertToBase64(e)} />
        </Button>
        

   
       {isUploaded && profileImage.profile && <Button variant="contained"
            color="primary" onClick={() => handleUpload()} > 
          {upload ? <CircularProgress color='secondary' size={25}/> : 'Cahnge Profile'}
        </Button>}
      </DialogActions>
    </BootstrapDialog>

  )
}

export default Account;