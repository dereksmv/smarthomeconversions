const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pagesSchema = new Schema({
    pageTitle: {
        type: String,
        required: true
    },

    pageComponents: {
            type: Object,
            default: {},
            required: true
    }

})

module.exports = pages = mongoose.model("pages", pagesSchema);