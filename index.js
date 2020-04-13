const express = require('express')
const welcomeRouter = require('./welcome/welcome-router')
const postsRouter = require('./posts/posts-router')

const server = express()
const port = 4000

server.use(express.json())
server.use('./welcome', welcomeRouter)
server.use('./posts', postsRouter)

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})