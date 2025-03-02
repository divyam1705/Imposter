import React, {useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ImageBackground,
  Image,
} from 'react-native';
import {db, auth} from '../firebaseConfig';
import {doc, updateDoc} from 'firebase/firestore';
import useRoom, {assignImposter} from '../firebase/room';
import Icon from 'react-native-vector-icons/AntDesign';

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
      players: updatedPlayers,
      roomId,
      userId: currentUser.uid,
    });
  };
  const colors = ['pink', 'red', 'blue', 'gray', 'purple'];
  return (
    <ImageBackground
      source={require('../assets/background.png')} // Local Image
      style={styles.backgroundImage}>
      <View className="flex-1 bg-transparent p-5 justify-between items-center">
        <TouchableOpacity className="bg-blue-500 flex justify-center items-center px-8 py-5 rounded-xl mb-20">
          <Text className="text-2xl font-bold text-white ">{roomId}</Text>
        </TouchableOpacity>

        <FlatList
          data={Object.values(room.players)}
          keyExtractor={item => item.uid}
          renderItem={({item, index}) => (
            <View
              key={item.uid}
              style={[
                styles.playerContainer,
                {backgroundColor: colors[index % colors.length]},
              ]}>
              <Image
                source={
                  colors[index % colors.length] === 'pink'
                    ? require('../assets/icons/pink.png')
                    : colors[index % colors.length] === 'red'
                    ? require('../assets/icons/red.png')
                    : colors[index % colors.length] === 'blue'
                    ? require('../assets/icons/blue.png')
                    : colors[index % colors.length] === 'gray'
                    ? require('../assets/icons/gray.png')
                    : require('../assets/icons/purple.png')
                }
                className="w-10 h-10"
              />
              <Text className="text-white font-bold text-2xl">{item.name}</Text>
              <Icon
                name={item.ready ? 'checkcircleo' : 'closecircleo'}
                size={30}
                color={item.ready ? 'green' : 'red'}
              />
            </View>
          )}
        />

        <TouchableOpacity
          className="bg-blue-500 rounded-lg mt-4 py-3 w-60 mb-6"
          onPress={toggleReadyStatus}>
          <Text className="text-white text-center font-bold text-xl">
            Ready Toggle
          </Text>
        </TouchableOpacity>

        {room.hostId === currentUser.uid && (
          <TouchableOpacity
            className="bg-green-500 p-3 rounded-lg mt-4 py-5 w-60 flex-row justify-center items-center gap-5 "
            onPress={startGame}
            style={{paddingRight: 20}}>
            <Icon
              name="play"
              size={40}
              className="bg-green-900 "
              style={{marginRight: 15}}
            />
            <Text className="text-white text-center font-bold text-2xl ">
              Start
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  playerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 15,
    marginBottom: 8,
    width: 320,
    height: 80,
  },
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
    paddingBottom: 70,
  },
  // icon: {
  //   width: 5,
  //   height: 5,
  // },
});
export default LobbyScreen;
