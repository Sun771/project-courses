const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { User } = require("./database");
// Log to console the moment User model is imported
console.log("passport-config.js: User model imported:", User);

const usersCache = {}; // Initialize an empty cache

// function initialize(passport, getUserByEmail, getUserById) {
//   const authenticateUser = async (email, password, done) => {
//     const user = getUserByEmail(email);
//     if (user == null) {
//       return done(null, false, { message: "No user with that email" });
//     }

//     try {
//       if (await bcrypt.compare(password, user.password)) {
//         return done(null, user);
//       } else {
//         return done(null, false, { message: "Password incorrect" });
//       }
//     } catch (e) {
//       return done(e);
//     }
//   };

//   passport.use(
//     new LocalStrategy(
//       {
//         usernameField: "email",
//       },
//       authenticateUser
//     )
//   );
//   passport.serializeUser((user, done) => done(null, user.id));
//   passport.deserializeUser((id, done) => {
//     return done(null, getUserById(id));
//   });
// }

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await User.findOne({ where: { Email: email } });
      if (!user) {
        return done(null, false, {
          message: "Користувача з вказаною електронною поштою не знайдено",
        });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.Password);
      if (isPasswordMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Пароль не вірний" });
      }
    } catch (error) {
      console.error(error);
      return done(error);
    }
  };

  const registerUser = async (email, done) => {
    try {
      const user = await User.findOne({ where: { Email: email } });
      if (user) {
        return done(null, false, {
          message: "duplicate email error",
        });
      }
    } catch (error) {
      console.error(error);
      return done(error);
    }
  };

  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      authenticateUser,
      registerUser
    )
  );

  passport.serializeUser((user, done) => done(null, user.Id));

  passport.deserializeUser(async (id, done) => {
    try {
      if (usersCache[id]) {
        // If the user data exists in the cache, retrieve it from there
        return done(null, usersCache[id]);
      }

      const user = await User.findByPk(id);
      if (user) {
        // Store user data in the cache
        usersCache[id] = user;
        return done(null, user);
      } else {
        return done(null, false, { message: "User not found" });
      }
    } catch (error) {
      return done(error);
    }
  });
}

module.exports = initialize;
