import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import deleteAllCookiesFactory from 'delete-all-cookies';
import Store from '../../shared/Store';
import { useRouter } from 'next/router';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        background: '#008caa',
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    menuAppBar: {
        background: '#008caa',
    },
    logoImage: {
        height: '50px',
    },
}));

function MenuAppBar() {
    const classes = useStyles();
    const [userToken, setUserToken] = React.useState('');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const router = useRouter();

    useEffect(() => {
        let token = Store.getToken();
        setUserToken(token);
        console.log('test : ', token);
    }, [router.asPath]);

    const handleMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = async () => {
        await deleteAllCookiesFactory(window)();
        setAnchorEl(null);
        window.location.href = '/auth/login';
    };

    return (
        <div className='menuAppBar'>
            <AppBar position='static'>
                <Toolbar>
                    <IconButton
                        edge='start'
                        className={classes.menuButton}
                        color='inherit'
                        aria-label='menu'
                    >
                        <img className={classes.logoImage} src='/images/logos/pdi_logo_2x.png' />
                    </IconButton>
                    <Typography variant='h6' className={classes.title}>
                        Translation Tool
                    </Typography>
                    {userToken && (
                        <div>
                            <IconButton
                                aria-label='account of current user'
                                aria-controls='menu-appbar'
                                aria-haspopup='true'
                                onClick={handleMenu}
                                color='inherit'
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id='menu-appbar'
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleClose}>Logout</MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default MenuAppBar;
