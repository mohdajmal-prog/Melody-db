// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCM-WiFkcnAyfwjp0coigFJcEETqgvJnm0",
  authDomain: "melody-6c1e7.firebaseapp.com",
  projectId: "melody-6c1e7",
  storageBucket: "melody-6c1e7.firebasestorage.app",
  messagingSenderId: "685343623662",
  appId: "1:685343623662:web:64a07299ecea69264de6ff",
  measurementId: "G-FYLDLZLH9P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);