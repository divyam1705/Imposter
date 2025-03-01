import {initializeApp} from 'firebase/app';
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCTQExTmmeCIaGJFJi0NK75GLsYhDw3Hj0',
  authDomain: 'imposter-4e369.firebaseapp.com',
  projectId: 'imposter-4e369',
  storageBucket: 'imposter-4e369.firebasestorage.app',
  messagingSenderId: '945963858684',
  appId: '1:945963858684:web:f1959b89593d91dc1a3579',
  measurementId: 'G-JBKV1JF4QQ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
export {auth, db, googleProvider};
