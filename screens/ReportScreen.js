import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, Button, FlatList} from 'react-native';
import RtcEngine from 'react-native-agora';
import {db} from '../firebaseConfig';
import {doc, updateDoc, getDoc} from 'firebase/firestore';
import AgoraApp from './voice/agora';

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
    const initAgora = async () => {
      console.log('in');
      const rtcEngine = await RtcEngine.create(APP_ID);
      console.log('hEEE1');
      await rtcEngine.enableAudio();
      console.log('HERENOW');
      await rtcEngine.joinChannel(token, CHANNEL_NAME, null, 0);

      setEngine(rtcEngine);
      setJoined(true);
    };

    initAgora();

    const timer = setTimeout(async () => {
      await engine?.leaveChannel(); // Leave voice chat
      handleVotingResults();
    }, 30000);

    return () => {
      clearTimeout(timer);
      engine?.destroy();
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
    navigation.replace('GameScreen');
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

  //   const handleVotingResults = async () => {
  //     const roomSnap = await getDoc(doc(db, 'rooms', roomId));
  //     const votes = roomSnap.data().votes || {};

  //     // Count votes
  //     const voteCounts = {};
  //     Object.values(votes).forEach(vote => {
  //       voteCounts[vote] = (voteCounts[vote] || 0) + 1;
  //     });

  //     // Find the player with the most votes
  //     const eliminatedPlayer = Object.keys(voteCounts).reduce((a, b) =>
  //       voteCounts[a] > voteCounts[b] ? a : b,
  //     );

  //     // Update Firestore to eliminate the player
  //     await updateDoc(doc(db, 'rooms', roomId), {
  //       [`players.${eliminatedPlayer}.alive`]: false,
  //     });

  //     console.log(`Eliminated: ${eliminatedPlayer}`);
  //     navigation.replace('GameScreen');
  //   };

  return (
    <View style={{flex: 1, padding: 20}}>
      <AgoraApp />
      <Text style={{fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>
        Discussion Time! (45s)
      </Text>

      {/* Voice Controls */}
      {joined && (
        <Button
          title={muted ? 'Unmute' : 'Mute'}
          onPress={() => {
            setMuted(!muted);
            engine?.muteLocalAudioStream(!muted);
          }}
        />
      )}

      {/* Voting List */}
      <FlatList
        data={Object.keys(players)}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <Button
            title={`Vote for ${players[item].name}`}
            onPress={() => castVote(item)}
            disabled={voted}
          />
        )}
      />

      {selectedVote && <Text>You voted for: {players[selectedVote].name}</Text>}
    </View>
  );
};

export default ReportScreen;
