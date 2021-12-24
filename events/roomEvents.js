const { users, rooms, userRooms } = require('../store')
const { success, warning, error, highlight } = require('../logger')
const { json } = require('express')
const { emit } = require('nodemon')

const getRandomHostId = (room) => {
    const high = room.participants.length
    let randomIndex = Math.floor(Math.random() * high)
    return room.participants[randomIndex].id
}

module.exports = (io) => {
    const joinRoom = function(params){
        const socket = this
        
        params = JSON.parse(params)
        
        if(!io.sockets.adapter.rooms.has(params.room.name)){
            // create a new room, set the room host & add participants
            let newRoom = {
                name : params.room.name,
                host : socket.id,
                participants : [
                    {
                        id : socket.id,
                        name : params.user.name,
                        status: "online"
                    }
                ],
                currentVideoUrl : "https://www.youtube.com/watch?v=cfVY9wLKltA"
            }
            
            // save new room details
            rooms.push(newRoom)
            console.log(success(`${newRoom.name} room is created`));
            
            // send new room details to the client
            io.to(socket.id).emit("joined room response", {
                room : newRoom,
                user : {
                    id : socket.id,
                    name : params.user.name
                }
            })
            console.log(success(`joining user in new room ${newRoom.name}, participants count ${newRoom.participants.length}`));
            
        }else{
            // update participant list in room
            const roomIndex = rooms.findIndex(room => room.name === params.room.name)
            
            if(roomIndex != -1){
                const newUser = {
                    id : socket.id,
                    name : params.user.name,
                    status : "online"
                }
                // update the participant details of the room
                rooms[roomIndex].participants.push(newUser)
                
                // send the room details to the newly joined client
                io.to(socket.id).emit("joined room response", {
                    room : rooms[roomIndex],
                    user : newUser
                })
                
                // notify all users available in the room for the arrival of the new joined user
                socket.to(params.room.name).emit("participant joined", JSON.stringify(newUser))
                console.log(success(`joining user in existing room ${rooms[roomIndex].name}, participants count ${rooms[roomIndex].participants.length}`));
            }
        }
        
        // join the room 
        socket.join(params.room.name)
        console.log(success(`${params.user.name} joined room ${params.room.name} \n`))
        
        // store userid -> roomname mapping
        userRooms[socket.id] = params.room.name
        
        // save user details
        users.push({
            id : socket.id,
            name : params.user.name
        })
    }
    
    const userLeft = function(){
        const socket = this
        console.log(success(`received leave room from ${socket.id}`));
        const userId = socket.id
        const roomName = userRooms[userId]
        const roomIndex = rooms.findIndex(room => room.name === roomName)
        if(roomIndex < 0) return;
        console.log(success(`room index ${roomIndex}`));
        
        // remove the user person from its personal room
        socket.leave(userId)
        // remove user from the joined public room
        socket.leave(roomName)
        console.log(success(`user left private and public rooms`));
        
        // remove user from users list
        const userIndex = users.findIndex(user => user.id == userId)
        users.splice(userIndex, 1)
        console.log(success(`removed user info from users list: ${users}`));
        
        // remove user from participant list of room
        const participantCount = rooms[roomIndex].participants.length
        let participants = rooms[roomIndex].participants
        rooms[roomIndex].participants = participants.filter(participant => {
            return participant.id != userId
        })
        if(participantCount > rooms[roomIndex].participants.length){
            console.log(success(`participant ${userId} removed from room ${roomName}`));
        }else{
            console.log(error(`participant ${userId} not found in room ${roomName}`));
        }
        
        // check user was host of the room?
        if(userId === rooms[roomIndex].host){
            console.log(success(`left user ${userId} was the host, selecting new host`));
            let newHost;
            if(rooms[roomIndex].participants.length !== 0){
                // make new random host
                newHost = getRandomHostId(rooms[roomIndex])
                console.log(success(`new host selected randomly ${newHost}`));
                // emit new host to clients
                io.to(roomName).emit("set host", newHost)
            }else{
                newHost = -1
                console.log(warning(`room is empty, host left. Room will be destroyed now!`));
                rooms.splice(roomIndex, 1)
            }
        }
        
        // remove user mapping from userroom map
        delete userRooms[userId]
        
        // emit userLeft to all partiicipant in the room except the sender
        let leftUser = participants[userIndex]
        io.to(roomName).emit("participant left", JSON.stringify(leftUser))
        
        console.log(rooms);
        console.log(users);
        console.log(userRooms);
        console.log(io.sockets.adapter.rooms);
    }
    
    return {
        joinRoom,
        userLeft
    }
}