# GEMINI.md

## Project Overview

This project is a simple real-time chat application. It consists of a Node.js backend and a React frontend.

**Backend:**

*   **Framework:** Express.js
*   **Real-time Communication:** Socket.IO
*   **Functionality:**
    *   Handles user connections and disconnections.
    *   Manages a list of online users.
    *   Relays private messages between users.

**Frontend:**

*   **Framework:** React
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Functionality:**
    *   Provides a user interface for logging in.
    *   Displays a list of online users.
    *   Allows users to send and receive private messages.

## Building and Running

### Backend

To run the backend server:

```bash
npm install
node server.js
```

The server will start on `http://localhost:3000`.

### Frontend

To run the frontend client:

```bash
cd chat-client-react
npm install
npm run dev
```

The client will be available at `http://localhost:5173`.

## Development Conventions

*   The project uses a client-server architecture.
*   The backend is written in CommonJS module format.
*   The frontend is written in ES modules.
*   The frontend uses functional components with hooks.
*   Styling is done using Tailwind CSS.
