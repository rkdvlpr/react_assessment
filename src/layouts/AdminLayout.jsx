import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, Toolbar, List, Typography, IconButton, Divider, Container, useMediaQuery } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import { SidebarMenu } from './SidebarMenu';
import TopMenu from './TopMenu';
import { useSelector } from 'react-redux';

const mdTheme = createTheme({
    palette: {
        type: 'light',
        primary: {
            main: '#080093',
        },
        secondary: {
            main: '#489cda',
        },
        warning: {
            main: '#ff9100',
        },
        danger: {
            main: '#ff1744',
        },
    },
});

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: useMediaQuery(theme.breakpoints.up('sm')) ? drawerWidth : '0',
        width: `calc(100% - ${useMediaQuery(theme.breakpoints.up('sm')) ? drawerWidth : '0'}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
            ...(!useMediaQuery(theme.breakpoints.up('sm')) && {
                width: open ? '200px' : '0',
            }),
        },
    }),
);

const AdminLayout = () => {
    const smup = useMediaQuery(mdTheme.breakpoints.up('sm'));
    const user = useSelector(state => state.auth.user);
    const location = useLocation();
    const [open, setOpen] = useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };
    const getTitle = () => {
        var routelist = {
            "/": "Dashboard",
            "/mail-template": "Mail Template",
            "/mail-template/add": "Add Mail Template",
            "/state": "State",
            "/batch-type": "Batch types",
            "/project-category": "Project Category",
            "/difficulty-level": "Difficulty Level",
            "/roles": "Roles",
            "/users": "Users",
            "/sectors": "Sectors",
            "/jobroles": "Jobroles",
            "/jobroles/add": "Add New Jobrole",
            "/batch": "Batch",
            "/batch/import": "Batch Import",
            "/batch/add": "Add New Batch",
            "/candidate": "Candidate",
            "/candidate/add": "Add New Candidate",
            "/candidate/import": "Candidate Import",
            "/assessor/add": "Add New Assessor",
            "/assessor/import": "Assessor Import",
            "/profile": "Profile",
            "/question/import": "Import Question",
            "/question/add": "Add New Question",
            "/strategy/add": "Add New Strategy",
            "/assessment/add": "Add New Assessment",
        };
        if (routelist[location.pathname])
            return routelist[location.pathname];
        if (/(\/state\/+[a-zA-Z0-9])/gm.test(location.pathname))
            return 'State City List';
        if (/(\/jobroles\/+[a-zA-Z0-9]+\/edit)/gm.test(location.pathname))
            return 'Edit Jobrole';
        if (/(\/batch\/+[a-zA-Z0-9]+\/edit)/gm.test(location.pathname))
            return 'Edit Batch';
        if (/(\/candidate\/+[a-zA-Z0-9]+\/edit)/gm.test(location.pathname))
            return 'Edit Candidate';
        if (/(\/candidate\/+[a-zA-Z0-9]+\/list)/gm.test(location.pathname))
            return 'Batch Candidate List';
        if (/(\/assessor\/+[a-zA-Z0-9]+\/edit)/gm.test(location.pathname))
            return 'Edit Assessor';
        if (/(\/mail-template\/+[a-zA-Z0-9]+\/edit)/gm.test(location.pathname))
            return 'Edit Mail Template';
        if (/(\/question\/+[a-zA-Z0-9]+\/edit)/gm.test(location.pathname))
            return 'Edit Question';
        if (/(\/strategy\/+[a-zA-Z0-9]+\/edit)/gm.test(location.pathname))
            return 'Edit Strategy';
        if (/(\/strategy\/+[a-zA-Z0-9]+\/generate)/gm.test(location.pathname))
            return 'Generate Assessment Sets';
        if (/(\/strategy\/+[a-zA-Z0-9]+\/detail)/gm.test(location.pathname))
            return 'Strategy Detail';
        if (/(\/assessment\/+[a-zA-Z0-9]+\/edit)/gm.test(location.pathname))
            return 'Edit Assessment';
        let str = location.pathname.replace(/^\/+/, '');
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    React.useEffect(() => {
        if (smup) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [smup, location.pathname]);

    return <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="absolute" open={open}>
                <Toolbar
                    sx={{
                        pr: '24px', // keep right padding when drawer closed
                    }}
                >
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: '36px',
                            ...(smup && open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        sx={{ flexGrow: 1 }}
                    >
                        {getTitle()}
                    </Typography>
                    <TopMenu />
                </Toolbar>
            </AppBar>
            <Drawer variant={'permanent'} anchor="left" open={open} ModalProps={{ keepMounted: true }}>
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        px: [1],
                    }}
                >
                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        sx={{ flexGrow: 1 }}
                    >
                        {user ? user.name : 'Admin'}
                    </Typography>
                    <IconButton onClick={toggleDrawer}>
                        <ChevronLeftIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List component="nav" className='overflow-y-auto' style={{ maxHeight: 'calc(100vh - 65px)' }}>
                    {SidebarMenu}
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'auto',
                }}
            >
                <Toolbar />
                <Container className='my-5'>
                    <Outlet />
                </Container>
            </Box>
        </Box>
    </ThemeProvider>
}

export default AdminLayout;