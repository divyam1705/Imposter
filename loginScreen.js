import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {login} from './firebase/login';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View className="flex-1 justify-center items-center bg-gray-900">
      <Text className="text-3xl font-bold text-white mb-6">Login</Text>

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
        className="bg-blue-500 w-80 py-2 rounded-lg"
        onPress={() => login(email, password)}>
        <Text className="text-center text-white font-semibold">Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-4"
        onPress={() => navigation.navigate('Signup')}>
        <Text className="text-blue-400">Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
