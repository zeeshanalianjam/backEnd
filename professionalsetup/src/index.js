// import mongoose from 'mongoose'
// import DB_NAME from './constants'
// import express from 'express'
// const app = express()
import dotenv from 'dotenv'
import DBConnect from './db/index.js'

dotenv.config({
    path: './.env'
})



DBConnect()
.then(() => {
    app.on('Error', (ERR) => {
        console.log(`Error from Express App Listener :: ${ERR}`);
    })
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Port listening on ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log(`Mongo db Connection Error !!! ${error} `);
})












// ;( async () => {
//     try {
//        await mongoose.connection(`${process.env.MONOGODB_URL}/${DB_NAME}`)
//         app.on("errorr", (error) => {
//             console.log("ERROR FROM EXPRESS APP LISTENER ", error );
//         })
//         app.listen(process.env.PORT, () => {
//             console.log(`App is listening on PORT ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.log("ERROR in catch ", error)

//     }
// })()