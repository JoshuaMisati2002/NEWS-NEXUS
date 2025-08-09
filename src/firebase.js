   import { initializeApp } from "firebase/app";
    import { getAuth } from "firebase/auth";
    import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAmXoeo0vjMPD7lJgcZzsvNyByiCXaz7bA",
  authDomain: "news-nexus-dcea2.firebaseapp.com",
  projectId: "news-nexus-dcea2",
  storageBucket: "news-nexus-dcea2.firebasestorage.app",
  messagingSenderId: "336348104252",
  appId: "1:336348104252:web:d929f177366737e3916539"
};

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    export { app, auth, db };