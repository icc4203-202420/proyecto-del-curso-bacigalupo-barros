import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon, TextField, Box } from '@mui/material';
import { Card, CardContent } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import BeerIcon from '@mui/icons-material/SportsBar';
import SearchIcon from '@mui/icons-material/Search';
import LocalBarIcon from '@mui/icons-material/Storefront';
import Beers from './components/Beer';
import Bars from './components/Bar';
import UserSearch from './components/UserSearch';
import Events from './components/Events';


function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
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
            <ListItem button component={Link} to="/usersearch" onClick={toggleDrawer}>
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary="UserSearch" />
            </ListItem>
        </List>
      </Drawer>
      <Toolbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/beers" element={<Beers />} />
        <Route path="/bars" element={<Bars />} />
        <Route path="/usersearch" element={<UserSearch />} />
        <Route path="/bars/:bar_id/events" element={<Events />} />
      </Routes>
    </>
  );
}

function Home(){
  return(
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

function Test(){
  return (
    <Typography variant="h3" component="div">
      Testing, testing! 1,2,3
    </Typography>
  );
}

export default App
