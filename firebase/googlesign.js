import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {getAuth, signInWithCredential, GoogleAuthProvider} from 'firebase/auth';
import {getFirestore, doc, setDoc, getDoc} from 'firebase/firestore';

// Initialize Firestore
const db = getFirestore();

// Function to generate a random 8-digit ID
const generateUserId = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);
    const auth = getAuth();
    const userCredential = await signInWithCredential(auth, googleCredential);
    const user = userCredential.user;

    // Check if user already exists in Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Assign a random 8-digit ID
      const userId = generateUserId();

      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        userId: userId,
      });

      console.log('User added to Firestore:', user.displayName);
    } else {
      console.log('User already exists in Firestore');
    }
  } catch (error) {
    console.error('Google Sign-In Error:', error.message);
  }
};
