const express = require("express");
const path = require("path");
const auth = require("./middleware/auth");
const userRoutes = require("./routes/userRoutes");
const commentRoutes = require("./routes/commentRoutes");
const postRoutes = require("./routes/postRoutes");
const bodyParser = require('body-parser');

const cors=require("cors");
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};
const app = express();


app.use(cors(corsOptions));


app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.urlencoded({ extended: true }));



app.use("/api/user", userRoutes);
app.use("/api/post", auth, postRoutes);
app.use("/api/comment", auth, commentRoutes);


module.exports = app;