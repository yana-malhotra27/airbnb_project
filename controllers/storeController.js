const Home = require("../models/home");
//const Favourite = require("../models/favourite");
const User = require("../models/user");

exports.getIndex = (req, res, next) => {
  // console.log(req.session,req.session.isLoggedIn);
  console.log("HOME SESSION ID:", req.sessionID);
  console.log("FULL SESSION:", req.session);
console.log("SESSION KEYS:", Object.keys(req.session));
  Home.find().then((registeredHomes) => {
    //console.log("Session in home route:", req.session);
    console.log("home:", req.session.isLoggedIn)
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "airbnb Home",
      currentPage: "index",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getHomes = (req, res, next) => {
  console.log("HOME SESSION ID:", req.sessionID);
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getBookings = (req, res, next) => {
  res.render("store/bookings", {
    pageTitle: "My Bookings",
    currentPage: "bookings",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getFavouriteList = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourites');

  // Favourite.find().populate("homeId").then(favourites => {
  //   favourites = favourites.map((fav) => fav.homeId.toString());
  //   const favouriteHomes = favourites.map((fav) => fav.homeId);
    res.render("store/favourite-list", {
      favouriteHomes: user.favourites,
      pageTitle: "My Favourites",
      currentPage: "favourites",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  //});
};

exports.postAddToFavourite = async (req, res, next) => {
  const homeId = req.body.id;
  // Favourite.findOne({homeId: homeId}).then((fav) => {
  //   if (fav) {
  //     console.log("Already marked as favourite");
  //   } else {
  //     fav = new Favourite({homeId: homeId});
  //     fav.save().then((result) => {
  //       console.log("Fav added: ", result);
  //     });
  //   }
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
  }
    res.redirect("/favourites");
  // }).catch(err => {
  //   console.log("Error while marking favourite: ", err);
  // });
};


exports.postRemoveFromFavourite = async (req, res, next) => {
  const homeId = req.params.homeId;
  // Favourite.findOneAndDelete({homeId}).then(result => {
  //   console.log('Fav Removed: ', result);
  // }).catch(err => {
  //   console.log("Error while removing favourite: ", err);
  // }).finally(() => {
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.favourites.includes(homeId)) {
    user.favourites = user.favourites.filter(fav => fav != homeId);
    await user.save();
  }
    res.redirect("/favourites");
  //});
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then(home => {
    if (!home) {
      console.log("Home not found");
      res.redirect("/homes");
    } else {
      res.render("store/home-detail", {
        home: home,
        pageTitle: "Home Detail",
        currentPage: "Home",
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
      });
    }
  });
};
