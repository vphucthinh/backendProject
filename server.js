import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import authRouter from './routes/authRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';
import dotenv from 'dotenv';
import morgan from 'morgan'
import userRouter from "./routes/userRoute.js";
import chatRoomRouter from "./routes/chatRoomRoute.js";
import WebSockets from "./utils/webSocket.js";
import {Server} from "socket.io";
import * as http from "node:http";




// App config
const app = express();
const port = process.env.PORT || 4000;
app.use(morgan('dev'));
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API with Swagger',
            version: '1.0.0',
            description: 'A simple Express API application with Swagger documentation',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{
            bearerAuth: []
        }],
        servers: [
            {
                url: process.env.NODE_ENV === 'production' ? 'https://backendproject-webanddatabase.onrender.com/' : `http://localhost:${port}`,
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API endpoints
app.use('/api/food', foodRouter);
app.use('/images', express.static('uploads'));
app.use('/api/user', authRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/profile', userRouter);
app.use('/api/chat', chatRoomRouter);

app.get('/', (req, res) => {
    res.send('API Working');
});

const server = http.createServer(app);

// Create socket connection
const io = new Server(server);
global.io = io;
io.on('connection', (socket) => {
    console.log('New socket connection established:', socket.id);
    WebSockets.connection(socket);
});

// Start the server
server.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});