// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth}  from "firebase/auth";
import {getFirestore}from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBRpKUeocrGj8Re8sVZvRsOQuhRozphpDI",
  authDomain: "webloja-83ef4.firebaseapp.com",
  projectId: "webloja-83ef4",
  storageBucket: "webloja-83ef4.appspot.com",
  messagingSenderId: "390584579434",
  appId: "1:390584579434:web:7d373b99c38d8c9443a113"
};


const app = initializeApp(firebaseConfig);

const db  =  getFirestore(app);
const auth = getAuth(app);
const storage =  getStorage(app);

export {db,auth,storage}