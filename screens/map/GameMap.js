// import React, {useState, useEffect} from 'react';
// import {View, StyleSheet} from 'react-native';
// import MapView, {Marker} from 'react-native-maps';
// import database from '@react-native-firebase/database';
// import Geolocation from 'react-native-geolocation-service';

// const GameMap = ({roomId, userId}) => {
//   const [players, setPlayers] = useState({});
//   const [currentLocation, setCurrentLocation] = useState(null);

//   //   useEffect(() => {
//   //     // Watch player locations in Firebase
//   //     const roomRef = database().ref(`rooms/${roomId}/players`);
//   //     roomRef.on('value', snapshot => {
//   //       if (snapshot.exists()) {
//   //         setPlayers(snapshot.val());
//   //       }
//   //     });

//   //     // Cleanup on unmount
//   //     return () => roomRef.off('value');
//   //   }, [roomId]);

//   // useEffect(() => {
//   // Track user location and update Firebase
//   // const watchId = Geolocation.watchPosition(
//   //   position => {
//   //     const {latitude, longitude} = position.coords;
//   //     setCurrentLocation({latitude, longitude});

//   //     // Update player's coordinates in Firebase
//   //     database().ref(`rooms/${roomId}/players/${userId}`).update({
//   //       lat: latitude,
//   //       lng: longitude,
//   //     });
//   //   },
//   //   error => console.log('Location error:', error),
//   //   {enableHighAccuracy: true, distanceFilter: 5},
//   // );

//   //   return () => Geolocation.clearWatch(watchId);
//   // }, [roomId, userId]);

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: 38.624, // Default location
//           longitude: -90.184,
//           latitudeDelta: 0.01,
//           longitudeDelta: 0.01,
//         }}
//         showsUserLocation={true}>
//         {/* Display all players on the map */}
//         {/* {Object.keys(players).map(playerId => {
//           const player = players[playerId];
//           return (
//             <Marker
//               key={playerId}
//               coordinate={{latitude: player.lat, longitude: player.lng}}
//               title={player.name}
//               pinColor={playerId === userId ? 'blue' : 'red'}
//             />
//           );
//         })} */}
//       </MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1},
//   map: {flex: 1},
// });

// export default GameMap;

// Integration of Google map in React Native using react-native-maps
// https://aboutreact.com/react-native-map-example/
// Import React
import React from 'react';
// Import required components
import {SafeAreaView, StyleSheet, View} from 'react-native';
// Import Map and Marker
import MapView, {Marker} from 'react-native-maps';
const GameMap = () => {
  return (
    // <SafeAreaView style={{flex: 1}}>
    // <View style={styles.container}>
    <MapView
      style={styles.mapStyle}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      customMapStyle={mapStyle}>
      <Marker
        draggable
        coordinate={{
          latitude: 37.78825,
          longitude: -122.4324,
        }}
        onDragEnd={e => alert(JSON.stringify(e.nativeEvent.coordinate))}
        title={'Test Marker'}
        description={'This is a description of the marker'}
      />
    </MapView>
    // </View>
    // </SafeAreaView>
  );
};
export default GameMap;
const mapStyle = [
  {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{color: '#263c3f'}],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{color: '#6b9a76'}],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{color: '#38414e'}],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{color: '#212a37'}],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{color: '#9ca5b3'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{color: '#746855'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{color: '#1f2835'}],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{color: '#f3d19c'}],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{color: '#2f3948'}],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{color: '#17263c'}],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{color: '#515c6d'}],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{color: '#17263c'}],
  },
];
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
