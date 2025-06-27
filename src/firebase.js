import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3kCBitznjdRs6HLFwStjtbnpt-ib0jbA",
  authDomain: "saraportfolio-2463.firebaseapp.com",
  projectId: "saraportfolio-2463",
  storageBucket: "saraportfolio-2463.firebasestorage.app",
  messagingSenderId: "795323024677",
  appId: "1:795323024677:web:6f5768bf78e6455017c6cc",
  measurementId: "G-R19WNXCTMF",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const dbFirebase = getFirestore(app);
