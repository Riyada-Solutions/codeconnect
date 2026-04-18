import { Platform } from "react-native";
import Constants from "expo-constants";

export const isFirebaseAvailable =
  Platform.OS !== "web" && Constants.appOwnership !== "expo";

let firebaseApp: any = null;
let firebaseAuth: any = null;
let firebaseFirestore: any = null;
let firebaseMessaging: any = null;

if (isFirebaseAvailable) {
  try {
    firebaseApp = require("@react-native-firebase/app").default;
    firebaseAuth = require("@react-native-firebase/auth").default;
    firebaseFirestore = require("@react-native-firebase/firestore").default;
    firebaseMessaging = require("@react-native-firebase/messaging").default;
  } catch (err) {
    console.warn(
      "Firebase native modules are unavailable. Build a development client (EAS build) to enable them.",
      err,
    );
  }
}

export const firebase = {
  app: firebaseApp,
  auth: firebaseAuth,
  firestore: firebaseFirestore,
  messaging: firebaseMessaging,
};

export function getFirebaseApp() {
  if (!firebaseApp) {
    throw new Error(
      "Firebase is only available in native EAS builds (not Expo Go or web).",
    );
  }
  return firebaseApp();
}
