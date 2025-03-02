import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';

const LoadingScreen = ({route, navigation}) => {
  const {players, userId, roomId} = route.params;
  const [roleMessage, setRoleMessage] = useState('Determining your role...');
  const [isImposter, setIsImposter] = useState(false);
  //   const navigation = useNavigation();
  useEffect(() => {
    if (players && userId) {
      const userIsImposter = players[userId].imposter;
      console.log('Imposter Status', userIsImposter, players, userId);
      setIsImposter(userIsImposter);
      setRoleMessage(
        userIsImposter ? 'You are the Imposter!' : 'You are a Crewmate!',
      );

      // Transition to the game after a short delay
      setTimeout(() => {
        navigation.navigate('GameScreen', {roomId});
      }, 3000); // Delay for 2 seconds to show the message
    }
  }, [navigation, players, roomId, userId]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.message}>{roleMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  message: {
    fontSize: 20,
    color: '#fff',
    marginTop: 20,
  },
});

export default LoadingScreen;
