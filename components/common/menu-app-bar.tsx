import React, { Fragment, useEffect } from 'react';
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
    title: {
        flexGrow: 1,
    },

    logoImage: {
        marginRight: theme.spacing(2),
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
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await deleteAllCookiesFactory(window)();
        window.location.href = '/auth/login';
    };

    return (
        <Fragment>
            <CustomAppBar position='sticky'>
                <Toolbar>
                    <img
                        className={classes.logoImage}
                        src='/images/logos/pdi_logo_2x.png'
                        onClick={() => router.replace('/')}
                    />
                    <Typography variant='subtitle1' className={classes.title}>
                        Translation Tool
                    </Typography>
                    {userToken && (
                        <div>
                            <IconButton
                                aria-label='User account actions'
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
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </CustomAppBar>
        </Fragment>
    );
}

export default MenuAppBar;
