import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import connectDb from './config/database.js';
import errorHandler from './middleware/errorHandler.js';
import authRoute from './routes/authRoute.js'
import sessionRoute from './routes/sessionRoute.js'



dotenv.config();


const app =express();
const PORT = process.env.PORT;


const corsOption = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Allow localhost for development
        if (origin.includes('localhost')) return callback(null, true);
        
        // Allow all vercel.app domains
        if (origin.endsWith('.vercel.app') || origin === 'https://livemetting-ppx9081bv-anisur-rohamn-rohamns-projects.vercel.app') {
            return callback(null, true);
        }
        
        // Allow CLIENT_URL from env
        if (origin === process.env.CLIENT_URL) {
            return callback(null, true);
        }
        
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOption));
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/api/health', (req,res) => {
    res.json({
        status: 'OK',
        message:'Live meeting server is running',
        timestamp:new Date().toISOString()
    })
})
 
//Api routes
app.use('/api/auth',authRoute)
app.use('/api/session',sessionRoute)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

connectDb();
