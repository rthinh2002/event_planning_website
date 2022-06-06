// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth2').Strategy;

// const GOOGLE_CLIENT_ID = '376889211664-23uvkba9h1eb2shsj4htgr6avk4jq8qp.apps.googleusercontent.com';
// const GOOGLE_CLIENT_SECRET = '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';

// passport.use(new GoogleStrategy({
//     clientID:     GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/google/callback",
//     passReqToCallback   : true
//   },
//   function(request, accessToken, refreshToken, profile, done) {
//       return done(err, profile);
//   }
// ));

// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(user, done) {
//   done(null, user);
// });

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    });
}