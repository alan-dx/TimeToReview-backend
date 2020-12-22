const express = require('express')
const authRoutes = require('./routes/authRoutes')
const appRoutes = require('./routes/appRoutes')

const cors = require('cors')

const app = express()

app.use(express.json())
app.use(authRoutes)
app.use(appRoutes)
app.use(cors())

//VERIFICAR O QUE HOUVE COM O SERVER
//not found - middleware
app.use((req,res,next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})

//catch all - middleware
app.use((error,req,res,next) => {
    res.status(error.status || 500)
    res.json({ error: error.message })
})


app.listen(3333, () => {
    console.log(`Server running`)
})