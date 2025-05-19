import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAe2XbCOeXJpOlJiNXZJa6a7hCn8cGz3rk",
  authDomain: "tabangi-na-ko-50e44.firebaseapp.com",
  projectId: "tabangi-na-ko-50e44",
  storageBucket: "tabangi-na-ko-50e44.appspot.com",
  messagingSenderId: "689330150636",
  appId: "1:689330150636:web:f372959cf30d6f159819c9"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { auth, db };