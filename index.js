const { Console } = require('console')
const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const server = http.createServer(app)
const io = new Server(server)

// user modules imports
const { joinRoom } = require('./room')(io)
const { connections } = require('./store')
const { success, warning, error, highlight } = require('./logger')

// constants
const PORT = 5000

// socket connection callbacks
const onConnection = (socket) => {
    console.log(`connection opened by ${socket.id}`);
    connections.push(socket.id)

    socket.on("join room", joinRoom)

    socket.on("onMessage", (anotherSocket, message) => {
        console.log(`message received from client ${anotherSocket}`)
        console.log(message)
        socket.broadcast.emit("onMessage", message)
    })
}

// socket connection
io.on("connection", onConnection)

function doesRoomExist(roomInfo) {
    for (const room in rooms) {
        if(roomInfo.name == room.name) return true
    }
    return false
}

app.get('/', (req, res) => {
    res.send('<h1>Server is running</h1>')
})

// server listening
server.listen(PORT, () => {
    console.log(highlight(`\nServer started at port ${PORT}\n`))
})