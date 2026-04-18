import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp, getApp, getApps } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  // @ts-ignore - exported but not in types
  getReactNativePersistence,
  browserLocalPersistence,
  type Auth,
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const iosConfig = {
  apiKey: "AIzaSyBHYfW0dQhydfbtvZvfyL9vdsSY15mhyUk",
  authDomain: "codeconnect-riyada.firebaseapp.com",
  projectId: "codeconnect-riyada",
  storageBucket: "codeconnect-riyada.firebasestorage.app",
  messagingSenderId: "488366729005",
  appId: "1:488366729005:ios:9ab9f31b0af40fc61a15a4",
};

const androidConfig = {
  apiKey: "AIzaSyDNSVa-VqORdP9ToD9aH1K0XK3EGCLY7Is",
  authDomain: "codeconnect-riyada.firebaseapp.com",
  projectId: "codeconnect-riyada",
  storageBucket: "codeconnect-riyada.firebasestorage.app",
  messagingSenderId: "488366729005",
  appId: "1:488366729005:android:a346f086a44793de1a15a4",
};

const webConfig = androidConfig;

const config =
  Platform.OS === "ios"
    ? iosConfig
    : Platform.OS === "android"
      ? androidConfig
      : webConfig;

const app = getApps().length ? getApp() : initializeApp(config);

let auth: Auth;
try {
  auth =
    Platform.OS === "web"
      ? getAuth(app)
      : initializeAuth(app, {
          persistence: getReactNativePersistence(AsyncStorage),
        });
} catch {
  auth = getAuth(app);
}

const firestore: Firestore = getFirestore(app);

export const firebase = {
  app,
  auth,
  firestore,
};

export { app, auth, firestore };
