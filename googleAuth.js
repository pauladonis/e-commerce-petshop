const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport");
require("dotenv").config();
const { pool } = require('./dbConfig');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (_, __, profile, done) => {
            const account = profile._json;
            const email = account.email;
            console.log(email);
            let user = {}
            try {
                const currentUserQuery = await pool.query("SELECT * FROM users WHERE email = $1;", [email]);
                if (currentUserQuery.rows.length === 0) {
                    await pool.query("INSERT INTO users(email) VALUES($1);", [email]);
                    const id = await pool.query("SELECT id FROM users where email = $1;", [email]);
                    user = {id};
                } else {
                    const id = currentUserQuery.rows[0];
                    user = {id};
                }
                done(null, user);
            } catch (error) {
                done(error);
            }
        }
    )
); 
    
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null ,user);

})