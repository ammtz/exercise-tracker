# Exercise Tracker API

A simple RESTful API to create users, log exercises, and track exercise history.

## Setup
1. Clone the repo and install dependencies:
   ```bash
   git clone <repo-url>
   npm install
   ```
2. Add `.env` with `MONGO_URI`.
3. Start the server:
   ```bash
   npm start
   ```

## Endpoints
- **POST** `/api/users` - Create a user.
- **GET** `/api/users` - Get all users.
- **POST** `/api/users/:_id/exercises` - Add an exercise.
- **GET** `/api/users/:_id/logs?[from][&to][&limit]` - Get exercise log with optional filters.

### Query Parameters for Logs
- **from, to**: Date range (yyyy-mm-dd).
- **limit**: Number of logs.

## Built With
- Node.js, Express, MongoDB.