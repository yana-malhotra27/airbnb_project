const Home = require("../models/home");
const Booking = require("../models/booking");
const fs = require('fs');

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing: false,
    isLoggedIn: req.isLoggedIn, 
    user: req.session.user,
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";

  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found for editing.");
      return res.redirect("/host/host-home-list");
    }

    console.log(homeId, editing, home);
    res.render("host/edit-home", {
      home: home,
      pageTitle: "Edit your Home",
      currentPage: "host-homes",
      editing: editing,
      isLoggedIn: req.isLoggedIn, 
      user: req.session.user,
    });
  });
};

exports.getHostHomes = (req, res, next) => {
  Home.find({ owner: req.session.user._id }).then((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn: req.isLoggedIn, 
      user: req.session.user,
      errors: []
    });
  });
};

exports.postAddHome = (req, res, next) => {
  // const { houseName, price, location, rating, photo, description } = req.body;
  const { houseName, price, location, rating, description } =
    req.body;
    console.log(req.file)
    if (!req.file) {
    return res.status(422).send("No image provided");
  }
  const photo = req.file.path;
  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photo,
    description,
    owner: req.session.user._id
  });
  home.save().then(() => {
    console.log("Home Saved successfully");
  });

  res.redirect("/host/host-home-list");
};

exports.postEditHome = (req, res, next) => {
  //const { id, houseName, price, location, rating, photo, description } = req.body;
  const { id, houseName, price, location, rating, description } = req.body;
  Home.findById(id).then((home) => {
    home.houseName = houseName;
    home.price = price;
    home.location = location;
    home.rating = rating;
    if (req.file) {
        fs.unlink(home.photo, (err) => {
          if (err) {
            console.log("Error while deleting file ", err);
          }
        });
        home.photo = req.file.path;
      }
    home.description = description;
    home.save().then((result) => {
      console.log("Home updated ", result);
    }).catch(err => {
      console.log("Error while updating ", err);
    })
    res.redirect("/host/host-home-list");
  }).catch(err => {
    console.log("Error while finding home ", err);
  });
};

exports.postDeleteHome = async (req, res, next) => {
  const homeId = req.params.homeId;
  console.log("Came to delete ", homeId);
  const existingBooking = await Booking.findOne({ home: homeId });
    if (existingBooking) {
    const registeredHomes = await Home.find({ owner: req.session.user._id });

    return res.status(422).render("host/host-home-list", {
      registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
      errors: ["This home has bookings. Cancel them first."]
    });
  }

  await Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch((error) => {
      console.log("Error while deleting ", error);
    });
};

exports.getHostBookings = async (req, res) => {
  const hostId = req.session.user._id;

  // 1. host homes
  const homes = await Home.find({ owner: hostId });

  const homeIds = homes.map(h => h._id);

  // 2. homes bookings
  const bookings = await Booking.find({
    home: { $in: homeIds }
  }).populate("home user");

  res.render("host/host-bookings", {
    bookings,
    pageTitle: "Host Bookings",
    currentPage: "host-bookings",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user
  });
};

exports.cancelBookingByHost = async (req, res) => {
  const bookingId = req.params.bookingId;

  await Booking.findByIdAndDelete(bookingId);

  res.redirect("/host/bookings");
};