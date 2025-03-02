import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {login} from '../firebase/login';
import {Image} from 'react-native';

// import {signInWithGoogle} from '../firebase/googlesign';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill all fields!');
      return;
    }
    try {
      await login(email, password);
      // Display success message
      console.log('Account created successfully!');
      navigation.navigate('NfcLinkScreen');
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <ImageBackground
      source={require('../assets/background.png')} // Local Image
      style={styles.backgroundImage}>
      <View className="flex-1 justify-center items-center bg-transparent">
        <Image
          className="bg-black "
          source={require('../assets/logo.png')}
          style={styles.logo}
        />
        <Image
          className="bg-black "
          source={require('../assets/model.png')}
          style={styles.model}
        />
        {/* <Text className=" text-xl font-bold text-white mb-6">Login</Text> */}

        <TextInput
          className="w-80 bg-gray-900 text-white px-4 py-2 rounded-lg mb-3"
          placeholder="Email"
          placeholderTextColor="gray"
          value={email}
          style={{height: 45, borderColor: 'gray', borderWidth: 1}}
          onChangeText={setEmail}
        />

        <TextInput
          className="w-80 bg-gray-900 text-white px-4 py-2 rounded-lg mb-3"
          placeholder="Password"
          placeholderTextColor="gray"
          secureTextEntry
          value={password}
          style={{height: 45, borderColor: 'gray', borderWidth: 1}}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={{height: 45}}
          className="bg-red-500 w-80 py-2 rounded-lg flex justify-center items-center"
          onPress={() => handleLogin()}>
          <Text className="text-center text-white font-bold">Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4 "
          onPress={() => navigation.navigate('SignupScreen')}>
          <Text className="text-white !text-xs">
            Don't have an account? Sign up
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
        className="mt-4 bg-red-500 w-80 py-2 rounded-lg"
        onPress={signInWithGoogle}>
        <Text className="text-center text-white font-semibold">
          Sign in with Google
        </Text>
      </TouchableOpacity> */}
      </View>
    </ImageBackground>
  );
};

import {StyleSheet} from 'react-native';

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
  },
});

export default LoginScreen;
