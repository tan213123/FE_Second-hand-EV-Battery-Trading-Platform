import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAK5rk9JvDXC24Vt_RHw3Rla7PvfV3GGdk",
    authDomain: "fir-sw-8f36f.firebaseapp.com",
    projectId: "fir-sw-8f36f",
    storageBucket: "fir-sw-8f36f.firebasestorage.app",
    messagingSenderId: "205351415305",
    appId: "1:205351415305:web:f62c12ed912c0c94e752d8",
    measurementId: "G-FFLP25D88V",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };