import {getFirestore, collection, doc, setDoc} from 'firebase/firestore';
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
    players: [{userId: user.uid, name: userName}],
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
    const playerExists = roomData.players.some(
      player => player.userId === user.uid,
    );
    if (playerExists) {
      alert('You are already in the room!');
      return;
    }

    // Add the user to the players list
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    console.log(userSnap);
    const userName = userSnap.exists() ? userSnap.data().name : 'lol';

    await updateDoc(roomRef, {
      players: arrayUnion({
        userId: user.uid,
        name: userName,
      }),
    });

    console.log(`Joined Room: ${roomId}`);
    return roomId; // Return the room ID
  } catch (error) {
    console.error('Error joining room:', error);
    throw error;
  }
};
