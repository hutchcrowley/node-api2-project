const express = require('express')
const db = require('../data/db.js')

const router = express.Router()

// route handler for handling get requests for the posts resource
router.get('/', (req, res, next) => {
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
		.catch(next)
})

// route handler for handling get repuests for post by id
router.get('/:id', (req, res, next) => {
	db
		.findById(req.params.id)
		.then(post => {
			if (post) {
				res.status(200).json(post)
			} else {
				res.status(404).json({
					message: 'The post with the specified ID does not exist',
				})
			}
		})
		.catch(next)
})

// route handler for getting comments associated with a post specified by post id
router.get('/:id/comments', (req, res, next) => {
	db
		.findPostComments(req.params.id)
		.then(comments => {
			if (comments) {
				res.status(200).json(comments)
			} else {
				res.status(404).json({
					message: 'The post wit hthe specified ID does not exist.',
				})
			}
		})
		.catch(next)
})

// route handler for adding a new post
router.post('/', (req, res, next) => {
	let data = req.body
	if (!data.title || !data.contents) {
		return res.status(400).json({
			errorMessage: 'Please provide title and contents for the post',
		})
	}
	db.insert(data).then(postId => {
		db
			.findById(postId.id)
			.then(post => {
				res.status(201).json(post)
			})
			.catch(err => next(err))
	})
})

// route handler for adding a new comment
router.post('/:id/comments', (req, res, next) => {
	// extract ID parameter from request URL
	const id = req.params.id
	console.log('id variable: ', id)
	// extract request body object item: text from req.body
	const text = req.body.text
	console.log('text variable: ', text)
	// format comment object to be sent to database
	const comment = { post_id: id, text: text }
	console.log('comment object: ', comment)
	// check to see if request contains a text string
	if (!text) {
		// return an error if not
		res.status(400).json({
			errorMessage: 'Please provide text for the comment.',
		})
	} else {
		// if so, check to see if the post id matches an existing post to add the comment to using the posts findById method
		db
			.findById(id)
			.then(post => {
				// check to make sure the post object has been returned
				if (!post) {
					// if not, throw this error
					res.status(404).json({
						message: 'The post with the specified ID does not exist.',
					})
				} else {
					// if so, add the comment to the post using the comment .insertComment method
					db
						.insertComment(comment)
						.then(comment => {
							res.status(201).json(comment)
						})
						// sends any errors to the error handling middleware
						.catch(next)
				}
			})
			// send any errors to the error handling middleware
			.catch(next)
	}
})

// route handler for editing a post
router.put('/:id', (req, res, next) => {
	const post = req.body
	const { id } = req.params
	if (!req.body.title || !req.body.contents) {
		res.status(400).json({
			errorMessage: 'Please provide title and contents for the post.',
		})
	} else {
		db
			.update(id, post)
			.then(updated => {
				if (updated) {
					res.status(200).json({
						message: 'Post successfully updated!',
						updated,
					})
				} else {
					res.status(404).json({
						message: 'The post with the specified ID does not exist.',
					})
				}
			})
			.catch(next)
	}
})

// route handler for deleting a post
router.delete('/:id', (req, res, next) => {
	const { id } = req.params
	db
		.remove(id)
		.then(post => {
			if (post) {
				res.status(200).json({
					message: 'The post has been deleted',
				})
			} else {
				res.status(404).json({
					message: 'The post with the specified ID does not exist.',
				})
			}
		})
		.catch(next)
})

module.exports = router
