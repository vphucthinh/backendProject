import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import 'dotenv/config';
import dotenv from 'dotenv';
import morgan from 'morgan'
import profileRouter from "./routes/profileRoute.js";




// App config
const app = express();
const port = 4000;
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
                url: process.env.NODE_ENV === 'production' ? 'https://backendproject-qrnu.onrender.com' : `http://localhost:${port}`,
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
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/profile', profileRouter)

app.get('/', (req, res) => {
    res.send('API Working');
});

// Start the server
app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});