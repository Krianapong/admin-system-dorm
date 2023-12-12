import { useState } from "react";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Link , useNavigate } from "react-router-dom";
import { auth } from "../firebase";
const HeaderBar = ({ setIsAuthenticated , setIsAdmin }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    auth.signOut().then(() => {
      alert('Sign Out');
      setIsAuthenticated(false);
      setIsAdmin(false);
      navigate('/');
    }).catch((error) => {
      console.log('error sign out : ',error);
    });
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* empty box  */}
      <Box display="flex"   >
      </Box>

      {/* icons */}
      <Box display="flex">
        <IconButton>
          <PersonOutlinedIcon onClick={handleMenu} />
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <Link to="/admin/profile" className="menu-bars">
              <MenuItem onClick={handleClose}>Profile</MenuItem>
            </Link>
            <Link to="/admin/chat" className="menu-bars">
              <MenuItem onClick={handleClose}>Chat</MenuItem>
            </Link>
            <Link to="#" className="menu-bars">
              <MenuItem onClick={handleSignOut}>Log out</MenuItem>
            </Link>
          </Menu>
        </IconButton>
      </Box>
    </Box>
  );
};

export default HeaderBar;