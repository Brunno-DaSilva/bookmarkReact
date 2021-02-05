//npm init -y
//npm i express
//npm install mongoose --save

//DEPENDENCIES
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const db = mongoose.connection;

//ENVIRONMENT VARIABLES
const mongoURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/merncrudbookmark";
const PORT = process.env.PORT || 3001;

//CONNECT TO MONGO
mongoose.connect(mongoURI, { useNewURLParser: true }, () =>
  console.log("MongoDB connection established:", mongoURI)
);

//ERROR/DISCONNECTION
db.on("error", (err) => console.log(err.message + "is Mongod not running?"));
db.on("disconnected", () => console.log("mongo disconnected"));

//MIDDLEWARE
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

//ROUTES
const bookmarkController = require("./controller/bookmarks.controller");
app.use("/bookmarks", bookmarkController);

app.get("*", (req, res) => {
  res.status(404).json("Sorry, page not found");
});

app.listen(PORT, () => {
  console.log("Ciao, ascoltando nella porta ", PORT);
});
