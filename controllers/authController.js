exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "login",
    isLoggedIn: false
  });
};

exports.postLogin = (req, res, next) => {
  //console.log(req.body);
  //req.isLoggedIn = true;
  res.cookie("isLoggedIn",true);
  res.redirect("/");
};

exports.postLogout = (req, res, next) => {
  //console.log(req.body);
  //req.isLoggedIn = true;
  res.cookie("isLoggedIn",false);
  res.redirect("/login");
};