const express = require('express')
const posts = require('../data/db')

const postsRouter = express.Router()

module.exports = postsRouter

// first endpoint for handling get requests
postsRouter.get('/', (req, res) => {
    console.log(req.query)
    users
    .find()
    .then(posts => {
        res.status(200).json(users)
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            message: 'Error retrieving the posts',
        })
    })
})