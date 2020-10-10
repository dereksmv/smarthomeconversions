const express = require("express");
const router = express.Router();


const db = require("../../services/dbcalls")
const pages = require("../../models/Pages")

router.post("/new-page", (req, res) => {
    console.log(req.body)
    let searchParams = req.body;
    db.saveToDb(req, res, searchParams, pages)
})


module.exports = router