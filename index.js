const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const server = http.createServer(app)
const io = new Server(server)

// constants
const PORT = 5000
const THEATER_ROOM = "Theater 1"

// socket events
io.on("connection", (socket) => {
    console.log(`connection opened by ${socket.id}`);
    socket.join(THEATER_ROOM)
    socket.to(socket.id).emit("Theater Joined", "Success")
    socket.on("onMessage", (anotherSocket, message) => {
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
    })
})

app.get('/', (req, res) => {
    res.send('<h1>hello boy! Welcome to the homepage.</h1>')
})

// server listening
server.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})