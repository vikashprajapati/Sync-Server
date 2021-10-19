const { Console } = require('console')
const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const server = http.createServer(app)
const io = new Server(server)

// constants
const PORT = 5000
const connections = []
const users = []
const rooms = []
const userRooms = {}

// socket events
io.on("connection", (socket) => {
    console.log(`connection opened by ${socket.id}`);
    connections.push(socket.id)
    socket.on("join room", (room, user) => {
        
        
        console.log(io.sockets.adapter.rooms.has(room.name));
        if(!io.sockets.adapter.rooms.has(room.name)){
            // create a new room, set the room host & add participants
            let newRoom = {
                name : room.name,
                host : socket.id,
                participants : [
                    {
                        id : socket.id,
                        name : user.name
                    }
                ]
            }
            rooms.push(newRoom)
            console.log(`${room.name} room is created`);
            
            socket.emit("joined room response", {
                room : newRoom
            })
            console.log(`joining user in new room ${room.name}, participants count ${newRoom.participants.length}`);
            
        }else{
            // update participant list in room
            let index = 0
            for (; index < rooms.length; index++) {
                if(rooms[index].name == room.name){
                    rooms[index].participants.push({
                        id : socket.id,
                        name : user.name
                    })
                    
                    socket.emit("joined room response", {
                        room : room[index]
                    })
                    console.log(`joining user in existing room ${room.name}, participants count ${rooms[index].participants.length}`);
                    break;
                }
            }
        }
        
        // join the room 
        socket.join(room.name)
        console.log(`${user.name} joined room ${room.name}`)
        userRooms[socket.id] = room.name
        users.push({
            id : socket.id,
            name : user.name
        })
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
        // socket.to(room).emit("client disconnected", {
        //     clientId : clientId
        // })
    })
})

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
    console.log(`Server started at port ${PORT}`)
})