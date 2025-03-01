import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
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
      navigation.navigate('RoomScreen');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-900 p-6">
      <Text className="text-3xl font-bold text-white mb-6">Sign Up</Text>

      <TextInput
        className="bg-gray-800 text-white px-4 py-2 rounded-lg w-80 mb-3"
        placeholder="Full Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        className="bg-gray-800 text-white px-4 py-2 rounded-lg w-80 mb-3"
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="bg-gray-800 text-white px-4 py-2 rounded-lg w-80 mb-3"
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        className="bg-blue-500 w-80 py-2 rounded-lg"
        onPress={handleSignUp}>
        <Text className="text-center text-white font-semibold">Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;
