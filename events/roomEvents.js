const { users, rooms, userRooms } = require('../store')
const { success, warning, error, highlight } = require('../logger')
const { json } = require('express')

module.exports = (io) => {
    const joinRoom = function(room, user){
        const socket = this
        
        room = JSON.parse(room)
        user = JSON.parse(user)

        if(!io.sockets.adapter.rooms.has(room.name)){
            // create a new room, set the room host & add participants
            let newRoom = {
                name : room.name,
                host : user.name,
                participants : [
                    {
                        id : socket.id,
                        name : user.name
                    }
                ]
            }
            rooms.push(newRoom)
            console.log(success(`${newRoom.name} room is created`));
            
            socket.emit("joined room response", {
                room : newRoom
            })
            console.log(success(`joining user in new room ${newRoom.name}, participants count ${newRoom.participants.length}`));
            
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
                        room : rooms[index]
                    })
                    console.log(success(`joining user in existing room ${rooms[index].name}, participants count ${rooms[index].participants.length}`));
                    break;
                }
            }
        }
        
        // join the room 
        socket.join(room.name)
        console.log(success(`${user.name} joined room ${room.name} \n`))
        
        userRooms[socket.id] = room.name
        users.push({
            id : socket.id,
            name : user.name
        })
    } 

    return {
        joinRoom
    }
}