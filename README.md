# Backend Node.js API

## Overview

This is a Node.js backend API built with Express. It includes various features like authentication, validation, logging, and real-time communication using Socket.io. The project is modular, following a layered architecture with models, repositories, services, and controllers.

## Features

- **Express.js**: Core framework for building the API.
- **MongoDB with Mongoose**: For database interactions.
- **Authentication**: Using JSON Web Tokens (JWT).
- **Real-Time Communication**: Implemented using Socket.io.
- **Validation**: Data validation with `@withvoid/make-validation` and `validator`.
- **File Uploads**: Handled by `multer`.
- **Logging**: Implemented with `winston` and `morgan`.
- **API Documentation**: Generated using `swagger-autogen` and `swagger-jsdoc`, served with `swagger-ui-express`.
- **Dependency Injection**: Managed with `awilix` and `awilix-express`.
- **Environment Configuration**: Managed with `dotenv`.
- **Monitoring**: Basic monitoring with `express-status-monitor`.
- **Production Process Management**: Handled by `pm2`.
- **Payments**: Integrated with Stripe for payment processing.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/vphucthinh/backendProject.git
   cd backendProject
   ```
   
2.Install the dependencies:

   ```bash
   npm install
   ```
3
a.Run the development server:
   ```bash
   npm run dev
   ```

b.start the application in production mode:
   ```bash
   npm start
   ```
