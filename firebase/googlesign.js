import {GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import {auth, db} from '../firebaseConfig';
import {doc, setDoc, getDoc} from 'firebase/firestore';

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user already exists in Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      // Generate and save new User ID
      const userId = Math.floor(10000000 + Math.random() * 90000000).toString();
      await setDoc(userRef, {email: user.email, userId});
    }

    console.log('Google Sign-In:', user.email);
  } catch (error) {
    console.error('Google Sign-In Error:', error.message);
  }
};
