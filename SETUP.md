# Todo List Application - Setup Guide

This guide explains how to set up and run the Todo List Application locally, consisting of a React frontend and an ASP.NET Core backend.

## Prerequisites

Before you begin, ensure that you have the following installed:

- **[Node.js](https://nodejs.org/en/)**: Required for running the React application.
- **[npm](https://www.npmjs.com/)**: Package manager that comes with Node.js.
- **[.NET SDK](https://dotnet.microsoft.com/download/dotnet)**: Required for building and running the ASP.NET Core backend.

## 1. Clone the Git Repository

### Clone the repository to your local machine: `git clone https://github.com/Tolujoh-n/hiring-task`

`cd hiring-task`

## This repository contains the following folders:

- frontend (React application)
- backend (ASP.NET Core application)

## Set Up the Backend

The backend is built with ASP.NET Core and provides the authentication system as well as a REST API for managing todo items.

- Install Backend Dependencies, Navigate to the backend directory: `cd backend`

- Install the required NuGet packages:

```
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.InMemory


```

- Run the Backend Server: `dotnet run`
- The backend will now be running on http://localhost:5140 or a relative localhost port, If your backend is running on a different port set the backend baseURL in `/frontend/src/app.js` file to the port your backend is running `axios.defaults.baseURL = "http://localhost:5140";`

## Set Up the Frontend

The frontend is built with React and communicates with the backend API to handle user authentication and Todo item management.

- Install Frontend Dependencies Open a new terminal window and navigate to the frontend directory: `cd frontend`

- Install the necessary npm dependencies: `npm install --legacy-peer-deps`

- Run the Frontend Start the React development server: `npm start`

- The frontend application will be available at http://localhost:3000.

## Run Tests 

You can run the frontend test suite to ensure everything is working as expected: `npm test` This will execute the unit tests using Jest.

## Troubleshooting

Common Issues:

- CORS Issue: If the frontend cannot connect to the backend due to CORS issues, ensure that the backend is configured to allow requests from http://localhost:3000. You may need to update the CORS settings in Startup.cs or Program.cs in the backend project.

- Database Connection: If the backend cannot connect to the database, ensure SQL Server is running and the connection string in appsettings.json is correct.

- Missing Dependencies: If npm install fails due to dependency issues, try deleting the node_modules directory and reinstalling:

```
rm -rf node_modules
npm install --legacy-peer-deps

```

## Conclusion

Following these steps will set up the Todo List application locally with both the frontend and backend running on your machine. You should now be able to::

- Create, read, update, and delete Todo items.
- Authenticate users using JWT.
- Interact with the backend API through the React frontend.
