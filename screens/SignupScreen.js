import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {signUp} from '../firebase/account';

const SignupScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="flex-1 justify-center items-center bg-gray-900">
      <Text className="text-3xl font-bold text-white mb-6">Sign Up</Text>

      <TextInput
        className="w-80 bg-gray-800 text-white px-4 py-2 rounded-lg mb-3"
        placeholder="Email"
        placeholderTextColor="gray"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="w-80 bg-gray-800 text-white px-4 py-2 rounded-lg mb-3"
        placeholder="Password"
        placeholderTextColor="gray"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        className="bg-green-500 w-80 py-2 rounded-lg"
        onPress={() => signUp(email, password)}>
        <Text className="text-center text-white font-semibold">Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-4"
        onPress={() => navigation.navigate('LoginScreen')}>
        <Text className="text-blue-400">Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;
