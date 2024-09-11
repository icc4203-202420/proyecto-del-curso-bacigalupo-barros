import { useEffect, useRef } from 'react';
import { useLoadGMapsLibraries } from './useLoadGMapsLibraries';
import { MAPS_LIBRARY } from './constants';
import { randomCoordinates } from './utils';

const MAP_CENTER = { lat: -31.56391, lng: -70.64827 };

const Map = () => {
  const libraries = useLoadGMapsLibraries();
  const mapNodeRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    if (!libraries) {
      return;
    }

    const { Map } = libraries[MAPS_LIBRARY];
    mapRef.current = new Map(mapNodeRef.current, {
      mapId: 'DEMO_MAP_ID',
      center: MAP_CENTER,
      zoom: 7,
    });

    const { Marker } = libraries['marker']; // Asegúrate de que la biblioteca de marcadores esté cargada
    const randomPosition = randomCoordinates(MAP_CENTER, 0.1); // Rango de 0.1 grados
    new Marker({
      position: randomPosition,
      map: mapRef.current,
    });
  }, [libraries]);

  if (!libraries) {
    return <h1>Cargando. . .</h1>;
  }

  return <div ref={mapNodeRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default Map;