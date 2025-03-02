import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg'; // Import QR code component

const RoomDetailScreen = ({route}) => {
  const {roomId} = route.params;
  const navigation = useNavigation();
  return (
    <ImageBackground
      source={require('../assets/background.png')} // Local Image
      style={styles.backgroundImage}>
      <View className="flex-1 justify-between items-center bg-transparent p-6">
        <TouchableOpacity className="bg-blue-500 flex justify-center items-center px-8 py-5 rounded-lg">
          <Text className="text-2xl font-bold text-white ">{roomId}</Text>
        </TouchableOpacity>

        {/* QR Code */}
        <QRCode value={roomId} size={200} />

        <Text className="text-white mt-4">
          Share this QR code to let friends join!
        </Text>

        {/* Button to navigate to Lobby */}
        <TouchableOpacity
          className="mt-6 bg-blue-500 px-8 py-5 rounded-lg"
          onPress={() => navigation.navigate('LobbyScreen', {roomId})}>
          <Text className="text-white text-2xl font-bold">Go to Lobby</Text>
        </TouchableOpacity>
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
    paddingVertical: 70,
  },
});

export default RoomDetailScreen;
