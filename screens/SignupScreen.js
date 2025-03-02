import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Image,
} from 'react-native';
import {signUpWithEmail} from '../firebase/account';
import {useNavigation} from '@react-navigation/native';

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      alert('Please fill all fields!');
      return;
    }
    try {
      await signUpWithEmail(name, email, password);
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
      <View className="flex-1 justify-between items-center bg-transparent ">
        {/* <Text className/="text-3xl font-bold text-white mb-6">Sign Up</Text> */}
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
        <View className="flex-1 justify-center items-center bg-transparent">
          <TextInput
            className="bg-gray-900 text-white px-4 py-2 rounded-lg w-80 mb-3"
            placeholder="Full Name"
            placeholderTextColor="#aaa"
            value={name}
            style={{height: 45, borderColor: 'gray', borderWidth: 1}}
            onChangeText={setName}
          />

          <TextInput
            className="bg-gray-900 text-white px-4 py-2 rounded-lg w-80 mb-3"
            placeholder="Email"
            style={{height: 45, borderColor: 'gray', borderWidth: 1}}
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            className="bg-gray-900 text-white px-4 py-2 rounded-lg w-80 mb-3"
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            style={{height: 45, borderColor: 'gray', borderWidth: 1}}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            className="bg-red-500 w-80 py-2 rounded-lg flex justify-center items-center"
            onPress={handleSignUp}
            style={{height: 45}}>
            <Text className="text-center text-white font-semibold">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: -70,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1000,
    paddingTop: 100,
  },
});

export default SignUpScreen;
