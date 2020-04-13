const express = require('express')
const welcomeRouter = require('./welcome/welcome-router')
const postsRouter = require('./posts/posts-router')

const server = express()
const port = 3000

server.use(express.json())
server.use('/', welcomeRouter)
server.use('/posts', postsRouter)

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})