import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import GameMap from './map/GameMap'; // Import the map component
import useRoom, {killPlayer} from '../firebase/room';

import {getAuth} from 'firebase/auth';
import {ThemedButton} from 'react-native-really-awesome-button';
import {readNFC} from '../utilities/NFCService';

const handleScan = async roomId => {
  try {
    const tag = await readNFC();

    if (tag && tag.ndefMessage && tag.ndefMessage.length > 0) {
      const ndefRecord = tag.ndefMessage[0]; // Get the first NDEF record
      const payload = ndefRecord.payload; // Extract payload (byte array)

      // NFC text payload starts with a language code (first byte), so we slice it
      const decodedData = String.fromCharCode(
        ...new Uint8Array(payload).slice(1),
      ).slice(2);

      // Alert.alert('NFC Read Success', `Stored ID: ${decodedData}`);
      // setNfcData(decodedData);
      killPlayer(decodedData, roomId);
    } else {
      Alert.alert('NFC Read Failed', 'No readable data found.');
    }
  } catch (error) {
    Alert.alert('Error', `Failed to read NFC: ${error.message}`);
  }
};
const GameScreen = ({route, navigation}) => {
  //   const navigation = useNavigation();
  const {roomId} = route.params;
  //   const {user, logout} = useAuth(); // Get user data
  const auth = getAuth();
  const user = auth.currentUser;
  const room = useRoom(roomId); // Get room data
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
    <View style={{flex: 1, backgroundColor: '#1a1a1a'}}>
      {/* Header Section */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: '#333',
        }}>
        <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold'}}>
          Room: {roomId}
        </Text>
        {/* <TouchableOpacity
          onPress={logout}
          style={{backgroundColor: '#e74c3c', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8}}>
          <Text style={{color: '#fff', fontWeight: '600'}}>Leave Game</Text>
        </TouchableOpacity> */}
      </View>

      {/* Game Map */}
      <View
        style={{
          height: '56%',
          borderRadius: 16,
          marginHorizontal: 12,
          overflow: 'hidden',
        }}>
        <GameMap roomId={roomId} userId={user.uid} />
      </View>
      {/* Action Buttons */}
      <View
        style={{flexDirection: 'row', justifyContent: 'center', marginTop: 16}}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
            <Text style={{fontSize: 24}}>👁️</Text> Astro Vision
          </Text>
        </TouchableOpacity>
        {/* <ThemedButton name="bruce" type="secondary" style={styles.button}>
          Astro Vision
        </ThemedButton> */}
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 16,
          // marginHorizontal: 12,
        }}>
        <TouchableOpacity
          onPress={() => handleScan(roomId)}
          style={[styles.button, {backgroundColor: '#e74c3c'}]}>
          <Text style={styles.buttonText}>
            <Text style={{fontSize: 24}}>🔪</Text> Kill
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ReportScreen', {
              roomId,
              players: room.players,
              userId: user.uid,
            })
          }
          style={[styles.button, {backgroundColor: '#2ecc71'}]}>
          <Text style={styles.buttonText}>
            <Text style={{fontSize: 24}}>📢</Text> Report
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor: '#3498db'}]}>
          <Text style={styles.buttonText}>
            <Text style={{fontSize: 24}}>❄️</Text> Freeze
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  button: {
    // backgroundColor: '#3498db',
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
};
export default GameScreen;
