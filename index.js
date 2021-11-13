const { Console } = require('console')
const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const server = http.createServer(app)
const io = new Server(server)

// user modules imports
const { videoPlayback, videoChanged, videoSynced } = require('./events/playerEvents')(io)
const { joinRoom, userLeft } = require('./events/roomEvents')(io)
const { onMessage } = require('./events/chatEvents')(io)
const { connections } = require('./store')
const { highlight } = require('./logger')

// constants
const PORT = 5000
app.set('port', (process.env.PORT || PORT));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
 });

// socket connection callbacks
const onConnection = (socket) => {
    console.log(highlight(`connection opened by ${socket.id}`));
    connections.push(socket.id)

    socket.on("join room", joinRoom)

    socket.on("on message", onMessage)

    socket.on("leave room", userLeft)

    socket.on("video playback", videoPlayback)

    socket.on("video changed", videoChanged)

    socket.on("video synced", videoSynced)
}

// socket connection
io.on("connection", onConnection)

// server listening
server.listen(app.get('port'), () => {
    console.log(highlight(`\nServer started at port ${PORT}\n`))
})