import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import postRoutes from './routes/post.js'
import userRoutes from './routes/user.js'
import messageRoutes from './routes/message.js'
import {app,io,server} from './socket.js'


dotenv.config()



app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(cors())

app.use('/posts',postRoutes)
app.use('/user',userRoutes)
app.use('/messages',messageRoutes)




const port = process.env.PORT || 5000
const MONGODB_URL=process.env.MONGODB_URL
mongoose.connect(MONGODB_URL)
    .then(() => server.listen(port, () => console.log(`Server is running on port ${port}`)))
    .catch((error) => console.error('Error connecting to MongoDB:', error));