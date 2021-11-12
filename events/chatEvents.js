const { json } = require('express')
const { error, warning, success } = require('../logger')
const { users, rooms, userRooms } = require('../store')

module.exports = (io) => {
    const onMessage = function(payload){
        const socket = this
        
        payload = JSON.parse(payload)
        payload["from"]= socket.id

        console.log(success(JSON.stringify(payload)))
        io.to(userRooms[socket.id]).emit("on message", JSON.stringify(payload))       
    }

    return {
        onMessage
    }
}