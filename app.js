const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload")

const errorMiddleware = require("./middleware/error");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload())

const product = require("./routes/postRoute");
const user = require("./routes/userRoute")

app.use("/api/v1",product);
app.use("/api/v1",user)

// middleware for error handling
app.use(errorMiddleware);

module.exports = app;