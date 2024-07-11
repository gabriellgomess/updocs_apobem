import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Logo from '../assets/logo.png';
import { Link } from 'react-router-dom';


export default function Header() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar
                position="static"
                sx={{
                    borderBottom: '6px solid transparent',
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        right: 0,
                        height: 8,
                        background: 'linear-gradient(144deg, rgba(249,30,58,1) 13%, rgba(242,139,38,1) 62%)',
                    },
                }}
            >
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <Link to={`${import.meta.env.VITE_URL}/`}>
                            <MenuItem onClick={handleClose}>Inicio</MenuItem>
                        </Link>
                        <MenuItem onClick={handleClose}>Digitalizar Documentos</MenuItem>

                    </Menu>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <img width="70px" src={Logo} alt="" />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className='roboto-slab-800'>
                            Digitalize seus documentos
                        </Typography>
                    </Box>

                </Toolbar>
            </AppBar>
        </Box>
    );
}
