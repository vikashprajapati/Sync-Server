class Room{
    constructor(name, host){
        this.name = name
        this.host = host
        this.participants = []
        this.currentVideo = {}
        this.prevVideo = {}
        this.nextVideo = {}
    }

    getName() {
        return this.name
    }

    getHost() {
        return this.host
    }

    getParticipants(){
        return this.participants
    }

    addParticipant(particpant){
        this.participants.push(particpant)
    }

    getCurrentVideo(){
        return this.currentVideo
    }

    setNextVideo(video){
        this.nextVideo = video
    }

    getNextVideo(){
        return this.nextVideo
    }

    setPreviousVideo(video){
        this.prevVideo = video
    }    

    getPreviousVideo(){
        return this.prevVideo
    }
}

module.exports = Room