importScripts("https://www.gstatic.com/firebasejs/7.9.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/7.9.1/firebase-messaging.js");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../firebase-messaging-sw.js")
    .then(function (registration) {
      console.log("Registration successful, scope is:", registration.scope);
    })
    .catch(function (err) {
      console.log("Service worker registration failed, error:", err);
    });
}
console.log(navigator);

firebase.initializeApp({
  apiKey: "AIzaSyCcDEedsuDYfex0tC5Exrmn4BoZjb7Y18o",
  authDomain: "moby-177a8.firebaseapp.com",
  // databaseURL: "https://moby-177a8-default-rtdb.firebaseio.com",
  projectId: "moby-177a8",
  storageBucket: "moby-177a8.appspot.com",
  messagingSenderId: "730653430853",
  appId: "1:730653430853:web:284f9fcaa9d8685649ff2c",
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
