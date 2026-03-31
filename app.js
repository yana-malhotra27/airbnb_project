// Core Module
const path = require('path');

// External Module
const express = require('express');

//Local Module
const storeRouter = require("./routes/storeRouter")
const hostRouter = require("./routes/hostRouter")
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
const {mongoConnect} = require('./utils/database');

const app = express();

// const db=require("./utils/database")

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded());

// db.execute("SELECT * FROM airbnb").then(([rows,fields]) => {
//     console.log(rows);
//     console.log(fields);
// }).catch((error) => {
//     console.log(error);
// });

app.use(storeRouter);
app.use("/host", hostRouter);

app.use(express.static(path.join(rootDir, 'public')))

app.use(errorsController.pageNotFound);


// const express=require('express')
// //const parser=require('body-parser')
// //const userRouter =require("./routes/userRouter")
// const path=require('path')
// //const {hostRouter} =require("./routes/hostRouter")

// const rootDir=require("./utils/pathUtil")

// const app=express()
// app.set('view engine','ejs');
// app.set('views','views')


// app.use(express.urlencoded());

// app.use(userRouter)
// app.use("/host",hostRouter)

// app.use(express.static(path.join(rootDir,"public")))

// // app.use((req,res,next)=>{
// //     res.sendFile(path.join(rootDir,"views","404.html"))
// // })

// app.use((req, res, next) => {
//   res.status(404).render('404', {pageTitle: 'Page Not Found'});
// })



// app.use(parser.urlencoded());


PORT=3000;
mongoConnect(()=>{
    //console.log(client)
    app.listen(PORT,()=>{
    console.log(`server is running at http://localhost:${PORT}`)
});
});



//for console
//npx tailwind -i ./views/input.css -o ./public/output.css --watch