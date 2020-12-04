/*By Derek Smith

*/


/* Declaring dependencies */ 

const express = require("express");
// eslint-disable-next-line no-unused-vars
const router = express.Router();
// eslint-disable-next-line no-unused-vars
const dotenv = require("dotenv").config();
const mongoose = require("mongoose")
const bodyParser = require("body-parser");
const path = require("path")



/*API routes*/

const page = require("./routes/api/pages")
const blogs = require("./routes/api/posts")

/* Express Stuff */

const app = express();
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

/* Okta Login Config */
app.use(
    require('express-session')({
      secret: process.env.APP_SECRET,
      resave: true,
      saveUninitialized: false
    })
  );
  
  const { ExpressOIDC } = require('@okta/oidc-middleware');
const Pages = require("./models/Pages");
const BlogPosts = require("./models/BlogPosts");
  const oidc = new ExpressOIDC({
    appBaseUrl: process.env.HOST_URL,
    issuer: `${process.env.OKTA_ORG_URL}`,
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


/* Static Pages */

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + "/fonts"));
app.use(express.static(__dirname + "/images"))

app.get('/',function(req,res) {
  Pages.findOne({pageTitle: "Homepage"}, (err, doc) => {
    if (err) {
      console.log(err)
    } if (doc) {
      res.render(path.join(__dirname + "/public/pages/public/index.pug"), doc.pageComponents)
    }
  })
    
  });

app.get("/smarthome-blog", (req, res) => {
  BlogPosts.find({}, (err, doc) => {
    if (err) {
      console.log(err)
    } if (doc) {
      let blogs = [];
      
      for (var i = 0; i < doc.length; i++) {
        let blogProps = {
          title: doc[i].title,
          excerpt: doc[i].excerpt,
          slug: doc[i].slug,
        }
        blogs.push(blogProps)
      }
      console.log(blogs)
      res.render(path.join(__dirname + "/public/pages/public/blogs.pug"),  {blogs: blogs})
    }
  })

})


app.get("/admin/pages/homepage", function(req, res) {
  if (req.userContext) {
  Pages.findOne({pageTitle: "Homepage"}, (err, doc) => {
    if (err) { 
      console.log(err)
    }
    if (doc) {
      console.log(doc.pageComponents)
      res.render(path.join(__dirname + "/public/pages/admin/edithomepage.pug"), doc.pageComponents)
    }
    else {
      console.log("here")
      res.render(path.join(__dirname + "/public/admin.pug"))
    }
  })
  
  } else {
    res.redirect("/login")
  }
})

/*
app.get("/admin/pages/:page_title", function(req, res) {
  if (req.userContext) {

  }
})
*/



app.get("/admin", (req, res) => {
  if (req.userContext) {
    var allPages = Pages.find({}, (err, doc) => {
      if (err) console.log(err);
      if (doc) {
        res.render(path.join(__dirname + "/public/pages/admin/adminhomepage.pug"), {username: req.userContext.userinfo.name, pages: doc})
      }
    });
    console.log(allPages)
   
  } else {
    res.redirect("/login")
  }
})

app.get("/admin/blogs/", (req, res) => {
  if (req.userContext) {
    BlogPosts.find({}, (err, doc) => {
      if (err) console.log(err);
      if (doc) {
        //res.render(path.join(__dirname + "/public/pages/admin/blogs"), {username: req.userContext.userinfo.name, blogs: doc})
        res.json({"message": "Hi"})
      }
    })
  } else {
    res.redirect("/login")
  }
})

app.get("/admin/blogs/new-post/", (req, res) => {
  if (req.userContext) {
  Pages.find({}, (err, doc) => {
    if (err) {
      console.log(err)
    } if (doc) {
      const allPages = doc
      res.render(path.join(__dirname + "/public/pages/admin/newblog.pug"), {pages: allPages, author: req.userContext.userinfo.name})
    }
  })
   
  } else {
    res.redirect("/login")
  }
})


/*API routes here*/

app.use("/api/pages", page)
app.use("/api/posts", blogs)

app.listen(port, () => console.log(`Server up and running on port ${port}`));