import React, { useState } from 'react';
import './App.css';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon, Card, CardContent } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import BeerIcon from '@mui/icons-material/SportsBar';
import SearchIcon from '@mui/icons-material/Search';
import LocalBarIcon from '@mui/icons-material/Storefront';
import MapIcon from '@mui/icons-material/Map';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import Beers from './components/Beer';
import Bars from './components/Bar';
import UserSearch from './components/UserSearch';
import Events from './components/Events';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import LogOut from './components/LogOut';
import BeerDetails from './components/BeerDetails';
import BeerReviews from './components/BeerReviews';
import Map from './components/Map'
import EventGallery from './components/EventGallery';

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogin = (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
      setIsLoggedIn(true);
      navigate('/');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: '#A020F0' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            BarMan
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <List>
          <ListItem button component={Link} to="/" onClick={toggleDrawer}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          {isLoggedIn ? (
            <>
              <ListItem button component={Link} to="/beers" onClick={toggleDrawer}>
                <ListItemIcon>
                  <BeerIcon />
                </ListItemIcon>
                <ListItemText primary="Beers" />
              </ListItem>
              <ListItem button component={Link} to="/bars" onClick={toggleDrawer}>
                <ListItemIcon>
                  <LocalBarIcon />
                </ListItemIcon>
                <ListItemText primary="Bars" />
              </ListItem>
              <ListItem button component={Link} to="/map" onClick={toggleDrawer}>
                <ListItemIcon>
                  <MapIcon />
                </ListItemIcon>
                <ListItemText primary="Map" />
              </ListItem>
              <ListItem button component={Link} to="/usersearch" onClick={toggleDrawer}>
                <ListItemIcon>
                  <SearchIcon />
                </ListItemIcon>
                <ListItemText primary="UserSearch" />
              </ListItem>
              <ListItem button onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="LogOut" />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem button component={Link} to="/signup" onClick={toggleDrawer}>
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="SignUp" />
              </ListItem>
              <ListItem button component={Link} to="/login" onClick={toggleDrawer}>
                <ListItemIcon>
                  <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="LogIn" />
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
      <Toolbar />
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <RedirectToLogin />} />
        <Route path="/signup" element={!isLoggedIn ? <SignUp /> : <RedirectToHome />} />
        <Route path="/login" element={!isLoggedIn ? <LogIn onLogin={handleLogin} /> : <RedirectToHome />} />
        <Route path="/beers" element={isLoggedIn ? <Beers /> : <RedirectToLogin />} />
        <Route path="/bars" element={isLoggedIn ? <Bars /> : <RedirectToLogin />} />
        <Route path="/usersearch" element={isLoggedIn ? <UserSearch /> : <RedirectToLogin />} />
        <Route path="/bars/:bar_id/events" element={isLoggedIn ? <Events /> : <RedirectToLogin />} />
        <Route path="/beers/:id" element={isLoggedIn ? <BeerDetails /> : <RedirectToLogin />} />
        <Route path="/beers/:id/reviews" element={isLoggedIn ? <BeerReviews /> : <RedirectToLogin />} />
        <Route path="/map" element={isLoggedIn ? <Map /> : <RedirectToLogin />}/>
        <Route path="/events/:id" element={<EventGallery />} />
      </Routes>
    </>
  );
}

function RedirectToHome() {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate('/');
  }, [navigate]);

  return null;
}

function RedirectToLogin() {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate('/login');
  }, [navigate]);

  return null;
}

function Home() {
  const [nearbyBars, setNearbyBars] = useState([]);
  const handleNearbyBarsUpdate = (bars) => {
    setNearbyBars(bars);
  };
  return (
    <Card sx={{ margin: 2, maxWidth: 600, mx: "auto" }}>
      <CardContent sx={{
        maxWidth: 345,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: '#A020F0',
        color: '#ffffff'
      }}>
        <BeerIcon />
        <Typography variant="h5" component="div" gutterBottom>
          Welcome to BarMan
        </Typography>
        The social network designed for beer enthusiasts
      </CardContent>
    </Card>
  );
}

export default App;
