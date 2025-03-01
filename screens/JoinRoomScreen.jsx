import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner'; // QR Code Scanner
import {joinRoom} from '../firebase/room'; // Import the join room function
import {useNavigation} from '@react-navigation/native';

const JoinRoomScreen = () => {
  const [roomId, setRoomId] = useState('');
  const [scanning, setScanning] = useState(false);
  const navigation = useNavigation();

  const handleJoinRoom = async () => {
    if (!roomId) {
      alert('Please enter a room ID');
      return;
    }

    try {
      const joinedRoom = await joinRoom(roomId);
      if (joinedRoom) {
        alert(`Joined Room: ${roomId}`);
        navigation.navigate('LobbyScreen', {roomId});
        // Navigate to room details or gameplay screen
        // navigation.navigate("RoomDetail", { roomId });
      }
    } catch (error) {
      alert('Failed to join the room');
    }
  };

  const handleScan = e => {
    setRoomId(e.data); // Get room ID from the scanned QR code
    setScanning(false); // Stop scanning after a successful scan
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-900 p-6">
      {!scanning ? (
        <>
          <Text className="text-2xl font-bold text-white mb-6">
            Join a Room
          </Text>

          <TextInput
            className="bg-gray-800 text-white px-4 py-2 rounded-lg w-80 mb-3"
            placeholder="Enter Room ID"
            placeholderTextColor="#aaa"
            value={roomId}
            onChangeText={setRoomId}
          />

          <TouchableOpacity
            className="bg-blue-500 w-80 py-2 rounded-lg mb-4"
            onPress={handleJoinRoom}>
            <Text className="text-center text-white font-semibold">
              Join Room
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            className="bg-green-500 w-80 py-2 rounded-lg"
            onPress={() => setScanning(true)} // Start scanning QR code
          >
            <Text className="text-center text-white font-semibold">
              Scan QR Code
            </Text>
          </TouchableOpacity> */}
        </>
      ) : (
        // QR Code Scanner UI
        {
          /* <QRCodeScanner
          onRead={handleScan}
          topContent={
            <Text className="text-white text-center">
              Scan QR Code to Join Room
            </Text>
          }
          bottomContent={
            <TouchableOpacity
              className="bg-blue-500 py-2 px-6 mt-4 rounded-lg"
              onPress={() => setScanning(false)}>
              <Text className="text-white text-center">Cancel</Text>
            </TouchableOpacity>
          }
        /> */
        }
      )}
    </View>
  );
};

export default JoinRoomScreen;
