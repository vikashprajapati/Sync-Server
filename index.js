const { Console } = require('console')
const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const server = http.createServer(app)
const io = new Server(server)

// user modules imports
const { joinRoom } = require('./events/roomEvents')(io)
const { onMessage } = require('./events/chatEvents')(io)
const { connections } = require('./store')
const { highlight } = require('./logger')

// constants
const PORT = 5000

// socket connection callbacks
const onConnection = (socket) => {
    console.log(highlight(`connection opened by ${socket.id}`));
    connections.push(socket.id)

    socket.on("join room", joinRoom)

    socket.on("on message", onMessage)
}

// socket connection
io.on("connection", onConnection)

// server listening
server.listen(PORT, () => {
    console.log(highlight(`\nServer started at port ${PORT}\n`))
})