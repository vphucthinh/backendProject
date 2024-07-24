/**
 * Module dependencies.
 */
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
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import {scopePerRequest} from "awilix-express";
import container from "./register.js";
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AppLoader {
    constructor() {
        const app = express();


        // Setup error handling, this must be after all other middleware
        app.use(AppLoader.errorHandler);

        const srcDir = path.basename(path.dirname(__dirname));
        const baseDir = path.basename(path.dirname(srcDir));


        // Set up middleware
        app.use(morgan('dev'));
        app.use(compression());
        app.use(express.urlencoded({ extended: false, limit: '20mb' }));
        app.use(express.json());


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

        // Start application
        const port = normalizePort(config.port);
        this.server.listen(port, "0.0.0.0");
        this.server.on('error', AppLoader.onError);
        this.server.on('listening', AppLoader.onListening);
    }

    get Server() {
        return this.server;
    }

    /**
     * @description Default error handler to be used with express
     * @param error Error object
     * @param req {object} Express req object
     * @param res {object} Express res object
     * @param next {function} Express next object
     * @returns {*}
     */
    static errorHandler(error, req, res, next) {
        let parsedError;

        // Attempt to gracefully parse error object
        try {
            if (error && typeof error === 'object') {
                parsedError = JSON.stringify(error);
            } else {
                parsedError = error;
            }
        } catch (e) {
            logger.error(e);
        }

        // Log the original error
        logger.error(parsedError);

        // If response is already sent, don't attempt to respond to client
        if (res.headersSent) {
            return next(error);
        }

        res.status(400).json({
            success: false,
            error,
        });
    }

    /**
     * Event listener for HTTP server "error" event.
     */

    static onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind = typeof port === 'string'
            ? `Pipe ${port}`
            : `Port ${port}`;

        // handle specific listen errors with friendly messages
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

    /**
     * Event listener for HTTP server "listening" event.
     */

    static onListening() {
        logger.info(`Express running, now listening on port ${config.port}`);
    }
}

export default AppLoader
