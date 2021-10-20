module.exports = (io) => {

    player = function(){
        const socket = this

        socket.on("played", (theater) => {
            console.log(`video played at ${theater}`)
            socket.broadcast.emit("played")
        })
    
        socket.on("paused", (theater) => {
            console.log(`video paused at ${theater}`)
            socket.broadcast.emit("paused")
        })
        
        socket.on("previousVideo", (theater) => {
            console.log(`previous video at ${theater}`)
            socket.broadcast.emit("previousVideo")
        })
    }
}