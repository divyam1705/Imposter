import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {createRoom} from '../firebase/room';
import {useNavigation} from '@react-navigation/native';

const RoomScreen = () => {
  const navigation = useNavigation();

  const handleCreateRoom = async () => {
    try {
      const roomId = await createRoom();
      if (roomId) {
        alert(`Room Created: ${roomId}`);
        // Navigate to room screen (to be implemented later)
        navigation.navigate('RoomDetailScreen', {roomId});
      }
    } catch (error) {
      alert('Failed to create room');
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-900 p-6">
      <Text className="text-2xl font-bold text-white mb-6">
        Create or Join a Room
      </Text>

      <TouchableOpacity
        className="bg-green-500 w-80 py-2 rounded-lg mb-4"
        onPress={handleCreateRoom}>
        <Text className="text-center text-white font-semibold">
          Create Room
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-green-500 w-80 py-2 rounded-lg mb-4"
        onPress={() => navigation.navigate('JoinRoom')}>
        <Text className="text-center text-white font-semibold">Join Room</Text>
      </TouchableOpacity>
      {/* "Join Room" button will be implemented next */}
    </View>
  );
};

export default RoomScreen;
