import React, { useState, useEffect } from 'react';
import { AppBar, Avatar, Toolbar, Typography, Button } from '@material-ui/core';
import useStyles from './styles';
import memoriesLogo from '../../images/memories-Logo.png';
import memoriesText from '../../images/memories-Text.png';
import { Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { LOGOUT } from '../../constants/actionTypes';

const Navbar = () => {
  const classes = useStyles();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();

  const logout = () => {
    dispatch({ type: LOGOUT });
    history.push('/');
    setUserInfo(null);
  };

  useEffect(() => {
    const getToken = JSON.parse(localStorage.getItem('token'));
    if (getToken) {
      setUserInfo(jwt_decode(getToken?.token));
    }
    if (userInfo?.exp * 1000 < new Date().getTime()) logout();
  }, [location, userInfo?.exp]);

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <Link to="/" className={classes.brandContainer}>
        <img src={memoriesText} alt="icon" height="45px" />
        <img
          className={classes.image}
          src={memoriesLogo}
          alt="memories"
          height="40"
        />
      </Link>
      <Toolbar className={classes.toolbar}>
        {userInfo ? (
          <div className={classes.profile}>
            <Avatar className={classes.purple} alt="test">
              {userInfo?.name?.charAt(0)}
            </Avatar>
            <Typography className={classes.userName} variant="h6">
              {userInfo?.name}
            </Typography>
            <Button
              variant="contained"
              className={classes.logout}
              color="secondary"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/auth"
          >
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
