import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase (corrigida)
const firebaseConfig = {
  apiKey: "AIzaSyDdaUCwx39RDzjNglNrVi0zwZ4puG4wnas",
  authDomain: "fiquebembd.firebaseapp.com",
  projectId: "fiquebembd",
  storageBucket: "fiquebembd.appspot.com", 
  messagingSenderId: "375021566757",
  appId: "1:375021566757:web:fe42dbbde41cd92580f8cc",
  measurementId: "G-20MVSHZ7BK",
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
