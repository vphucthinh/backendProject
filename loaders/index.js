import http from 'http';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import compression from 'compression';
import { logger } from '../utils/logger.js';
import { config } from '../config/config.js';
import { routes } from '../routes/router.js';
import { normalizePort } from '../utils/port.js';
import { fileURLToPath } from 'url';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { scopePerRequest } from 'awilix-express';
import container from './register.js';
import 'dotenv/config';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AppLoader {
    constructor() {
        const app = express();

        // Set up middleware
        app.use(morgan('dev'));
        app.use(compression());
        app.use(express.urlencoded({ extended: false, limit: '20mb' }));
        app.use(cors());
        app.use(express.json());
        dotenv.config();

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
                        url: process.env.NODE_ENV === 'production' ? 'https://backendproject-webanddatabase.onrender.com' : `http://localhost:${config.port}`,
                        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
                    },
                ],
            },
            apis: ['./routes/*.js'], // Path to the API docs
        };

        const swaggerDocs = swaggerJsdoc(swaggerOptions);
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

        // Dependency injection
        app.use(scopePerRequest(container));

        if (app.get('env') === 'production') {
            app.set('trust proxy', 1); // trust first proxy
        }

        // Pass app to routes
        routes(app);

        // Create HTTP server.
        this.server = http.createServer(app);

        // Set up Socket.io
        this.io = new Server(this.server, {
            cors: {
                origin: '*', // Allow all origins (adjust this for security in production)
                methods: ['GET', 'POST'],
            },
        });

        // Listen for connection events
        this.io.on('connection', (socket) => {
            console.log(`User connected: ${socket.id}`);

            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.id}`);
            });

            // Add your custom event listeners here
        });

        // Make Socket.io globally available
        global.io = this.io;

        // Start application
        const port = normalizePort(config.port);
        this.server.listen(port, "0.0.0.0");
        this.server.on('error', AppLoader.onError);
        this.server.on('listening', AppLoader.onListening);

        // Setup error handling, this must be after all other middleware
        app.use(AppLoader.errorHandler);
    }

    get Server() {
        return this.server;
    }

    static errorHandler(error, req, res, next) {
        let parsedError;

        try {
            if (error && typeof error === 'object') {
                parsedError = JSON.stringify(error);
            } else {
                parsedError = error;
            }
        } catch (e) {
            logger.error(e);
        }

        logger.error(parsedError);

        if (res.headersSent) {
            return next(error);
        }

        res.status(400).json({
            success: false,
            error,
        });
    }

    static onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind = typeof port === 'string'
            ? `Pipe ${port}`
            : `Port ${port}`;

        switch (error.code) {
            case 'EACCES':
                logger.error(`${bind} requires elevated privileges`);
                process.exit(1);
            case 'EADDRINUSE':
                logger.error(`${bind} is already in use`);
                process.exit(1);

            default:
                throw error;
        }
    }

    static onListening() {
        logger.info(`Express running, now listening on port ${config.port}`);
        console.log(`Express running, now listening on port ${config.port}`);
    }
}

export default AppLoader;
