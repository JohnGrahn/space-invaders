# Space Invaders Clone

This is a classic Space Invaders game built with JavaScript, HTML5 Canvas, and CSS, featuring a Node.js backend for a persistent leaderboard. The entire application is containerized using Docker for easy deployment.

## Features

- **Classic Space Invaders Gameplay:** Shoot down waves of descending aliens before they reach the bottom.
- **Barriers:** Strategic barriers provide cover from enemy fire, but they can be destroyed.
- **Leaderboard:** Compete for high scores and track your progress across multiple waves. The leaderboard is powered by a PostgreSQL database and a Node.js backend.
- **Dockerized Deployment:** The entire application is containerized using Docker, making it easy to deploy to any environment that supports Docker Compose.

## Getting Started

### Prerequisites

- **Docker:** Install Docker on your server following the instructions for your operating system: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)
- **Docker Compose:** Install Docker Compose: [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)

### Deployment

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/space-invaders.git
   cd space-invaders
   ```

2. **Start the Application:**
   ```bash
   docker-compose up -d
   ```

3. **Access the Game:**
   - The game will be accessible on the port specified in your `docker-compose.yml` file. Make sure that this port is open in your server's firewall configuration.

## Development

### Prerequisites

- **Node.js and npm:** Install Node.js and npm: [https://nodejs.org/](https://nodejs.org/)

### Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run start
   ```
   This will concurrently start the Vite development server for the frontend and the Node.js server for the backend.

3. **Access the Game:**
   - Open your web browser and go to `http://localhost:5173`.

## Game Controls

- **Left Arrow:** Move player left.
- **Right Arrow:** Move player right.
- **Spacebar:** Shoot.

## Project Structure

- **`Dockerfile`:** Defines how to build the Docker image for the application.
- **`docker-compose.yml`:**  Specifies the Docker services (frontend, backend, database) and their configuration.
- **`public/`:** Contains static assets, including images and SVGs for the game elements.
- **`src/`:** Contains the JavaScript source code for the game logic and components.
   - **`components/`:** Individual game components (Player, Enemy, Barrier, etc.).
   - **`utils/`:** Utility classes and functions (CollisionDetector).
- **`server.js`:** The Node.js backend server code for handling the leaderboard.
- **`vite.config.js`:** Configuration for the Vite build tool.
- **`eslint.config.js`:** Configuration for ESLint, the code linter. 
- `README.md`: This file.

## Acknowledgements

- The game graphics were inspired by classic Space Invaders designs.

## License

This project is licensed under the MIT License.
