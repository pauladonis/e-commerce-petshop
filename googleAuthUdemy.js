const GoogleStrategy = require('passport-google-oauth20').Strategy;
const express = require('express')
const passport = require("passport");
require("dotenv").config();

const app = express();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        }, (accessToken, refreshToken, profile, done) => {
            console.log(accessToken);
            console.log(refreshToken);
            console.log(profile);
            console.log("aici");
        }
));

app.get('/auth/google', passport.authenticate('google', {scope: 'profile'}));

app.get('/auth/google/callback', passport.authenticate('google'));

const PORT = process.env.PORT || 3000;
app.listen(PORT);