import { useEffect, useRef, useState } from 'react';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useLoadGMapsLibraries } from './useLoadGMapsLibraries';
import { MAPS_LIBRARY, MARKER_LIBRARY } from './constants';

const MAP_CENTER = { lat: -31.56391, lng: -70.64827 };

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

  // Muestra la ubicación del usuario
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

  // Coloca los marcadores de los bares en el mapa
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

  // Búsqueda por dirección utilizando Geocoder API
  const handleSearch = async () => {
    const searchQuery = inputRef.current.value;

    if (!libraries || !searchQuery) {
      return;
    }

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        const formattedAddress = results[0].formatted_address;

        // Centrar el mapa en las coordenadas obtenidas
        mapRef.current.setCenter(location);
        mapRef.current.setZoom(14);

        const marker = new google.maps.Marker({
          position: location,
          map: mapRef.current,
          title: formattedAddress,
        });

        setSelectedBar({ name: formattedAddress, latitude: location.lat(), longitude: location.lng() });
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
      <div style={{ padding: '10px', display: 'flex', gap: '10px' }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar por ciudad, calle, país..."
          style={{ flexGrow: 1, padding: '8px' }}
        />
        <button onClick={handleSearch} style={{ padding: '8px', cursor: 'pointer' }}>
          Buscar
        </button>
      </div>
      <div ref={mapNodeRef} style={{ width: '100vw', height: '80vh' }} />
      {selectedBar && (
        <div style={{ padding: '10px', background: '#f5f5f5', borderTop: '1px solid #ddd' }}>
          <h2>{selectedBar.name}</h2>
          <p><strong>Latitude:</strong> {selectedBar.latitude}</p>
          <p><strong>Longitude:</strong> {selectedBar.longitude}</p>
        </div>
      )}
    </>
  );
};

export default Map;
