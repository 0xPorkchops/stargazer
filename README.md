# StarGazer
CS 320 Group Project: StarGazer

Developed by Group 3: Aymaan (Manager), Cameron, Chris, Benson, Shreyas, Stanley

[Use Cases Presentation](https://docs.google.com/presentation/d/1VsCRAw7tp8DvUu4wuMhJvtfo-q5XfISFpOQnA0fUDEg/) (Must be logged in to UMass email)

[Data Diagrams](https://docs.google.com/presentation/d/1UEYbFaCb2QReYIT1JbGK3377NBJICWrWq90Oeu6h8U4/edit?usp=sharing) (Must be logged in to UMass email)

[Frameworks](https://docs.google.com/document/d/1B8dZ8GH1Lf103YnrU1AM2QZsgJX9E7QHDH709AZnOsg/edit?usp=sharing) (Must be logged in to UMass email)

[Software Metrics](https://drive.google.com/drive/folders/13xDGG2UANGKH746DA_j6Fg8lq9CqjAPp?usp=sharing) (Must be logged in to UMass email)

# Project Setup

## Installation

To install all required dependencies, run:
```bash
npm run install:all
```

## Starting the Application

### Start Full Application

To start both the backend and frontend servers simultaneously, use:
```bash
npm run dev
```
This command:
- Builds and starts the Express backend on **localhost:3000**
- Launches the Vite/React frontend with hot reload on **localhost:5000**

### Start Frontend Only

To start only the frontend server with hot reload enabled, run:
```bash
npm run dev:client
```

### Start Backend Only

To start only the backend server with Express routing and MongoDB connection, run:
```bash
npm run dev:server
```
> Note: The backend server requires a manual restart for client and server changes to take effect.