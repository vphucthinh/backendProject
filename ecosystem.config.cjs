module.exports = {
    apps: [
        {
            name: "backend",
            script: "./server.js", // Replace with your main entry file
            watch: true,
            instances: 1,
            autorestart: true,
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
