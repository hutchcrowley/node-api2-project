const express = require('express')
const morgan = require('morgan')
const welcomeRouter = require('./welcome/welcome-router')
const postsRouter = require('./posts/posts-router')

const server = express()
const port = 3000

server.use(express.json())
server.use(morgan())
server.use('/', welcomeRouter)
server.use('/posts', postsRouter)

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})
