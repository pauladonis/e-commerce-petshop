const LocalStrategy = require('passport-local').Strategy;
const { pool } = require('./dbConfig');
const passport = require("passport");

function initialize(passport) {
  const authenticateUser = (email, password, done) => {
    
    pool.query(
      `SELECT * FROM users where email = $1`, 
      [email],
      
      
      (err, results) => {
        if (err) {
          
          throw err;

        }

        if(results.rows.length) {
          
          const user = results.rows[0];
          if (password === user.password) {
            return done(null, user);
          } else if (password !== user.password) {
            return done(null, false, {message: "Password is not correct"})
          }
        } else {
          return done(null, false, {message: "Email is not registered"})
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
passport.serializeUser((user, done) => done(null, user.id));

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

