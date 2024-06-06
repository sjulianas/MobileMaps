import { View, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
//1 - obter permição para o usuário acessar a localização
//2- obter localização do usuário
//3 - definir a tipagem do estado
//4 - observa a posição
import { 
        requestForegroundPermissionsAsync, 
        getCurrentPositionAsync, 
        LocationObject,
        watchPositionAsync,
        LocationAccuracy,
      } from 'expo-location'; 

import { styles } from './styles';
import { useEffect, useState, useRef } from 'react'; //useRef - referencia para o mapa


export default function App() {
  const [location, setLocation] = useState<LocationObject | null>(null);

  const mapRef = useRef<MapView>(null);

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();
    
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition); // Guardar Posição atual

      // console.log("LOCALIZAÇÃO ATUAL =>", currentPosition)
    }
  }

  useEffect(() => {
    requestLocationPermissions();
    
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000, //intervalo
      distanceInterval: 1 // distância

    }, (response) => {
      // console.log("NOVA LOCALIZAÇÃO!", response);
      setLocation(response); //nova localização com alterações
      mapRef.current?.animateCamera({ //Posição da camera no mapa
        // pitch: 0,
        center: response.coords
      })
    });
  }, []);

  return (
    <View style={styles.container}>
      {location && 
        <MapView 
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005, //quão proximo a localização
            longitudeDelta: 0.005
          }}
        >
          <Marker
            coordinate={{ //cordenada
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          >
            <Image
              source={require('./assets/local.png')}
              style={{ width: 40, height: 40 }} 
            />
          </Marker>

            {/* <Image
              source={require('./assets/sensor1.png')}
              style={{ width: 40, height: 40 }} 
            /> */}

        </MapView>
      }
    </View>
  );
}
