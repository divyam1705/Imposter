import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../firebaseConfig';

// Login Function
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log('User logged in:', userCredential.user.email);
  } catch (error) {
    console.error('Login Error:', error.message);
  }
};
