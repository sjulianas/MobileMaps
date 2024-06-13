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

  const mapRef = useRef<MapView>(null);

  const latSensor = -22.914069;
  const longSensor = -47.068136;

  
  const latSensor2 = -22.914199;
  const longSensor2 = -47.068572;


  const latSensor3 = -22.914208;
  const longSensor3 = -47.068324;

  const latSensor4 = -22.914280;
  const longSensor4 = -47.068621;



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
            coordinate={{ //cordenada
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          >
            <Image
              source={require('./assets/local.png')}
              style={{ width: 20, height: 20 }} 
            />
          </Marker>

          <Marker pinColor='green' onPress={()=> {console.log("Cliquei");}}coordinate={{latitude: latSensor, longitude: longSensor}}>
            <Image source={require('./assets/sensor1.png')} style={{ width: 30, height: 30 }} />
          </Marker>

          <Marker pinColor='red' onPress={()=> {console.log("Cliquei");}}coordinate={{latitude: latSensor2, longitude: longSensor2}}>
            <Image source={require('./assets/sensor2.png')} style={{ width: 30, height: 30 }} />
          </Marker>

          <Marker pinColor='blue' onPress={()=> {console.log("Cliquei");}}coordinate={{latitude: latSensor3, longitude: longSensor3}}>
            <Image source={require('./assets/sensor3.png')} style={{ width: 30, height: 30 }} />
          </Marker>

          <Marker pinColor='yellow' onPress={()=> {console.log("Cliquei");}}coordinate={{latitude: latSensor4, longitude: longSensor4}}>
            <Image source={require('./assets/sensor4.png')} style={{ width: 30, height: 30 }} />
          </Marker>

        </MapView>
      
      }

      <View>
            <Text style={{marginTop: 30, fontSize: 17 }}>
              Latitude: {location?.coords.latitude.toFixed(6)}
            </Text>

            <Text style={{marginTop: 5, fontSize: 17 }}>
              Longitude: {location?.coords.longitude.toFixed(6)}
            </Text>
      </View>

      
      {/* <View>
        <Text>
          Sensor {id} com o tipo (tipo), de latitude (lat) e longitude (long)
        </Text>
      </View> */}

    {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Ir para Sensores" onPress={() => navigation.navigate('Sensores')} // Navega para a tela de Sensores quando o botão é clicado
      />
    </View> */}

    </View>
  );
}
