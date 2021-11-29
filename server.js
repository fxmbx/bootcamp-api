const express = require('express')
const dotenv = require('dotenv')

const morgan = require('morgan')
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const connectDb = require('./config/db')
const errorHandler = require('./middleware/error')
const colors = require('colors')

dotenv.config({ path: './config/config.env' })

connectDb();

const app = express()

//req.body parser 
app.use(express.json())

const logger = require('./middleware/logger')

// //logger middleware
// const logger = (req, res, next) =>{

//     console.log(`Middleware ran ${req.method} ${req.protocol}:// ${req.get('host')} ${req.originalUrl}`)
//     next() // tells the middleware to move on to the next middleware in the cycle
// }

// app.use(logger) ; //uses the middle ware
//Dev login middelware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//mount routers
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => { console.log(`server running in ${process.env.NODE_ENV} on port ${PORT}...😃`.blue.bold) })


//handle unhandled primise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Opps unhandled rejection😟\nError : ${err.message}`.red)
    server.close(() => { process.exit(1) })
})