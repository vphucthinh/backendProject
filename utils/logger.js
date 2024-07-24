import winston from "winston";
import path from 'path';
import {config} from '../config/config.js';

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'app-service', time: new Date().toISOString() },
    transports: [
        // - Write to all logs with level `info` and below to `app.log`
        // - Write all logs error (and below) to `error.log`.
        new winston.transports.File({ filename: path.join(config.logDir, 'error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join(config.logDir, 'app.log') }),
    ],
});

