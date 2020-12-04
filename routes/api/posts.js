const express = require("express");
const router = express.Router();


const db = require("../../services/dbcalls")
const posts = require("../../models/BlogPosts")

router.post("/new-blog", (req, res) => {
    let searchParams = {title: req.body.title};
    db.saveToDb(req, res, searchParams, posts)
})

router.get("/retrieve-blogs/", (req, res) => {
    db.findAll(req, res, {}, posts)
})


module.exports = router