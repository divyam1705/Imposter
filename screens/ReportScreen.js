import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, Button, FlatList, StyleSheet, Image} from 'react-native';
import RtcEngine from 'react-native-agora';
import {db} from '../firebaseConfig';
import {doc, updateDoc, getDoc} from 'firebase/firestore';
import AgoraApp from './voice/agora';
import Icon from 'react-native-vector-icons/AntDesign';

// Agora credentials
const APP_ID = 'bf757e929d184a1eb6241a993d14bf94';
const CHANNEL_NAME = 'game_room';
const token =
  '007eJxTYJgxU2jjjJ6omPgbFp1d339K/xU+l3GgJH3e1KX/b86bvC1CgSEpzdzUPNXSyDLF0MIk0TA1yczIxDDR0tI4xdAkKc3SpEv8SHpDICPD803ZLIwMEAjiczKkJ+amxhfl5+cyMAAAyBwkRg==';

const ReportScreen = ({route, navigation}) => {
  const {roomId, userId, players} = route.params;
  const [engine, setEngine] = useState(null);
  const [joined, setJoined] = useState(false);
  const [muted, setMuted] = useState(false);
  const [selectedVote, setSelectedVote] = useState(null);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      handleVotingResults();
    }, 30000);

    return () => {
      clearTimeout(timer);
    };
  }, [engine, handleVotingResults, navigation]);

  const handleVotingResults = useCallback(async () => {
    const roomSnap = await getDoc(doc(db, 'rooms', roomId));
    const votes = roomSnap.data().votes || {};

    // Count votes
    const voteCounts = {};
    Object.values(votes).forEach(vote => {
      voteCounts[vote] = (voteCounts[vote] || 0) + 1;
    });

    // Find the player with the most votes
    const eliminatedPlayer = Object.keys(voteCounts).reduce((a, b) =>
      voteCounts[a] > voteCounts[b] ? a : b,
    );

    // Update Firestore to eliminate the player
    await updateDoc(doc(db, 'rooms', roomId), {
      [`players.${eliminatedPlayer}.alive`]: false,
    });

    console.log(`Eliminated: ${eliminatedPlayer}`);
    navigation.replace('GameScreen', {roomId});
  }, [roomId, navigation]);

  const castVote = async voteFor => {
    if (voted) {
      return;
    }

    setSelectedVote(voteFor);
    setVoted(true);

    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, {
      [`votes.${userId}`]: voteFor,
    });

    console.log(`User ${userId} voted for ${voteFor}`);
  };
  const colors = ['pink', 'red', 'blue', 'gray', 'purple'];

  return (
    <View className="!bg-black" style={{flex: 1, padding: 40}}>
      <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>
        Discussion Time! (30s)
      </Text>
      <AgoraApp />

      {/* Voice Controls */}
      {/* {joined && (
        <Button
          title={muted ? 'Unmute' : 'Mute'}
          onPress={() => {
            setMuted(!muted);
            engine?.muteLocalAudioStream(!muted);
          }}
        />
      )} */}

      {/* Voting List */}
      <FlatList
        data={Object.keys(players)}
        keyExtractor={item => item}
        renderItem={({item, index}) => (
          <View
            key={item.uid}
            title={''}
            onPress={() => castVote(item)}
            disabled={voted}
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
            <Text className="text-white font-bold text-2xl">
              Vote for {players[item].name}
            </Text>
            <Icon name={'closecircleo'} size={30} color={'red'} />
          </View>
        )}
      />

      {selectedVote && <Text>You voted for: {players[selectedVote].name}</Text>}
    </View>
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
export default ReportScreen;
