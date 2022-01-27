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
  measurementId: "G-E49C8W1T0S",
};
firebase.initializeApp(firebaseConfig);

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  let user = getCookie("username");
  if (user != "") {
    alert("Welcome again " + user);
  } else {
    user = prompt("Please enter your name:", "");
    if (user != "" && user != null) {
      setCookie("username", user, 365);
    }
  }
}
