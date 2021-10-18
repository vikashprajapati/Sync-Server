const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const server = http.createServer(app)
const io = new Server(server)

// constants
const PORT = 5000
const THEATER_ROOM = "Theater 1"
const connections = []
const users = []
const userRooms = {}

// socket events
io.on("connection", (socket) => {
    console.log(`connection opened by ${socket.id}`);
    connections.push(socket.id)
    
    // initially getting the already created room info
    socket.emit("joinRoomInfo")
    socket.on("roomJoinInfo", (roomInfo) => {
        socket.join(roomInfo)
        userRooms[socket.id] = roomInfo
        console.log(`room ${roomInfo} joined`)
        
        // send information of all participants within this room to newly joined user
    }).on("onMessage", (anotherSocket, message) => {
        console.log(`message received from client ${anotherSocket}`)
        console.log(message)
        socket.broadcast.emit("onMessage", message)
    }).on("played", (theater) => {
        console.log(`video played at ${theater}`)
        socket.broadcast.emit("played")
    }).on("paused", (theater) => {
        console.log(`video paused at ${theater}`)
        socket.broadcast.emit("paused")
    }).on("previousVideo", (theater) => {
        console.log(`previous video at ${theater}`)
        socket.broadcast.emit("previousVideo")
    }).on("disconnect", (clientId) => {
        console.log(`client ${clientId} disconnected`)
        socket.to(room).emit("client disconnected", {
            clientId : clientId
        })
    })
})

app.get('/', (req, res) => {
    res.send('<h1>Server is running</h1>')
})

// server listening
server.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})