const Home = require("../models/home");
//const Favourite = require("../models/favourite");
const User = require("../models/user");
const Booking = require("../models/booking");

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



// exports.postAddToBooking = async (req, res, next) => {
//   const homeId = req.body.id;
//   const userId = req.session.user._id;
//   const user = await User.findById(userId);
//   if (!user.bookings.includes(homeId)) {
//     user.bookings.push(homeId);
//     await user.save();
//   }
//     res.redirect("/bookings");
// };

exports.getBookingForm = async (req, res) => {
  if (!req.isLoggedIn) {
    return res.redirect("/login");
  }

  const home = await Home.findById(req.params.homeId);
  if (!home) {
    return res.redirect("/homes");
  }

  const bookings = await Booking.find({ home: home._id });

  res.render("store/booking-form", {
    home,
    bookings,
    pageTitle: "Booking Form",
    currentPage: "Booking Form",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user
  });
};

exports.postAddToBooking = async (req, res) => {
  if (!req.isLoggedIn) {
    return res.redirect("/login");
  }

  const { homeId, fromDate, toDate, name, aadhaar } = req.body;

  const start = new Date(fromDate);
  const end = new Date(toDate);

  // invalid
  if (start > end) {
    return res.send("Invalid dates");
  }

  // overlap check
  const existingBooking = await Booking.findOne({
    home: homeId,
    $or: [
      {
        fromDate: { $lte: end },
        toDate: { $gte: start }
      }
    ]
  });

  if (existingBooking) {
    return res.send("Already booked for these dates");
  }

  // save
  const booking = new Booking({
    home: homeId,
    user: req.session.user._id,
    fromDate: start,
    toDate: end,
    name,
    aadhaarLast4: aadhaar
  });

  await booking.save();

  res.redirect("/bookings");
};

exports.postRemoveFromBooking = async (req, res, next) => {
  // const homeId = req.params.homeId;
  // const userId = req.session.user._id;
  // const user = await User.findById(userId);
  // if (user.bookings.includes(homeId)) {
  //   user.bookings = user.bookings.filter(book => book != homeId);
  //   await user.save();
  // }
  //   res.redirect("/bookings");
  const bookingId = req.params.bookingId;

  await Booking.findByIdAndDelete(bookingId);

  res.redirect("/bookings");
};

exports.getBookings = async (req, res, next) => {
  //  const userId = req.session.user._id;
  // const user = await User.findById(userId).populate('bookings');

  //   res.render("store/booking-list", {
  //     bookingHomes: user.bookings,
  //     pageTitle: "My Bookings",
  //     currentPage: "bookings",
  //     isLoggedIn: req.isLoggedIn,
  //     user: req.session.user,
  //   });

  
  const bookings = await Booking.find({
    user: req.session.user._id
  }).populate("home");

  res.render("store/booking-list", {
    bookings,
    pageTitle: "Bookings",
    currentPage: "Bookings",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user
  });
};