// //how to do a google login
// //https://developers.google.com/identity/sign-in/web/sign-in

// function onSignIn(googleUser) {
//   var profile = googleUser.BasicProfile;
//   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//   console.log('Name: ' + profile.getName());
//   console.log('Image URL: ' + profile.getImageUrl());
//   console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

//   var id_token = googleUser.getAuthResponse().id_token;

//   var xhr = new XMLHttpRequest();
//   xhr.open('POST', '/tokensignin');

//   xhr.onreadystatechange = function() {
//     if (this.readyState == 4 && this.status == 200) {
//       // login successful
//     } else  if (this.readyState == 4 && this.status == 401) {
//       // login failed
//     }
//   };

//   xhr.setRequestHeader('Content-Type', 'application/json');
//   xhr.send(JSON.stringify({'idtoken': id_token}));

// }

// function signOut() {
//   var auth2 = gapi.auth2.getAuthInstance();
//   auth2.signOut().then(function () {
//     console.log('User signed out.');
//   });

//   // Do our logout on server here

// }

// function init() {
//   gapi.load('auth2', function() {
//     gapi.auth2.init();
//   });
// }