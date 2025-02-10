// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5yNievtc7Z92sFbD9aZigySf4Hvl3fjk",
  authDomain: "timcsab-6af9f.firebaseapp.com",
  projectId: "timcsab-6af9f",
  storageBucket: "timcsab-6af9f.firebasestorage.app",
  messagingSenderId: "599800408602",
  appId: "1:599800408602:web:eb7671d5bc1409903bffa3",
  measurementId: "G-QLSXPZX2TX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default firebaseConfig;
