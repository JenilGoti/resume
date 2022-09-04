const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://jenil:jenil123@cluster0.jp9lx8h.mongodb.net/resume-mail");

const userName="jenilgoti";
const passWD="Jenil@23";

const mailSchema= {
  name : String,
  email : String,
  subject : String,
  message : String,
  date: Date
};

const Mail = mongoose.model("mail", mailSchema);

app.get("/",function(req,res){
  res.render("index");

});

app.post("/",function(req,res){
  console.log(req.body);
  newMail=new Mail({
    name:req.body.name,
    email:req.body.email,
    subject:req.body.subject,
    message:req.body.message,
    date:new Date()
  })
  Mail.insertMany([newMail],function(err){
    if(err){
      // console.log(err);
      res.render("error",{error:err})
    }
    else{
      console.log("added Successfully");
      res.render("sucess.ejs")
    }
  })

});

app.get("/admin",function(req,res){
  res.render("admin",{fail:false});
})
app.get("/mails/jenilgoti/Jenil@23",function(req,res){
  Mail.find({},function(err,mailList){
    if(err){
      res.render("error",{error:err})
    }
    else{
     mailList = mailList.sort(function(a, b) {
      return new Date(b).getTime() - new Date(a).getTime();
    });
      res.render("mails-previue",{mailList:mailList.reverse()});
    }
  });
});
app.post("/loginreq",function(req,res){
// console.log(req.body);
if(userName==req.body.userName&&passWD==req.body.passWD){

  res.redirect("mails/"+userName+"/"+passWD);
}
else{
  res.render("admin",{fail:true});
}
});

app.get("/mails/jenilgoti/Jenil@23/:mail",function(req,res){
  Mail.find({_id:req.params.mail},function(err,mail){
    if(err){
      res.render("error",{error:err})
    }
    else{
      res.render("mail",{mail:mail[0]});
    }

  });
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started Successfully");
});
