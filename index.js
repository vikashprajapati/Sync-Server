const express = require('express')
const app = express()

const PORT = 5000


app.get('/', (req, res) => {
    res.send("hello boy! Welcome to the homepage.")
})


app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})