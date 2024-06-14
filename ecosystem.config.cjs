module.exports = {
    apps: [
        {
            name: "backend",
            script: "/server.js", // Replace with the full path to your main entry file
            watch: false, // Enable if you want PM2 to watch for file changes and restart the app
            instances: 1, // Number of instances to launch, typically 1 for most applications
            autorestart: true, // Automatically restart the app if it crashes
            max_memory_restart: "1G", // Restart if the memory usage exceeds this limit
            env: {
                NODE_ENV: "development",
                DB_URI: process.env.DB_URI, // Use environment variable for database URI
            },
            env_production: {
                NODE_ENV: "production",
                DB_URI: process.env.DB_URI, // Use environment variable for database URI
            },
        },
    ],
};
