const express = require("express");
// eslint-disable-next-line no-unused-vars
const router = express.Router();
// eslint-disable-next-line no-unused-vars
const dotenv = require("dotenv").config();
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
const path = require("path")

const page = require("./routes/api/pages")

const app = express();
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.use(
    require('express-session')({
      secret: process.env.APP_SECRET,
      resave: true,
      saveUninitialized: false
    })
  );
  
  const { ExpressOIDC } = require('@okta/oidc-middleware');
  const oidc = new ExpressOIDC({
    appBaseUrl: process.env.HOST_URL,
    issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
    client_id: process.env.OKTA_CLIENT_ID,
    client_secret: process.env.OKTA_CLIENT_SECRET,
    redirect_uri: `${process.env.HOST_URL}/callback`,
    scope: 'openid profile',
    routes: {
      loginCallback: {
        path: '/callback'
      },
    }
  });

  app.use(oidc.router);

// DB Config
const db = process.env.MONGO_URI;
// Connect to MongoDB
mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false } )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));
const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there



app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + "/fonts"));
app.use(express.static(__dirname + "/images"))

app.get('/',function(req,res) {
    res.sendFile(path.join(__dirname + "/public/index.html"));
  });


app.get("/admin/pages/homepage", function(req, res) {
  if (req.userContext) {
  res.render(path.join(__dirname + "/public/admin.pug"))
  } else {
    res.redirect("/login")
  }
})

app.use("/api/pages", page)

app.listen(port, () => console.log(`Server up and running on port ${port}`));


  
