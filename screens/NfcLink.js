import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import {initNFC, readNFC, writeNFC} from '../utilities/NFCService';
import {getAuth} from 'firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {decode as atob} from 'base-64';

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
        );

        Alert.alert('NFC Read Success', `Stored ID: ${decodedData}`);
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
    <View className="flex-1 items-center justify-center bg-gray-900 p-6">
      <Text className="text-xl font-bold text-white mb-4">NFC Example</Text>

      <TouchableOpacity
        className="bg-blue-500 px-6 py-3 rounded-lg mb-3 w-full items-center"
        onPress={handleScan}>
        <Text className="text-white font-semibold">Scan NFC</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        className="bg-green-500 px-6 py-3 rounded-lg w-full items-center"
        onPress={handleWrite}>
        <Text className="text-white font-semibold">Write ID to NFC</Text>
      </TouchableOpacity> */}
      <TouchableOpacity
        className={`px-6 py-3 rounded-lg w-full items-center mt-3 ${
          nfcData ? 'bg-purple-500' : 'bg-gray-500'
        }`}
        onPress={() => nfcData && navigation.navigate('RoomScreen')}
        disabled={!nfcData}>
        <Text className="text-white font-semibold">Rooms</Text>
      </TouchableOpacity>
      {nfcData && <Text className="text-white mt-4">NFC Data: {nfcData}</Text>}
    </View>
  );
};

export default NFCLinkScreen;
