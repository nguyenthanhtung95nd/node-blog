const BlogPost = require('../models/BlogPost.js')
module.exports = (req, res) => {
    BlogPost.find({}, function (error, posts) {
        res.render('index', {
            blogposts: posts
        });
    })
}