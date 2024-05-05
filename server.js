const { sequelize, User } = require("./database.js");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const initializePassport = require("./passport-config");
let duplicateEmailFlag = false;

initializePassport(
  passport,
  async (email) => {
    try {
      const user = await User.findOne({ where: { Email: email } });
      return user;
    } catch (error) {
      console.error("Error finding user:", error);
      return null;
    }
  },
  async (id) => {
    try {
      const user = await User.findByPk(id);
      return user;
    } catch (error) {
      console.error("Error finding user by ID:", error);
      return null;
    }
  }
);

app.use(express.static("public"));

// Telling server that ejs is used
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// Middleware to set duplicateEmailFlag to false upon successful login
function setDuplicateEmailFlag(req, res, next) {
  duplicateEmailFlag = false;
  next();
}

// Routes
app.get("/", (req, res) => {
  const username =
    req.user && req.user.Username ? req.user.Username : undefined;
  const authenticationState = req.isAuthenticated();

  if (username && authenticationState) {
    console.log(
      `\nUser named '${req.user.Username}' successfully LOGGED IN.\n` +
        `Id: ${req.user.Id}\n` +
        `Email: ${req.user.Email}\n`
    );
  }

  res.render("main.ejs", {
    username: username,
    authenticationState: authenticationState,
    duplicateEmailFlag: duplicateEmailFlag,
  });
});

app.get("/courses", (req, res) => {
  const username =
    req.user && req.user.Username ? req.user.Username : undefined;
  const authenticationState = req.isAuthenticated();
  res.render("courses.ejs", {
    username: username,
    authenticationState: authenticationState,
  });
});

app.get("/articles", (req, res) => {
  const username =
    req.user && req.user.Username ? req.user.Username : undefined;
  const authenticationState = req.isAuthenticated();
  res.render("articles.ejs", {
    username: username,
    authenticationState: authenticationState,
  });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  checkNotAuthenticated,
  setDuplicateEmailFlag,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs", { duplicateEmailFlag: duplicateEmailFlag });
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    duplicateEmailFlag = false;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      Username: req.body.username,
      Email: req.body.email,
      Password: hashedPassword,
    })
      .then((user) => {
        console.log(
          `User created successfully: ${user.Username}, Id: ${user.Id}`
        );
      })
      .catch((err) => {
        console.log(err);
        console.error("Error creating a user:", err);
        // Duplicate entry error (email already exists)
        duplicateEmailFlag = true;
        return res.render("/register");
      });
    console.log(`Redirecting to login page.`);
    res.redirect("/login");
  } catch (e) {
    console.log(e);
    res.redirect("/register");
  }
});
// /Routes

// log out functionality
app.delete("/logout", (req, res, next) => {
  const username =
    req.user && req.user.Username ? req.user.Username : undefined;
  const authenticationState = req.isAuthenticated();

  if (username && authenticationState) {
    console.log(
      `User named '${req.user.Username}' successfully LOGGED OUT.\n` +
        `Id: ${req.user.Id}\n` +
        `Email: ${req.user.Email}\n`
    );
  }

  req.logOut((err) => {
    if (err) {
      return next(err);
    }

    // Determine the redirect URL based on the Referer header
    const redirectUrl = req.headers.referer || "/"; // Default to "/" if Referer header is not present

    // Redirect the user back to the original page or "/" if Referer header is not available
    res.redirect(redirectUrl);
  });
});

// function checkAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }

//   res.redirect("/login");
// }

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }

  next();
}

// setting port for localhost
app.listen(3000);
