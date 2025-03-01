import {createUserWithEmailAndPassword} from 'firebase/auth';
import {doc, setDoc} from 'firebase/firestore';
import {auth, db} from '../firebaseConfig';

// Function to generate an 8-digit random ID
const generateUserId = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

// Sign Up Function
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Generate unique user ID
    const userId = generateUserId();

    // Store user in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      userId: userId,
    });

    console.log('User signed up:', user.email, 'with ID:', userId);
  } catch (error) {
    console.error('Sign Up Error:', error.message);
  }
};

export const signUpWithEmail = async (name, email, password) => {
  try {
    // Create user with email & password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = userCredential.user;

    // Generate an 8-digit ID
    const userId = generateUserId();

    // Store user data in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      name: name,
      displayName: name,
      email: email,
      userId: userId, // Store the random 8-digit ID
    });
    console.log('User registered & stored in Firestore:', name);
    return user;
  } catch (error) {
    console.error('Error signing up:', error.message);
    throw error;
  }
};
