import React, {useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, Alert} from 'react-native';
import {db, auth} from '../firebaseConfig';
import {doc, updateDoc} from 'firebase/firestore';
import useRoom, {assignImposter} from '../firebase/room';

const LobbyScreen = ({route, navigation}) => {
  const {roomId} = route.params;
  const room = useRoom(roomId);
  const currentUser = auth.currentUser;
  useEffect(() => {
    if (room && room.gameStarted) {
      navigation.navigate('GameScreen', {roomId});
    }
  }, [navigation, room, roomId]);
  if (!room) {
    return <Text>Loading room...</Text>;
  }

  const toggleReadyStatus = async () => {
    if (!room) {
      return;
    }

    const updatedPlayers = {...room.players};
    if (updatedPlayers[currentUser.uid]) {
      updatedPlayers[currentUser.uid].ready =
        !updatedPlayers[currentUser.uid].ready;
    }
    // console.log(updatedPlayers);
    await updateDoc(doc(db, 'rooms', roomId), {players: updatedPlayers});
  };

  const startGame = async () => {
    if (!room || room.hostId !== currentUser.uid) {
      return;
    }

    const allReady = Object.values(room.players).every(player => player.ready);
    if (!allReady) {
      Alert.alert('Not everyone is ready!');
      return;
    }
    const updatedPlayers = assignImposter(room.players);
    await updateDoc(doc(db, 'rooms', roomId), {players: updatedPlayers});
    await updateDoc(doc(db, 'rooms', roomId), {gameStarted: true});
    navigation.navigate('LoadingScreen', {
      players: room.players,
      roomId,
      userId: currentUser.uid,
    });
  };

  return (
    <View className="flex-1 bg-gray-900 p-5">
      <Text className="text-white text-xl font-bold mb-4">Room: {roomId}</Text>

      <FlatList
        data={Object.values(room.players)}
        keyExtractor={item => item.uid}
        renderItem={({item}) => (
          <View
            key={item.uid}
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
