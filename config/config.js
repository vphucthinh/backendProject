import dotenv from 'dotenv';
dotenv.config();

export const config = {
    dbUrl: process.env.DB_URI,
    port: process.env.PORT || 4000,
    env: process.env.NODE_ENV || 'development',
    logDir: process.env.LOGDIR || 'logs',
    uploadStorage: process.env.UPLOAD_STORAGE || '../uploads',
};
