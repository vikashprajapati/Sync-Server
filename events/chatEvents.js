const { error, warning, success } = require('../logger')
const { users, rooms, userRooms } = require('../store')

module.exports = (io) => {
    const onMessage = function(receiverId, message){
        const socket = this
        console.log(success(`message received from client ${socket.id}`))
        console.log(message)
        io.to(receiverId).emit("on message", message)       
    }

    return {
        onMessage
    }
}