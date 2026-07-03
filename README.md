# CodeForge

CodeForge is a full-stack Data Structures and Algorithms (DSA) tracker and learning platform designed to help developers master algorithms through structured levels, interactive theory, step-by-step dry runs, and progress tracking.

The application is built using React on the frontend, Node.js and Express on the backend, and MongoDB as the database.

## Features

- **Topic Progression**: Structured path through fundamental and advanced algorithms.
- **Interactive Theory**: Detailed explanations of algorithm concepts, complexity analysis, and real-world use cases.
- **Dry Runs**: Visual, step-by-step breakdowns of algorithm execution state.
- **Progress Tracking**: Personal accounts with progress saved to a MongoDB database.
- **Responsive Layout**: Sidebar-driven interface designed for comfortable reading and coding.

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS/Vanilla CSS, Vite
- **Backend**: Node.js, Express, JSON Web Tokens (JWT) for authentication
- **Database**: MongoDB (Mongoose)

## Project Structure

- `server.js` - Express API server, routes, and database connections.
- `src/` - React frontend application.
  - `src/data/` - Static algorithm data, rubrics, and lessons.
  - `src/components/` - Shared UI components (Sidebar, Timer, Progress indicators).
  - `src/pages/` - Views for welcome screen, dashboard, algorithms list, and labs.
- `models/` - Mongoose database schemas (User, Progress).
- `api/` - Vercel serverless function entrypoint.

## Getting Started Locally

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB (running locally or a MongoDB Atlas URI)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tanushdev/CodeForge.git
   cd CodeForge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_secret_key
   PORT=3001
   ```

4. Run the development environment:
   - To run both frontend and backend concurrently, you can start the development server:
     ```bash
     npm run dev
     ```
   - To run the backend server separately:
     ```bash
     npm run dev:server
     ```

## Deployment

This repository is pre-configured for deployment on Vercel as a monorepo containing both the React frontend and the Express backend:

- The `vercel.json` file handles routing, forwarding all static asset requests to the React build and `/api/*` requests to the serverless function.
- The `api/index.js` file exposes the Express app as a serverless handler.
- When deploying to Vercel, ensure you configure the `MONGODB_URI` and `JWT_SECRET` environment variables in the Vercel Project Settings.
