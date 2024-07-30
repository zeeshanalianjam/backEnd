import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "10kb"})) //using from data or json data 
app.use(express.urlencoded({extended: true, limit: "10kb"})) //using for url data
app.use(express.static("public")) //using for file upload or pdf , image etc 
app.use(cookieParser()) //using for hot get or set access with user browser to the help of server 

export { app }