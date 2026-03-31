// const express=require('express');
// //const path=require('path')
// const userRouter=express.Router();
// //const rootDir=require("../utils/pathUtil");
// const { registeredHomes } = require('./hostRouter');

// // userRouter.get("/",(req,res,next)=>{
// //     console.log(registeredHomes)
// //     res.sendFile(path.join(rootDir,"views","home.html"))
// // })

// // userRouter.get("/", (req, res, next) => {
// //   console.log(registeredHomes);
// //   res.render('home', {registeredHomes: registeredHomes, pageTitle: 'airbnb Home'});
// // });

// userRouter.get("/", (req, res, next) => {
//   console.log(registeredHomes);
//   res.render('home', {registeredHomes: registeredHomes, pageTitle: 'airbnb Home', currentPage: 'Home'});
// });


// module.exports = userRouter;