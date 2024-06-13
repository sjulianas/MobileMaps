import { View, Image, Text, ScrollView, Button } from 'react-native';
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

// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';

export default function App() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [nearestSensor, setNearestSensor] = useState<string | null>(null);

  const mapRef = useRef<MapView>(null);

  const sensors = [
    { lat: -22.914069, long: -47.068136, name: 'Sensor 1', image: require('./assets/sensor1.png') },
    { lat: -22.914199, long: -47.068572, name: 'Sensor 2', image: require('./assets/sensor2.png') },
    { lat: -22.914208, long: -47.068324, name: 'Sensor 3', image: require('./assets/sensor3.png') },
    { lat: -22.914280, long: -47.068621, name: 'Sensor 4', image: require('./assets/sensor4.png') },
  ];

  function calcularDistancias(lat1, lon1, lat2, lon2) { 
    const R = 6371; 

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
  }

  function calculoProximo(currentLat, currentLong) {
    let nearest = sensors[0];

    let minDistance = calcularDistancias(currentLat, currentLong, sensors[0].lat, sensors[0].long);
    
    sensors.forEach(sensor => {
      const distance = calcularDistancias(currentLat, currentLong, sensor.lat, sensor.long);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = sensor;
      }
    });

    return nearest.name;
  }

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();
    
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition); // Guardar Posição atual
    }
  }

  useEffect(() => {
    requestLocationPermissions();
    
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000, //intervalo
      distanceInterval: 1 // distância

    }, (response) => {
      setLocation(response); //nova localização com alterações
      mapRef.current?.animateCamera({ //Posição da camera no mapa
        center: response.coords
      });

      const nearest = calculoProximo(response.coords.latitude, response.coords.longitude);
      setNearestSensor(nearest);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/Logo.png')}
        style={{ width: '70%', marginBottom: 20 }} />

      <Text style={{marginTop: 5, marginBottom:20, fontWeight: 600, fontSize: 20 }}>Localização dos Sensores</Text>
      <Text style={{marginTop: -15, color: '#929395', marginBottom:30, fontWeight: 600, fontSize: 17 }}>Veja em tempo real os sensores!</Text>

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
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          >
            <Image
              source={require('./assets/local.png')}
              style={{ width: 20, height: 20 }} 
            />
          </Marker>

          {sensors.map((sensor, index) => (
            <Marker
              key={index}
              coordinate={{latitude: sensor.lat, longitude: sensor.long}}
            >
              <Image source={sensor.image} style={{ width: 30, height: 30 }} />
            </Marker>
          ))}
        </MapView>
      }

      <View>
        <Text style={{marginTop: 30, fontSize: 17 }}>
          Latitude: {location?.coords.latitude.toFixed(6)}
        </Text>

        <Text style={{marginTop: 5, fontSize: 17 }}>
          Longitude: {location?.coords.longitude.toFixed(6)}
        </Text>

        <Text style={{marginTop: 15, fontSize: 17, fontWeight: 'bold', color: '#5D9630' }}>
          Sensor mais próximo: {nearestSensor}
        </Text>
      </View>

      {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button title="Ir para Sensores" onPress={() => navigation.navigate('Sensores')} // Navega para a tela de Sensores quando o botão é clicado
        />
      </View> */}


    </View>
  );
}
