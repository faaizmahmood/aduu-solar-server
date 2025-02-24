const express = require('express')

const app = express()

// PORT

const PORT = 5000

app.listen(PORT, ()=>{
    console.log('App is running at', PORT)
})