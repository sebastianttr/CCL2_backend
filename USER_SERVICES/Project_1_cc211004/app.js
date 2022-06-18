const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')

require("dotenv").config();

const app = express()

// DO NO CHANGE THIS. CHANGING IT WILL NOT WORK.
const port = process.env.port

const ejs = require('ejs')
const path = require('path')

const homeRoute = require('./routes/index')
const usersRouter = require('./routes/users')
const testRouter = require("./routes/testRoute")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    createParentPath: true
}))
app.use(express.static('./public'))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// 
app.use('/', homeRoute)
app.use('/users', usersRouter)
app.use("/testRoute", testRouter)

// 
app.use((req, res) => {
    res.status(404).render('errorEJS')
})

// 
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})