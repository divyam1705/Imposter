import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, ImageBackground} from 'react-native';
import {createRoom} from '../firebase/room';
import {useNavigation} from '@react-navigation/native';
import {auth} from '../firebaseConfig';
import {StyleSheet} from 'react-native';
import {Image} from 'react-native';

const RoomScreen = () => {
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigation.navigate('LoginScreen');
      }
    });
    return unsubscribe;
  }, [navigation]);
  const handleCreateRoom = async () => {
    try {
      const roomId = await createRoom();
      if (roomId) {
        // alert(`Room Created: ${roomId}`);
        // Navigate to room screen (to be implemented later)
        navigation.navigate('RoomDetailScreen', {roomId});
      }
    } catch (error) {
      alert('Failed to create room');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background.png')} // Local Image
      style={styles.backgroundImage}>
      <View className="flex-1 justify-between items-center bg-transparent p-6">
        <Image
          className="h-20 w-20 "
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
        <Image
          className=""
          source={require('../assets/model.png')}
          style={styles.model}
        />
        <View>
          <TouchableOpacity
            className="bg-red-500 w-80 py-5 rounded-lg mb-4"
            onPress={handleCreateRoom}>
            <Text className="text-center text-2xl text-white font-bold">
              Create Room
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-500 w-80 py-5 rounded-lg mb-4 mt-5"
            onPress={() => navigation.navigate('JoinRoom')}>
            <Text className="text-center text-white font-bold text-2xl">
              Join Room
            </Text>
          </TouchableOpacity>
        </View>
        {/* "Join Room" button will be implemented next */}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 350,
    height: 150,
    marginBottom: 40,
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
    paddingBottom: 50,
  },
});
export default RoomScreen;
