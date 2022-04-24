import React, { useState } from "react";
import { Box, IconButton, Badge, Divider, Tooltip, Avatar, Menu, MenuItem, ListItemIcon } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useDispatch } from "react-redux";
import { SET_TOKEN, SET_USER } from "../store/auth";

const TopMenu = () => {
    const dispatch = useDispatch();
    const [menuEl, setMenuEl] = useState(null)
    const menu = Boolean(menuEl);

    const handleLogout = () => {
        dispatch(SET_TOKEN(''));
        dispatch(SET_USER({}));
    };

    return (<React.Fragment>
        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
            <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Tooltip title="Account settings">
                <IconButton
                    onClick={(e) => setMenuEl(e.currentTarget)}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={menu ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={menu ? 'true' : undefined}
                >
                    <Avatar sx={{ width: 32, height: 32 }}>M</Avatar>
                </IconButton>
            </Tooltip>
        </Box>
        <Menu
            anchorEl={menuEl}
            id="account-menu"
            open={menu}
            onClose={() => setMenuEl(null)}
            onClick={() => setMenuEl(null)}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
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
            <MenuItem>
                <Avatar /> Profile
            </MenuItem>
            <MenuItem>
                <Avatar /> My account
            </MenuItem>
            <Divider />
            <MenuItem>
                <ListItemIcon>
                    <Settings fontSize="small" />
                </ListItemIcon>
                Settings
            </MenuItem>
            <MenuItem onClick={()=>handleLogout()}>
                <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                Logout
            </MenuItem>
        </Menu>
    </React.Fragment>)
};

export default TopMenu;