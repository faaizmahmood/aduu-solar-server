const express = require('express')

const app = express()

// PORT

const PORT = 5000

app.get('/', (req, res) => {
    res.json({
        "message": "Express is running"
    })
})

app.listen(PORT, () => {
    console.log('App is running at', PORT)
})