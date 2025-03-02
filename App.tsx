/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import './global.css';
import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  Button,
  ImageBackground,
  LogBox,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/loginScreen';
import SignupScreen from './screens/SignupScreen';
import JoinRoomScreen from './screens/JoinRoomScreen';
import RoomScreen from './screens/RoomScreen';
import RoomDetailScreen from './screens/RoomDetailScreen';
import { db, auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import NFCLinkScreen from './screens/NfcLink';
import LobbyScreen from './screens/LobbyScreen';
import GameScreen from './screens/GameScreen';
import LoadingScreen from './screens/RevealScreen';
import ReportScreen from './screens/ReportScreen';
// import { getAuth, signOut } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const Stack = createStackNavigator();


LogBox.ignoreAllLogs(true); //temp


const LogOutButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress} className="px-5 ">
      <Icon name="logout" size={30} color="white" className="font-light text-neutral-500" />
    </TouchableOpacity>
  );
};

function App(): React.JSX.Element {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  /*
   * To keep the template simple and small we're adding padding to prevent view
   * from rendering under the System UI.
   * For bigger apps the reccomendation is to use `react-native-safe-area-context`:
   * https://github.com/AppAndFlow/react-native-safe-area-context
   *
   * You can read more about it here:
   * https://github.com/react-native-community/discussions-and-proposals/discussions/827
   */
  useEffect(() => {
    // const auth = getAuth();
    console.log(auth);
    if (auth.currentUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Successfully signed out
        console.log('Successfully signed out');
        setIsLoggedIn(false);
      })
      .catch((error) => {
        alert('Error logging out');
      });
  };
  const options = {
    headerTitle: '',
    headerShown: true,
    headerStyle: {
      backgroundColor: 'black', // Change background color
    },
    headerRight: () => (
      <LogOutButton onPress={handleLogout} />),
  };

  return (
    <NavigationContainer >

      <Stack.Navigator >
        {isLoggedIn ? (
          <Stack.Screen
            name="Room"
            component={RoomScreen}
            options={{
              headerTitle: '',
              headerShown: true,
              headerStyle: {
                backgroundColor: 'black', // Change background color
              },
              headerRight: () => (
                <LogOutButton onPress={handleLogout} />),
            }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false, // Hide header when on LoginScreen
            }}
          />
        )}
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{
          headerShown: false,

        }} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} options={{
          headerShown: false,
        }} />
        <Stack.Screen name="JoinRoom" component={JoinRoomScreen} options={{
          headerShown: true,
          headerRight: () => (
            <LogOutButton onPress={handleLogout} />),
        }} />
        <Stack.Screen name="RoomScreen" component={RoomScreen}

          options={{
            headerTitle: '',
            headerShown: true,
            headerStyle: {
              backgroundColor: 'black', // Change background color
            },
            headerRight: () => (
              <LogOutButton onPress={handleLogout} />),
          }} />
        <Stack.Screen name="RoomDetailScreen" component={RoomDetailScreen}
          options={{
            headerTitle: '',
            headerShown: true,
            headerStyle: {
              backgroundColor: 'black', // Change background color
            },
            headerRight: () => (
              <LogOutButton onPress={handleLogout} />),
          }}
        />
        <Stack.Screen name="NfcLinkScreen" component={NFCLinkScreen}
          // options={{
          //   headerTransparent: true, // Remove header background
          //   headerTitle: 'Link Your NFC Card', // Change header title
          // headerStyle: {
          //   backgroundColor: 'black', // Change background color
          // },
          //   headerTitleStyle: {
          //     // fontWeight: 'bold', // Change font weight
          //     fontSize: 20, // Font size
          //     color: 'white', // Change text color
          //   },
          // }}
          options={{
            headerShown: true,
            headerTitle: '',
            headerStyle: {
              backgroundColor: 'black', // Change background color
            },
            headerRight: () => (
              <LogOutButton onPress={handleLogout} />
            ),
          }}
        />
        <Stack.Screen name="LobbyScreen" component={LobbyScreen}
          options={options} />
        <Stack.Screen name="LoadingScreen" component={LoadingScreen} options={{
          headerShown: false,
        }} />
        <Stack.Screen name="GameScreen" component={GameScreen} options={options} />
        <Stack.Screen name="ReportScreen" component={ReportScreen} options={{
          headerShown: false,
          // headerRight: () => (
          //   <Button title="Logout" onPress={handleLogout} />
          // ),

        }} />


        {/* <Stack.Screen name="CreateRoom" component={CreateRoomScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1000,
  },
});

export default App;
