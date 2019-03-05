import firebase from 'firebase';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCj57T1YaWyai0wr-ndDkaS77Ch1ifKxiQ",
    authDomain: "lit-tracker.firebaseapp.com",
    databaseURL: "https://lit-tracker.firebaseio.com",
    projectId: "lit-tracker",
    storageBucket: "lit-tracker.appspot.com",
    messagingSenderId: "371239445542"
};
firebase.initializeApp(config);

export default firebase;