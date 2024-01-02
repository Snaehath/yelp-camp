const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("user/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to YelpCamp");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("user/login");
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back!!");
  const redirect = res.locals.returnTo || "/campgrounds";
  delete res.locals.returnTo;
  res.redirect(redirect);
};

module.exports.logout = (req, res, next) => {
  req.logout((e) => {
    if (e) {
      return next(e);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};
