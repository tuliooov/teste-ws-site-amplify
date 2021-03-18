import firebase from "firebase";
console.log('2 ========== FIREBASE INIT')
const config = {
  apiKey: "AIzaSyBMfMDKiZhWIXEeXMW7V9eoP9Pe0gtbgzQ",
  authDomain: "novositepedidos.firebaseapp.com",
  databaseURL: "https://novositepedidos.firebaseio.com",
  projectId: "novositepedidos",
  storageBucket: "novositepedidos.appspot.com",
  messagingSenderId: "712531290885",
  appId: "1:712531290885:web:fdb6e571fecbf1acb5a56c",
  measurementId: "G-BQWFDHG762"
};


firebase.initializeApp(config);
export default firebase;
  // firebase.analytics();