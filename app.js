// Core Module
const path = require('path');

// External Module
const express = require('express');
const mongoose = require('mongoose');
const session=require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const multer=require('multer');
require("dotenv").config();
//const flash = require("connect-flash");

//Local Module
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
const authRouter = require("./routes/authRouter");

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
})

const randomString = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, randomString(10) + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const multerOptions ={
    //dest:"uploads/",
    storage, fileFilter
};
app.use(express.urlencoded());
app.use(multer(multerOptions).single('photo'));
app.use(express.static(path.join(rootDir, 'public')))
app.use("/uploads", express.static(path.join(rootDir, 'uploads')))
app.use("/host/uploads", express.static(path.join(rootDir, 'uploads')))
app.use("/homes/uploads", express.static(path.join(rootDir, 'uploads')))


app.use(session({
    secret: "this is nice",
    resave: false,
    saveUninitialized: false,
    store
}));

//app.use(flash());

// app.use((req, res, next) => {
//   res.locals.success = req.flash("success") || [];
//   res.locals.error = req.flash("error") || [];
//   next();
// });

app.use((req,res,next)=>{
    //console.log(req.get('cookies'));
    req.isLoggedIn = req.session.isLoggedIn
    //console.log(req.session.isLoggedIn);
    next();
});

app.use(authRouter);
app.use(storeRouter);

app.use("/host",(req,res,next)=>{
    if(req.isLoggedIn) {
        next();
    } else {
        res.redirect("/login");
    }
});
app.use("/host", hostRouter);



app.use(errorsController.pageNotFound);

PORT=3003;
mongoose.connect(process.env.MONGO_URI).then(()=> {
    console.log("mongoose connected")
    app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
    });
}).catch(err=>{
    console.log(err)
});