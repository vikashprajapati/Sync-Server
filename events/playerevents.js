const { userRooms } = require("../store")
const { success, warning, error, highlight } = require('../logger')

module.exports = (io) => {
    
    const videoPlayback = function(playbackStatus){
        const socket = this
        let payload = {
            id : socket.id,
            playbackStatus: playbackStatus
        }
        console.log(success(`${playbackStatus} at room ${userRooms[socket.id]}`))
        io.to(userRooms[socket.id]).emit("video playback", JSON.stringify(payload))
    }
    
    const videoChanged = function(playbackDirection){
        const socket = this
        let payload = {
            id : socket.id,
            playbackDirection: playbackDirection
        }
        console.log(success(`${playbackDirection} at room ${userRooms[socket.id]}`))
        io.to(userRooms[socket.id]).emit("video changed", JSON.stringify(payload))
    }
    
    const videoSynced = function(playbackTimestamp){
        const socket = this
        let payload = {
            id : socket.id,
            playbackTimestamp: playbackTimestamp
        }
        console.log(success(`video synced at ${userRooms[socket.id]}`))
        io.to(userRooms[socket.id]).emit("video synced", JSON.stringify(payload))
    }

    return {
        videoPlayback,
        videoChanged,
        videoSynced
    }
}