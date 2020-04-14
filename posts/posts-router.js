const express = require('express')
const db = require('../data/db.js')

const router = express.Router()

// route handler for handling get requests for the posts resource
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

// route handler for handling get repuests for post by id
router.get('/:id', (req, res) => {
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
		.catch(err => {
			console.log(err)
			res.status(500).json({
				message: 'Error: The post information could not be retrieved',
			})
		})
})

// route handler for getting comments associated with a post specified by post id
router.get('/:id/comments', (req, res) => {
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
		.catch(err => {
			console.log(err)
			res.status(500).json({
				message: 'Error: The comments information could not be retrieved.',
			})
		})
})

// route handler for adding a new post
router.post('/', (req, res) => {
	const { title, contents } = req.body
	if (!title || !contents) {
		res.status(400).json({
			errorMessage: 'Please provide a title and contents for the post',
		})
	} else {
		db
			.insert(req.body)
			.then(id => {
				db
					.findById(id)
					.then(post => {
						return res.status(201).json(post)
					})
					.catch(err => console.error('Error: ', err))
			})
			.catch(err => {
				console.log(err)
				res.status(500).json({
					message: 'error: there was an error saving the post to the database',
				})
			})
	}
})

// route handler for adding a new comment
router.post('/:id/comments', (req, res) => {
	const { id } = req.params.id
	const { text } = req.body
	const comment = { ...req.body, post_id: id }
	if (!text) {
		res.status(400).json({
			errorMessage: 'Please provide text for the comment.',
		})
	} else {
		db
			.findById(id)
			.then(post => {
				if (!post.length) {
					res.status(404).json({
						message: 'The post with the specified ID does not exist.',
					})
				} else {
					db
						.insertComment(comment)
						.then(comment => {
							res.status(201).json(comment)
						})
						.catch(err => {
							res.status(500).json({
								error: 'There was an error while saving the comment to the database',
							})
						})
				}
			})
			.catch(err => {
				res.status(500).json(err)
			})
	}
})

// route handler for editing a post
router.put('/:id', (req, res) => {
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
					res.status(200).json(updated)
				} else {
					res.status(404).json({
						message: 'The post with the specified ID does not exist.',
					})
				}
			})
			.catch(err => {
				console.log(err)
				res.status(500).json({
					error: 'The post information could not be modified',
				})
			})
	}
})

// route handler for deleting a post
router.delete('/:id', (req, res) => {
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
		.catch(err => {
			console.log(err)
			res.status(500).json({
				error: 'The post could not be removed',
			})
		})
})

module.exports = router
