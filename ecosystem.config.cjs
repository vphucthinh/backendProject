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
        },
    ],
};
