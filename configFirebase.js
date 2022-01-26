function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const firebaseConfig = {
    apiKey: "AIzaSyBFhoS866U8BDGEX5Hvhi0nXwPNTJgI4BI",
    authDomain: "break-your-limitations.firebaseapp.com",
    projectId: "break-your-limitations",
    storageBucket: "break-your-limitations.appspot.com",
    messagingSenderId: "622219681947",
    appId: "1:622219681947:web:9f028a12e1720a0fce263e",
    measurementId: "G-E49C8W1T0S"
};
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
//U5Dbgs1dUW6iiyxb2y44
var main_questions = db.collection("main-questions").doc("U5Dbgs1dUW6iiyxb2y44");

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}
  