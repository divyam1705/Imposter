import {
  getFirestore,
  collection,
  doc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';
import {app} from '../firebaseConfig';
import {getAuth} from 'firebase/auth';

const db = getFirestore(app);
const auth = getAuth(app);

// Function to generate a random 6-character Room ID
const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const createRoom = async () => {
  const user = auth.currentUser;
  if (!user) {
    alert('You must be logged in to create a room!');
    return;
  }

  const roomId = generateRoomId();
  const roomRef = doc(collection(db, 'rooms'), roomId);
  console.log(user);
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  console.log(userSnap);
  const userName = userSnap.exists() ? userSnap.data().name : 'lol';

  const roomData = {
    roomId,
    hostId: user.uid,
    players: {
      [user.uid]: {
        name: userName,
        ready: false,
        userId: user.uid,
        lat: 0,
        lng: 0,
        imposter: false,
      },
    },
    status: 'waiting',
  };

  try {
    await setDoc(roomRef, roomData);
    console.log('Room created:', roomData);
    return roomId; // Return the room ID so we can navigate to it
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

import {updateDoc, arrayUnion, getDoc} from 'firebase/firestore';
import {useEffect, useState} from 'react';

// Function to join a room
export const joinRoom = async roomId => {
  const user = auth.currentUser;
  if (!user) {
    alert('You must be logged in to join a room!');
    return;
  }

  const roomRef = doc(db, 'rooms', roomId);
  try {
    // Get room data to check if it exists
    const roomSnap = await getDoc(roomRef);
    if (!roomSnap.exists()) {
      alert('Room does not exist!');
      return;
    }

    // Check if user is already in the room
    const roomData = roomSnap.data();
    const playerExists = roomData.players.hasOwnProperty(user.uid);
    if (playerExists) {
      alert('You are already in the room!');
      return roomId;
    }

    // Add the user to the players list
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    console.log(userSnap);
    const userName = userSnap.exists() ? userSnap.data().name : 'No Name';

    await setDoc(
      roomRef,
      {
        players: {
          [user.uid]: {
            userId: user.uid,
            name: userName,
            ready: false,
            lat: 0,
            lng: 0,
            imposter: false,
          },
        },
      },
      {merge: true},
    );

    console.log(`Joined Room: ${roomId}`);
    return roomId; // Return the room ID
  } catch (error) {
    console.error('Error joining room:', error);
    throw error;
  }
};

const useRoom = roomId => {
  const [room, setRoom] = useState(null);

  useEffect(() => {
    if (!roomId) {
      return;
    }

    const roomRef = doc(db, 'rooms', roomId);

    const unsubscribe = onSnapshot(roomRef, docSnap => {
      if (docSnap.exists()) {
        setRoom({id: docSnap.id, ...docSnap.data()});
      }
    });

    return () => unsubscribe();
  }, [roomId]);

  return room;
};

export const assignImposter = players => {
  const playersArray = Object.keys(players); // Convert players to an array of player IDs
  const randomPlayerId =
    playersArray[Math.floor(Math.random() * playersArray.length)]; // Select a random player

  // Mark the selected player as imposter
  const updatedPlayers = {...players}; // Create a copy of the players object
  updatedPlayers[randomPlayerId] = {
    ...updatedPlayers[randomPlayerId],
    imposter: true, // Add imposter property
  };

  return updatedPlayers; // Return updated players
};

export default useRoom;
