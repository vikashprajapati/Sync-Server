const { userRooms } = require("../store")
const { success, warning, error, highlight } = require('../logger')

module.exports = (io) => {
    
    const videoPlayback = function(playbackStatus){
        const socket = this
        
        console.log(success(`${playbackStatus} at ${userRooms[socket.id]}`))
        io.to(userRooms[socket.id]).emit("video playback", playbackStatus)
    }
    
    const videoChanged = function(playbackDirection){
        const socket = this
        
        console.log(success(`${playbackDirection} at ${userRooms[socket.id]}`))
        io.to(userRooms[socket.id]).emit("video changed", playbackDirection)
    }
    
    const videoSynced = function(playbackTimestamp){
        const socket = this
        
        console.log(success(`video synced at ${userRooms[socket.id]}`))
        io.to(userRooms[socket.id]).emit("video synced", playbackTimestamp)
    }

    return {
        videoPlayback,
        videoChanged,
        videoSynced
    }
}