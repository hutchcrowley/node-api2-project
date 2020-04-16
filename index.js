const express = require('express')
const morgan = require('morgan')
const welcomeRouter = require('./welcome/welcome-router')
const postsRouter = require('./posts/posts-router')

const server = express()
const port = 3000

server.use(express.json())
server.use(morgan())
server.use('/api', welcomeRouter)
server.use('/api/posts', postsRouter)

// middleware function to handle no route
server.use((req, res) => {
	res.status(404).json({
		message: 'Route was not found',
	})
})

// error handling middleware
server.use((err, req, res, next) => {
	console.log(err)
	res.status(500).json({
		message: 'Something went wrong',
	})
})

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})
