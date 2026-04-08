// Core Module
const path = require('path');

// External Module
const express = require('express');
const mongoose = require('mongoose');
const session=require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

//Local Module
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
const authRouter = require("./routes/authRouter");

const app = express();

const DB_PATH = "y";

const store = new MongoDBStore({
    uri: DB_PATH,
    collection: 'sessions',
})

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded());

app.use(session({
    secret: "this is nice",
    resave: false,
    saveUninitialized: true,
    store
}));

app.use((req,res,next)=>{
    //console.log(req.get('cookies'));
    req.isLoggedIn = req.session.isLoggedIn;
    //console.log(req.isLoggedIn);
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

app.use(express.static(path.join(rootDir, 'public')))

app.use(errorsController.pageNotFound);

PORT=3000;
mongoose.connect(DB_PATH).then(()=> {
    console.log("mongoose connected")
    app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
    });
}).catch(err=>{
    console.log(err)
});