import React from 'react';
import {View, Text, FlatList, TouchableOpacity, Alert} from 'react-native';
import {db, auth} from '../firebaseConfig';
import {doc, updateDoc} from 'firebase/firestore';
import useRoom from '../firebase/room';

const LobbyScreen = ({route, navigation}) => {
  const {roomId} = route.params;
  const room = useRoom(roomId);
  const currentUser = auth.currentUser;

  if (!room) {
    return <Text>Loading room...</Text>;
  }

  const toggleReadyStatus = async () => {
    if (!room) {
      return;
    }

    const updatedPlayers = room.players.map(player => {
      //   console.log(player);
      if (player.userId === currentUser.uid) {
        // console.log(player.ready, !player.ready);
        return {...player, ready: !player.ready};
      }
      return player;
    });
    // console.log(updatedPlayers);
    await updateDoc(doc(db, 'rooms', roomId), {players: updatedPlayers});
  };

  const startGame = async () => {
    if (!room || room.hostId !== currentUser.uid) {
      return;
    }

    const allReady = room.players.every(player => player.ready);
    if (!allReady) {
      Alert.alert('Not everyone is ready!');
      return;
    }

    await updateDoc(doc(db, 'rooms', roomId), {gameStarted: true});
    navigation.navigate('GameScreen', {roomId});
  };

  return (
    <View className="flex-1 bg-gray-900 p-5">
      <Text className="text-white text-xl font-bold mb-4">Room: {roomId}</Text>

      <FlatList
        data={room.players}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View
            key={item.id}
            className="flex-row justify-between bg-gray-800 p-4 rounded-lg mb-2">
            <Text className="text-white">{item.name}</Text>
            <Text className={`text-${item.ready ? 'green' : 'red'}-500`}>
              {item.ready ? 'Ready' : 'Not Ready'}
            </Text>
          </View>
        )}
      />

      <TouchableOpacity
        className="bg-blue-500 p-3 rounded-lg mt-4"
        onPress={toggleReadyStatus}>
        <Text className="text-white text-center">Toggle Ready</Text>
      </TouchableOpacity>

      {room.hostId === currentUser.uid && (
        <TouchableOpacity
          className="bg-green-500 p-3 rounded-lg mt-4"
          onPress={startGame}>
          <Text className="text-white text-center">Start Game</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default LobbyScreen;
