import React, {useState, useEffect, use} from 'react';
import {
  View,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {db} from '../../firebaseConfig'; // Import Firestore instance
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import Geolocation from 'react-native-geolocation-service';

const GameMap = ({roomId, userId}) => {
  const [players, setPlayers] = useState({});
  const [currentLocation, setCurrentLocation] = useState(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  useEffect(() => {
    if (!roomId || !userId) {
      return;
    } // Prevent crash if IDs are missing

    // Reference Firestore collection
    // console.log(roomId, userId);
    const roomRef = doc(db, 'rooms', roomId); // Reference to the room document

    // Listen for real-time updates
    const unsubscribe = onSnapshot(roomRef, docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log(data);
        setPlayers(data.players || []); // Get players array
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [roomId, userId]);
  //////
  useEffect(() => {
    const trackLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert(
          'Location Permission Denied',
          'Please enable location permissions.',
        );
        return;
      }

      const watchId = Geolocation.watchPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setCurrentLocation({latitude, longitude});

          console.log(`Updated Location: ${latitude}, ${longitude}`);

          // Firestore update logic (uncomment when needed)
          const updateCoordinates = async (x, y) => {
            try {
              const userRef = doc(db, 'rooms', roomId);

              await updateDoc(userRef, {
                [`players.${userId}.lat`]: x,
                [`players.${userId}.lng`]: y,
              });

              console.log('Coordinates updated successfully!');
            } catch (error) {
              console.error('Error updating coordinates:', error);
            }
          };
          updateCoordinates(latitude, longitude);
        },
        error => {
          console.log('Location error:', error);
          Alert.alert('Location Error', error.message);
        },
        {enableHighAccuracy: true, distanceFilter: 5},
      );

      return () => Geolocation.clearWatch(watchId);
    };

    trackLocation();
  }, [roomId, userId]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        customMapStyle={DARK_MAP_STYLE}
        region={{
          latitude: currentLocation?.latitude || 38.624,
          longitude: currentLocation?.longitude || -90.184,
          latitudeDelta: 0.0005,
          longitudeDelta: 0.0005,
        }}
        followsUserLocation={true}
        rotateEnabled={false}
        // pitchEnabled={false}
        // zoomEnabled={false}
        showsScale={false}
        showsCompass={false}
        showsUserLocation={true}>
        {/* Display all players on the map */}
        {Object.keys(players).map(playerId => {
          const player = players[playerId];
          console.log(player);
          return (
            <Marker
              key={playerId}
              coordinate={{
                latitude: player.lat || 0,
                longitude: player.lng || 0,
              }}
              title={player.name}
              pinColor={
                playerId === userId
                  ? 'yellow'
                  : player.alive
                  ? 'orange'
                  : 'black'
              }
            />
          );
        })}
      </MapView>
    </View>
  );
};

const DARK_MAP_STYLE = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#242f3e',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#746855',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#242f3e',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#263c3f',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#6b9a76',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#38414e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#212a37',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9ca5b3',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#746855',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#1f2835',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#f3d19c',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [
      {
        color: '#2f3948',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#d59563',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#515c6d',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#17263c',
      },
    ],
  },
];
const styles = StyleSheet.create({
  container: {flex: 1},
  map: {flex: 1},
});

export default GameMap;
