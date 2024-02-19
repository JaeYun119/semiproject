const express = require('express');
const morgan = require('morgan');
const app = express();


//라우팅
const home = require('./src/routes/home');

//앱세팅
app.set("views","./src/views");
app.set("view engine", "ejs");

app.use(express.static(`${__dirname}/src/public`));
app.use("/",home); // use => 미들 웨어르 등록해주는 메서드.

module.exports = app;