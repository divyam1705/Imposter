import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import QRCode from 'react-native-qrcode-svg'; // Import QR code component

const RoomDetailScreen = ({route}) => {
  const {roomId} = route.params;
  const navigation = useNavigation();
  return (
    <View className="flex-1 justify-center items-center bg-gray-900 p-6">
      <Text className="text-2xl font-bold text-white mb-6">Room: {roomId}</Text>

      {/* QR Code */}
      <QRCode value={roomId} size={200} />

      <Text className="text-white mt-4">
        Share this QR code to let friends join!
      </Text>

      {/* Button to navigate to Lobby */}
      <TouchableOpacity
        className="mt-6 bg-blue-500 p-4 rounded"
        onPress={() => navigation.navigate('LobbyScreen', {roomId})}>
        <Text className="text-white">Go to Lobby</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RoomDetailScreen;
