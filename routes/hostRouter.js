const express=require('express');
const hostRouter=express.Router();
//const path=require('path')
//const rootDir=require("../utils/pathUtil")

const hostController = require("../controllers/hostController");

hostRouter.get("/add-home", hostController.getAddHome);
hostRouter.post("/add-home", hostController.postAddHome);
hostRouter.get("/host-home-list", hostController.getHostHomes);

hostRouter.get("/edit-home/:homeId", hostController.getEditHome);
hostRouter.post("/edit-home", hostController.postEditHome);
hostRouter.post("/delete-home/:homeId", hostController.postDeleteHome);

hostRouter.get("/bookings", hostController.getHostBookings);
hostRouter.post("/cancel-booking/:bookingId", hostController.cancelBookingByHost);

// hostRouter.get("/add-home",(req,res,next)=>{
//     res.sendFile(path.join(rootDir,"views","addHome.html"))
// })

// hostRouter.get("/add-home", (req, res, next) => {
//   res.render('addHome', {pageTitle: 'Add Home to airbnb'});
// })

// hostRouter.get("/add-home", (req, res, next) => {
//   res.render('addHome', {pageTitle: 'Add Home to airbnb', currentPage: 'addHome'});
// })

// const registeredHomes = [];

// hostRouter.post("/add-home", (req, res, next) => {
//   console.log('Home Registration successful for:', req.body);
//   registeredHomes.push(req.body);
//   res.render('homeAdded', {pageTitle: 'Home Added Successfully', currentPage: 'homeAdded'});
// })

// hostRouter.post("/add-home",(req,res,next)=>{
//     console.log(req.body.houseName);
//     registeredHomes.push({houseName: req.body.houseName})
//     res.sendFile(path.join(rootDir,"views","homeAdded.html"))
// })

// hostRouter.post("/add-home", (req, res, next) => {
//   console.log('Home Registration successful for:', req.body, req.body.houseName);
//   registeredHomes.push({houseName: req.body.houseName});
//   res.render('homeAdded', {pageTitle: 'Home Added Successfully'});
// })

module.exports = hostRouter;

//exports.hostRouter = hostRouter;
//exports.registeredHomes=registeredHomes;