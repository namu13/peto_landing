import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAiBxoXeT8WtHdk7XhvhOiuPtCL9_hO9u4",
  authDomain: "peto-79c18.firebaseapp.com",
  projectId: "peto-79c18",
  storageBucket: "peto-79c18.appspot.com",
  messagingSenderId: "1007286734026",
  appId: "1:1007286734026:web:fa74c47bec4793f375b833",
  measurementId: "G-NFBD6VTK3C",
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
