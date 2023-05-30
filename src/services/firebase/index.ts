// Import the functions you need from the SDKs you need

import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getMessaging } from "firebase/messaging";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCcDEedsuDYfex0tC5Exrmn4BoZjb7Y18o",
  authDomain: "moby-177a8.firebaseapp.com",
  // databaseURL: "https://moby-177a8-default-rtdb.firebaseio.com",
  projectId: "moby-177a8",
  storageBucket: "moby-177a8.appspot.com",
  messagingSenderId: "730653430853",
  appId: "1:730653430853:web:284f9fcaa9d8685649ff2c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();

export const database = getDatabase(app);

export const ggAnalytics =
  app.name && typeof window !== "undefined" ? getAnalytics(app) : null;

export const messaging =
  app.name && typeof window !== "undefined" ? getMessaging(app) : null;
