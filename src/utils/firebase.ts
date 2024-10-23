// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth/web-extension";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAL-z1iJ7CeM5sp5xi_B21KT2xiF9t9RKE",
  authDomain: "vocab-3e9bb.firebaseapp.com",
  databaseURL:
    "https://vocab-3e9bb-default-rtdb.asia-southeast1.firebasedatabase.app/", // Ensure this is correct
  projectId: "vocab-3e9bb",
  storageBucket: "vocab-3e9bb.appspot.com",
  messagingSenderId: "734427647519",
  appId: "1:734427647519:web:367fd51779381e70908f2a",
  measurementId: "G-MC96KGHHFM",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
// export const firebaseAnalytics = getAnalytics(firebaseApp);
export const auth = getAuth();
// auth.onAuthStateChanged((user) => {
//   if (user) {
//     console.log("User is signed in:", user);
//     // You can now access the user's ID token
//     user.getIdToken(true).then((idToken) => {
//       console.log("ID Token:", idToken);
//     });
//   } else {
//     console.log("No user is signed in.");
//   }
// });
// auth.currentUser?.uid
// Initialize Firebase Storage
export const firebaseDatabase = getDatabase(firebaseApp);
