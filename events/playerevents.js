const { userRooms } = require("../store")
const { success, warning, error, highlight } = require('../logger')

module.exports = (io) => {
    
    const videoPlayback = function(playbackStatus){
        const socket = this
        let payload = {
            userId : socket.id,
            playbackStatus: playbackStatus
        }
        console.log(success(`${playbackStatus} at room ${userRooms[socket.id]}`))
        io.to(userRooms[socket.id]).emit("video playback", JSON.stringify(payload))
    }
    
    const videoChanged = function(payload){
        const socket = this
        console.log(success(`${payload} at room ${userRooms[socket.id]}`))
        io.to(userRooms[socket.id]).emit("video changed", payload)
    }
    
    const videoSynced = function(playbackTimestamp){
        const socket = this
        let payload = {
            userId : socket.id,
            playbackTimestamp: playbackTimestamp
        }
        console.log(success(`video synced at ${userRooms[socket.id]}`))
        io.to(userRooms[socket.id]).emit("video synced", JSON.stringify(payload))
    }

    const newVideoSelected = function(videoUrl){
        const socket = this
        console.log(success(`new video played at ${userRooms[socket.id]}`))
        io.to(userRooms[socket.id]).emit("new video played", videoUrl)
    }

    return {
        videoPlayback,
        videoChanged,
        videoSynced,
        newVideoSelected
    }
}