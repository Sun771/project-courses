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
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

const users = [];

// using css files
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

// Routes
app.get("/main", (req, res) => {
  // Check if req.user.name is defined
  const name = req.user && req.user.name ? req.user.name : undefined;
  const authenticationState = req.isAuthenticated();
  res.render("main.ejs", {
    name: name,
    authenticationState: authenticationState,
  });
});

app.get("/courses", (req, res) => {
  // Check if req.user.name is defined
  const name = req.user && req.user.name ? req.user.name : undefined;
  const authenticationState = req.isAuthenticated();
  res.render("courses.ejs", {
    name: name,
    authenticationState: authenticationState,
  });
});

app.get("/articles", (req, res) => {
  // Check if req.user.name is defined
  const name = req.user && req.user.name ? req.user.name : undefined;
  const authenticationState = req.isAuthenticated();
  res.render("articles.ejs", {
    name: name,
    authenticationState: authenticationState,
  });
});

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/main",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
  console.log(users);
});
// /Routes

// log out functionality
app.delete("/logout", (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
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
    return res.redirect("/main");
  }

  next();
}

// setting port for localhost
app.listen(3000);
