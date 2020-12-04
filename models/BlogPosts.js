const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    author: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    tags: {
        type: Array,
        default: []
    },

    published: {
        type: Boolean,
        default: false
    },

    post: {
        type: String,
        required: true
    },
    
    image: {
        type: String,
        required: false
    },

    slug: {
        type: String,
        required: true
    }, 

    excerpt: {
        type: String,
        required: true
    }

})

module.exports = blog_posts = mongoose.model("blog_posts", postSchema);