const express = require('express')
const db = require('../data/db.js')

const router = express.Router()

module.exports = router

// endpoint for handling get requests for the posts resource
router.get('/', (req, res) => {
    console.log(req.query)
    db
    .find()
    .then(posts => {
        if (posts) {
            res.status(200).json(posts)
        } else {
            res.status(500).json({
                message: 'Error: The posts information could not be retrieved',
            })
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            message: 'Error retrieving the posts',
        })
    })
})

// endpont for handling get repuests for post by id
router.get('/:id', (req, res) => {
    db.findById(req.params.id)
    .then(post => {
        if (post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({
                message: 'The post with the specified ID does not exist'
            })
        }

    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: 'Error: The post information could not be retrieved',
        })
    })
})

// endpoint for getting comments associated with a post specified by post id
router.get('/:id/comments', (req, res) => {
    db.findPostComments(req.params.id)
    .then(comments => {
        if (comments) {
            res.status(200).json(comments)
        } else {
            res.status(404).json({
                message: 'The post wit hthe specified ID does not exist.',
            })
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: 'Error: The comments information could not be retrieved.'
        })
    })
})

