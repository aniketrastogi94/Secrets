//jshint esversion:6
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose",{ useUnifiedTopology: true });
// const md5=require("md5");
// const encrypt=require("mongoose-encryption");
const bcrypt=require("bcrypt");
const saltRounds=10;
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});


const userSchema=new mongoose.Schema({
  email:String,
  password:String
});
console.log(process.env.API_KEY);
const secret=process.env.SECRET;
// userSchema.plugin(encrypt,{ secret: secret, encryptedFields: ["password"] });

const User=new mongoose.model("User", userSchema);
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){
  bcrypt.hash(req.body.password, saltRounds, function(err, hash){
    const newUser=new User({
      email:req.body.username,
      password:hash
      // password:md5(req.body.password)
    });
    newUser.save(function(err){
      if(err){
        console.log(err);
      }else{
        res.render("secrets");
      }
    });
  });

});

app.post("/login",function(req,res){
  const username=req.body.username;
  // const password=md5(req.body.password);
  const password=req.body.password;
  User.findOne({email:username},function(err,FoundUser){
    if(!err){
      // if(FoundUser){
      //   if(FoundUser.password===password){
      //     res.render("Secrets");
      //   }
      bcrypt.compare(password,FoundUser.password,function(err, result){
        if(result==true){
          res.render("Secrets");
        }
      });
      }else{
        console.log(err);
      }
  });
});

app.listen(3000,function(){
  console.log("server running on port 3000");
})
