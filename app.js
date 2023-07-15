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

const userName = "jenilgoti";
const passWD = "Jenil@23";

const mailSchema = {
  name: String,
  email: String,
  subject: String,
  message: String,
  date: Date
};

const Mail = mongoose.model("mail", mailSchema);

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/profile/:name", function (req, res) {
  var json;
  switch (req.params['name']) {
    case 'shop-app':
      json = {
        pName: 'Shop app',
        pCategory: 'web Application',
        pUrl: 'https://shop-app-5p6y.onrender.com/products',
        gitUrl: 'https://github.com/JenilGoti/shop-app-by-jenil-goti',
        images: ['/img/portfolio/shopping-apps.jpg',
          '/img/portfolio/shop2.png',
          '/img/portfolio/shop3.png',
          '/img/portfolio/shop4.png',
          '/img/portfolio/shop5.png',
          '/img/portfolio/shop6.png',
          '/img/portfolio/shop7.png',
          '/img/portfolio/shop8.png',
          '/img/portfolio/shop9.png',
          '/img/portfolio/shop10.png',
        ],
        detail: ["• Develop with Nodejs, Express and MongoDb.", "• app provide great shopping experience with new feature"]
      }
      break;
    case 'nestscout':
      json = {
        pName: 'NESTSCOUT',
        pCategory: 'web Application',
        pUrl: 'https://nestscout.onrender.com/',
        gitUrl: 'https://github.com/JenilGoti/Advanced-Reliable-Real-Estate-Portal',
        images: ['/img/portfolio/nestscout.png',
          '/img/portfolio/nestscout1.png',
          '/img/portfolio/nestscout2.png',
          '/img/portfolio/nestscout3.png',
          '/img/portfolio/nestscout4.png',
          '/img/portfolio/nestscout5.png',
          '/img/portfolio/nestscout6.png',
          '/img/portfolio/nestscout7.png',
          '/img/portfolio/nestscout8.png',
          '/img/portfolio/nestscout9.png',
          '/img/portfolio/nestscout10.png',
        ],
        detail: ["• EDUCATIONAL project for Design engineering don't miss it to view it.",
          "• Develop with Nodejs, Express, MongoDb, Soket.io, peer&peerJs, WebRtc Ejs-template etc.",
          "• This is a place where people go and find reliable properties to buy, rental or PG purposes.",
          "• users can List new Property, update property, like, ask question and share.",
          "• Users can interact with Each other by chatting and cam-visiting with video call functionality"
        ]
      }
      break;

    default:
      break;
  }
  res.render("profile-view", json)
})

app.post("/", function (req, res) {
  console.log(req.body);
  newMail = new Mail({
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message,
    date: new Date()
  })
  Mail.insertMany([newMail], function (err) {
    if (err) {
      // console.log(err);
      res.render("error", {
        error: err
      })
    } else {
      console.log("added Successfully");
      res.render("sucess.ejs")
    }
  })

});

app.get("/admin", function (req, res) {
  res.render("admin", {
    fail: false
  });
})
app.get("/mails/jenilgoti/Jenil@23", function (req, res) {
  Mail.find({}, function (err, mailList) {
    if (err) {
      res.render("error", {
        error: err
      })
    } else {
      mailList = mailList.sort(function (a, b) {
        return new Date(b).getTime() - new Date(a).getTime();
      });
      res.render("mails-previue", {
        mailList: mailList.reverse()
      });
    }
  });
});



app.post("/loginreq", function (req, res) {
  // console.log(req.body);
  if (userName == req.body.userName && passWD == req.body.passWD) {

    res.redirect("mails/" + userName + "/" + passWD);
  } else {
    res.render("admin", {
      fail: true
    });
  }
});


app.get("/mails/jenilgoti/Jenil@23/:mail", function (req, res) {
  Mail.find({
    _id: req.params.mail
  }, function (err, mail) {
    if (err) {
      res.render("error", {
        error: err
      })
    } else {
      res.render("mail", {
        mail: mail[0]
      });
    }

  });
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log("Server started Successfully");
});