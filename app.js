// Core Module
const path = require('path');

// External Module
const express = require('express');
const mongoose = require('mongoose');

//Local Module
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded());

app.use(storeRouter);
app.use("/host", hostRouter);

app.use(express.static(path.join(rootDir, 'public')))

app.use(errorsController.pageNotFound);

const DB_PATH=""

PORT=3000;
mongoose.connect(DB_PATH).then(()=> {
    console.log("mongoose connected")
    app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`);
    });
}).catch(err=>{
    console.log(err)
});