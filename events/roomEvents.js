const { users, rooms, userRooms } = require('../store')
const { success, warning, error, highlight } = require('../logger')
const { json } = require('express')
const { emit } = require('nodemon')

const findRoom = (roomName) => {
    for (let i = 0; i < rooms.length; i++) if (roomName === rooms[i].name) return i

    throw new Error("Room does not exist.")
}

const getRandomHostId = (room) => {
    const high = rooms[findRoom(room.name)].participants.length
    return rooms.participants[Math.floor(Math.random() * high)].id
}

module.exports = (io) => {
    const joinRoom = function(params){
        const socket = this
        
        params = JSON.parse(params)

        if(!io.sockets.adapter.rooms.has(params.room.name)){
            // create a new room, set the room host & add participants
            let newRoom = {
                name : params.room.name,
                host : params.user.name,
                participants : [
                    {
                        id : socket.id,
                        name : params.user.name
                    }
                ]
            }

            // save new room details
            rooms.push(newRoom)
            console.log(success(`${newRoom.name} room is created`));
            
            // send new room details to the client
            io.to(socket.id).emit("joined room response", {
                room : newRoom
            })
            console.log(success(`joining user in new room ${newRoom.name}, participants count ${newRoom.participants.length}`));
            
        }else{
            // update participant list in room
            let index = 0
            for (; index < rooms.length; index++) {
                if(rooms[index].name == params.room.name){
                    // update the participant details of the room
                    rooms[index].participants.push({
                        id : socket.id,
                        name : params.user.name
                    })
                    
                    // send the room details to the newly joined client
                    io.to(socket.id).emit("joined room response", {
                        room : rooms[index]
                    })
                    console.log(success(`joining user in existing room ${rooms[index].name}, participants count ${rooms[index].participants.length}`));
                    break;
                }
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

    const userLeft = function(room, user){
        const socket = this

        room = JSON.parse(room)
        user = JSON.parse(user)

        // check user was host of the room?
        if(user.id === rooms[findRoom(room.name)].host){
            // make new host
            const newHost = getRandomHostId(room)
            console.log(success(`new host selected randomly ${newHost}`));
            // emit new host to clients
            io.to(room.name).emit("set host", newHost)
        }

        // removes the users person room created with its own user id
        socket.leave(room.name)
        
        // remove user from users array
        for (let index = 0; index < users.length; index++) {
            console.log("users "+users[index]);
            console.log("user "+user);
            if(users[index].id == user.id){
                users.splice(index, 1)
                console.log("user found and removed");
                break;
            }
        }

        // remove user from participant list of room
        const roomIndex = findRoom(room.name)
        rooms[roomIndex].participants = rooms[roomIndex].participants.filter(participant => {
            participant.id != user.id
        })

        // remove user mapping from userroom hashmap
        
        // emit userLeft to all partiicipant in the room except the sender
        io.to(room.name).emit("user left", user)

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