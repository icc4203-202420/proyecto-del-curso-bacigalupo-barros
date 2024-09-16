import { useEffect, useRef, useState } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useLoadGMapsLibraries } from './useLoadGMapsLibraries';
import { MAPS_LIBRARY, MARKER_LIBRARY } from './constants';
import { TextField, IconButton, Box, List, ListItem, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BeerIcon from '@mui/icons-material/SportsBar';
import PushPinIcon from '@mui/icons-material/PushPin';

const MAP_CENTER = { lat: -31.56391, lng: -70.64827 };
const SEARCH_RADIUS = 20000; // 20 km de radio para la búsqueda

const Map = () => {
  const libraries = useLoadGMapsLibraries();
  const mapNodeRef = useRef();
  const mapRef = useRef();
  const markerCluster = useRef();
  const infoWindowRef = useRef();
  const inputRef = useRef();
  const [bars, setBars] = useState([]);
  const [filteredBars, setFilteredBars] = useState([]);
  const [selectedBar, setSelectedBar] = useState(null);
  const [searchedBars, setSearchedBars] = useState([]);

  useEffect(() => {
    const fetchBars = async () => {
      try {
        const url = 'http://127.0.0.1:3001/api/v1/bars';
        const response = await fetch(url);
        const data = await response.json();
        const barsData = data.bars;
        setBars(barsData);
        setFilteredBars(barsData); 
      } catch (error) {
        console.error('Error al obtener bares:', error);
      }
    };
    fetchBars();
  }, []);

  useEffect(() => {
    if (libraries) {
      const { Map } = libraries[MAPS_LIBRARY];
      mapRef.current = new Map(mapNodeRef.current, {
        mapId: 'DEMO_MAP_ID',
        center: MAP_CENTER,
        zoom: 7,
      });

      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const userCoords = { lat: latitude, lng: longitude };

        const userMarker = new google.maps.Marker({
          position: userCoords,
          map: mapRef.current,
          title: 'Tu ubicación',
          icon: {
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          },
        });

        mapRef.current.panTo(userCoords);
      }, () => {
        console.log('Error al obtener la ubicación del usuario');
      });
    }
  }, [libraries]);

  useEffect(() => {
    if (!libraries || filteredBars.length === 0) {
      return;
    }

    const { InfoWindow } = libraries[MAPS_LIBRARY];
    const { AdvancedMarkerElement: Marker, PinElement } = libraries[MARKER_LIBRARY];

    if (markerCluster.current) {
      markerCluster.current.clearMarkers();
    }

    const markers = filteredBars.map(({ name, latitude, longitude }) => {
      const pin = new PinElement();
      pin.glyph = name;
      const marker = new Marker({
        position: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
        content: pin.element,
      });

      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
        const infoWindow = new InfoWindow({
          content: `<div>${name}</div>`,
        });
        infoWindow.open(mapRef.current, marker);
        infoWindowRef.current = infoWindow;

        setSelectedBar({ name, latitude, longitude });
      });

      return marker;
    });

    markerCluster.current = new MarkerClusterer({
      map: mapRef.current,
      markers,
    });
  }, [libraries, filteredBars]);

  // distancia entre dos puntos geográficos
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371; // Radio de la Tierra en km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Retorna la distancia en km
  };

  const filterBarsByLocation = (lat, lng) => {
    const nearbyBars = bars.filter(bar => {
      const distance = calculateDistance(lat, lng, parseFloat(bar.latitude), parseFloat(bar.longitude));
      return distance <= SEARCH_RADIUS / 1000;
    });
    setSearchedBars(nearbyBars);
  };

  // búsqueda usando la API de Geocoder
  const handleSearch = async () => {
    const searchQuery = inputRef.current.value;
  
    if (!libraries || !searchQuery) {
      console.error("Librerías de Google Maps no cargadas o búsqueda vacía");
      return;
    }
  
    const geocoder = new window.google.maps.Geocoder();
  
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        const formattedAddress = results[0].formatted_address;
  
        console.log('Resultados del geocoding:', results); 
  
        mapRef.current.setCenter(location);
        mapRef.current.setZoom(14);
  
        const marker = new google.maps.Marker({
          position: location,
          map: mapRef.current,
          title: formattedAddress,
        });
  
        // bares cercanos a la ubicación buscada
        filterBarsByLocation(location.lat(), location.lng());

        setSelectedBar({
          name: formattedAddress,
          latitude: location.lat(),
          longitude: location.lng(),
        });

        inputRef.current.value = '';
  
      } else {
        console.error('Geocode no tuvo éxito debido a: ' + status);
      }
    });
  };

  if (!libraries) {
    return <h1>Cargando. . .</h1>;
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px', gap: '10px' }}>
        <TextField
          inputRef={inputRef}
          label="Buscar por ciudad, calle, país..."
          variant="outlined"
          fullWidth
        />
        <IconButton
          onClick={handleSearch}
          sx={{ padding: '8px', backgroundColor: '#A020F0', color: 'white' }}
        >
          <SearchIcon />
        </IconButton>
      </Box>
      <div ref={mapNodeRef} style={{ width: '100vw', height: '60vh' }} />
      {searchedBars.length > 0 && (
        <Box sx={{ padding: '10px', backgroundColor: '#A020F0', borderTop: '1px solid #ddd' }}>
          <h3>Bares cercanos:</h3>
          <List>
            {searchedBars.map(bar => (
              <ListItem key={bar.id}>
                <BeerIcon />
                <ListItemText primary={bar.name} />
                <List>
                    <ListItem>
                      <ListItemText secondary={bar.address.line1} />
                    </ListItem>
                    <ListItem>
                      <ListItemText secondary={bar.address.city} />
                    </ListItem>
                </List>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      {selectedBar && (
        <Box sx={{ padding: '10px', backgroundColor: '#A020F0', borderTop: '1px solid #ddd' }}>
          <h2><PushPinIcon />{selectedBar.name}</h2>
          <p><strong>Latitude:</strong> {selectedBar.latitude}</p>
          <p><strong>Longitude:</strong> {selectedBar.longitude}</p>
        </Box>
      )}
    </>
  );
};

export default Map;
