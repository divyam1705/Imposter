import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {initNFC, readNFC, writeNFC} from '../utilities/NFCService';
import {getAuth} from 'firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {decode as atob} from 'base-64';

import Video from 'react-native-video';
import {ThemedButton} from 'react-native-really-awesome-button';

const NFCLinkScreen = () => {
  const [userId, setUserId] = useState(null);
  const [nfcData, setNfcData] = useState(null);

  const navigation = useNavigation();
  useEffect(() => {
    initNFC();

    // Get the logged-in user's ID from Firebase
    const auth = getAuth();
    if (auth.currentUser) {
      setUserId(auth.currentUser.uid);
    } else {
      Alert.alert('Error', 'User not logged in.');
    }
  }, []);

  const handleScan = async () => {
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
        setNfcData(decodedData);
      } else {
        Alert.alert('NFC Read Failed', 'No readable data found.');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to read NFC: ${error.message}`);
    }
  };

  const handleWrite = async () => {
    if (!userId) {
      Alert.alert('Error', 'User ID not found.');
      return;
    }

    if (nfcData) {
      Alert.alert(
        'NFC Already Written',
        `This NFC card already contains: ${nfcData}`,
      );
      return;
    }

    await writeNFC(userId);
    Alert.alert('Success', 'User ID written to NFC card.');
    setNfcData(userId);
  };

  return (
    <ImageBackground
      source={require('../assets/background.png')} // Local Image
      style={styles.backgroundImage}>
      <View className="flex-1 items-center justify-between bg-transparent p-6">
        <Text className="text-5xl font-bold text-white mb-4">Link NFC</Text>

        <View className="flex justify-center items-center">
          <TouchableOpacity
            className="bg-blue-500 px-8 py-5 rounded-lg mb-3 w-full items-center"
            onPress={handleScan}>
            <Text className="text-white font-bold text-xl">Confirm NFC</Text>
          </TouchableOpacity>
          {/* <ThemedButton name="some" size="medium" type="pintrest">
        lol
      </ThemedButton> */}
          <TouchableOpacity
            className="bg-green-500 mt-10 px-8 py-5 rounded-lg w-full items-center"
            onPress={handleWrite}>
            <Text className=" text-white font-bold text-xl">Link NFC</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className={`px-8 py-5 rounded-lg w-full items-center mt-3 ${
            nfcData ? 'bg-purple-500' : 'bg-gray-500'
          }`}
          onPress={() => nfcData && navigation.navigate('RoomScreen')}
          disabled={!nfcData}>
          <Text className="text-white text-xl font-bold">Go to Rooms</Text>
        </TouchableOpacity>
        {nfcData && (
          <Text className="text-white mt-4">NFC Data: {nfcData}</Text>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 350,
    height: 150,
    marginBottom: 20,
  },
  model: {
    width: 140,
    height: 200,
    marginBottom: 40,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1000,
    paddingVertical: 50,
  },
});
export default NFCLinkScreen;
