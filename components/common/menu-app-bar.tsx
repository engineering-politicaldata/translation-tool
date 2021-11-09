import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import deleteAllCookiesFactory from 'delete-all-cookies';
import Store from '../../shared/Store';
import { CustomTheme } from '../../styles/MuiTheme';

const CustomAppBar = withStyles({
    root: {
        backgroundColor: '#FFFFFF',
    },
})(AppBar);

const useStyles = makeStyles((theme: CustomTheme) => ({
    root: {
        flexGrow: 1,
        background: theme.contrastColor,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    menuAppBar: {
        background: theme.contrastColor,
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
    }, [router.asPath]);

    const handleMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = async () => {
        await deleteAllCookiesFactory(window)();
        window.location.href = '/auth/login';
    };

    return (
        <div className='menuAppBar'>
            <CustomAppBar position='static'>
                <Toolbar>
                    <img
                        className={classes.logoImage}
                        src='/images/logos/pdi_logo_2x.png'
                        onClick={() => router.replace('/')}
                    />
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
            </CustomAppBar>
        </div>
    );
}

export default MenuAppBar;
