const mongoose = require('mongoose')

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const connectDb = async () => {
    const con = await mongoose.connect(process.env.MONGO_URI, connectionParams)
    console.log(`connected to db on ${con.connection.host}`.cyan.underline.bold)
}
// mongoose.connect(process.env.MONGO_URI, connectionParams)
//     .then(() => {
//         console.log(`Connected to db`)
//     }).catch((err) => {
//         console.log(`Something wen wrong \n${err}`)
//     })

// const connectDb = () => {
//     const conn = mongoose.connect(process.env.MONGO_URI, connectionParams)
//         .then(() => {
//             console.log(`Connected to db`)
//         }).catch((err) => {
//             console.log(`Something went wrong 😟\n${err}`)
//         })
// }
module.exports = connectDb