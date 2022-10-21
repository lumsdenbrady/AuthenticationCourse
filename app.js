//jshint esversion:6
require('dotenv').config();
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const ejs = require("ejs");
app.set('view engine', 'ejs');
const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
const encrypt = require("mongoose-encryption");


const userSchema = new mongoose.Schema( {
  email: String,
  password: String
});

userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);


app.route("/login")
.get((req,res)=>{
  res.render("login")

})
.post((req,res)=>{
User.findOne(
  {email: req.body.username},
  (err, foundUser) => {

    if (!err) {
      if(foundUser.password === req.body.password){
        res.render("secrets")
      }else{
        res.send("incorrect password")
      }
    } else {
      res.send("incorrect username")

    }
  }
)});


app.route("/register")
.get((req,res)=>{
  res.render("register")

})
.post((req,res)=>{
let newUser = new User({
  email:req.body.username,
  password:req.body.password
});
newUser.save((err)=> {
  if(err){console.log(err);}
  else {res.render("secrets")}
});

});


app.route("/home")
.get((req,res)=>{
  res.render("home")

});





app.route("/submit")
.get((req,res)=>{
res.render("submit");

})
.post((req,res)=>{

});

app.route("/logout")
.get((req,res)=>{
  res.render("home")

});












app.listen(3000, () => {
  console.log("server started on port 3000.");
})
