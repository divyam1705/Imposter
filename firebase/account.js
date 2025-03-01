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
