const LocalStrategy = require('passport-local').Strategy;
const { pool } = require('./dbConfig');
const bcrypt = require('bcrypt');
const passport = require("passport");


function initialize(passport) {
  const authenticateUser = (email, password, done) => {
    
    pool.query(
      `SELECT * FROM users where email = $1`, 
      [email]
      ,  
      (err, results) => {
        if (err) {
          throw err;
        }
        else if(results.rows.length=== 0) {
          return done(null, false);
        }
        else {
          const user = results.rows[0];
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) throw err;
            if (result === true) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          })
        } 
      } 
    )
  }


passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    authenticateUser
  )
);
passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((id, done) => {
  pool.query(
    `SELECT * FROM users WHERE id=$1`, [id], (err, results) => {
      if(err) {
        throw err;
      }
      return done(null, results.rows[0]);
    }
  )
})
}

module.exports = initialize;

