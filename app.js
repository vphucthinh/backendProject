import {config} from './config/config.js';
import mongoose from "mongoose";
import {logger} from './utils/logger.js';
import AppLoader from './loaders/index.js';

mongoose.Promise = global.Promise;

// Connect to the DB an initialize the app if successful
mongoose.connect(config.dbUrl)
    .then(() => {
        logger.info('Database connection successful');

        // Initialize the app
        new AppLoader();
    })
    .catch(err => {
        console.error(err);
        logger.error(err);
    });
