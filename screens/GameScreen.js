import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import GameMap from './map/GameMap'; // Import the map component
import useRoom from '../firebase/room';
// import {useAuth} from '../firebase/account';
import {getAuth} from 'firebase/auth';
// import {firebase} from '@react-native-firebase/database';

// import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

// import { getAuth } from 'firebase/auth';
// if (!firebase.apps.length) {
// firebase.initializeApp(firebaseConfig);
// }
const GameScreen = ({route, navigation}) => {
  //   const navigation = useNavigation();
  const {roomId} = route.params;
  //   const {user, logout} = useAuth(); // Get user data
  const auth = getAuth();
  const user = auth.currentUser;
  //   const {roomId} = useRoom(); // Get room ID

  // const requestLocationPermission = async () => {
  //   const status = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
  //   if (status === RESULTS.GRANTED) {
  //     console.log('Location permission granted');
  //   } else {
  //     const requestStatus = await request(
  //       PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  //     );
  //     if (requestStatus === RESULTS.GRANTED) {
  //       console.log('Location permission granted after request');
  //     } else {
  //       console.log('Location permission denied');
  //     }
  //   }
  // };

  // useEffect(() => {
  //   requestLocationPermission();
  // }, []);

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header Section */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-gray-800">
        <Text className="text-white text-lg font-bold">Room: {roomId}</Text>
        {/* <TouchableOpacity
          onPress={logout}
          className="bg-red-500 px-3 py-1 rounded-lg">
          <Text className="text-white font-semibold">Leave Game</Text>
        </TouchableOpacity> */}
      </View>

      {/* Game Map */}
      <View className="flex-1">
        <GameMap roomId={roomId} userId={user.uid} />
      </View>
    </View>
  );
};

export default GameScreen;
