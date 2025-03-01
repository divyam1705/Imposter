import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import QRCode from 'react-native-qrcode-svg'; // Import QR code component

const RoomDetailScreen = ({route}) => {
  const {roomId} = route.params;

  return (
    <View className="flex-1 justify-center items-center bg-gray-900 p-6">
      <Text className="text-2xl font-bold text-white mb-6">Room: {roomId}</Text>

      {/* QR Code */}
      <QRCode value={roomId} size={200} />

      <Text className="text-white mt-4">
        Share this QR code to let friends join!
      </Text>
    </View>
  );
};

export default RoomDetailScreen;
