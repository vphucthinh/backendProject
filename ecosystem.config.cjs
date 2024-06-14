module.exports = {
    apps: [
        {
            name: "backend",
            script: "./server.js",
            watch: true,
            instances: 1,
            autorestart: true,
            max_memory_restart: "1G",
            env: {
                NODE_ENV: "development",
                DB_URI: process.env.DB_URI,
            },
            env_production: {
                NODE_ENV: "production",
                DB_URI: process.env.DB_URI,
            },
            log_file: "logs/combined.log",
            out_file: "logs/out.log",
            error_file: "logs/err.log",
            time: true,
        },
    ],
    logrotate: {
        max_size: "10M",
        retain: 10,
        compress: true,
        dateFormat: "YYYY-MM-DD_HH-mm-ss",
        workerInterval: 3600,
        rotateInterval: "0 0 * * *",
        rotateModule: true,
    },
};
