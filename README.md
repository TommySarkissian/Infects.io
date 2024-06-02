# ![Logo](https://i.imgur.com/DGOTOPH.jpeg)

Infects.io is a thrilling multiplayer game where one player starts as an infected (a zombie), and the others must run away to avoid becoming infected. The game features a variety of power-ups scattered across the board to keep the gameplay engaging and dynamic.

## Features

- **Multiplayer Gameplay**: Experience real-time multiplayer action where one player becomes infected, and the others must escape.
- **Mobile Support**: Enjoy a fully responsive design with joystick support for mobile devices.
- **Service Workers**: Leverage service workers for enhanced performance.
- **HTTPS Security**: Ensure secure communication between the client and server with HTTPS.
- **SEO Optimized**: Benefit from best practices in SEO, including `manifest.json` and other optimizations for better discoverability in `index.html`
- **Lobby Links**: Easily copy game lobby links and send them to friends for quick game setup.
- **Power-ups**: Collect various power-ups to gain special abilities, enhancing your chances of survival or infection.
- **Dynamic Environment**: Navigate through an interactive game environment that adds an extra layer of challenge.
- **Character Customization**: Customize your character's appearance at the menu for a personalized gaming experience.

## Power-ups

1. **Speed Boost**: Increases your movement speed for a short duration.
2. **Invincibility**: Makes you invincible to infections for a limited time.
3. **Invisibility**: You can temporarily become invisible to other players.
4. **Giant**: Increases the size of the infected player.
5. **Zombie Speed**: Increases the speed of the infected player.

## Screenshots

![Main Menu](https://i.imgur.com/f7G5rwD.png)

![Survivor Gameplay](https://i.imgur.com/aeXFtYw.png)

![Infected Gameplay](https://i.imgur.com/fCmtjOf.png)

![Mobile Support](https://i.imgur.com/rWeH9qg.png)

## Installation

1. Ensure that [Node.js](https://nodejs.org/) is installed on your machine.
2. Clone the repository:

    ```bash
    git clone https://github.com/tommysarkissian/Infects.io.git
    ```

3. Navigate to the project directory:

    ```bash
    cd Infects.io
    ```

4. Install dependencies for the game server:

    ```bash
    cd gameserver
    npm install
    ```

5. Install dependencies for the web server:

    ```bash
    cd ../webserver
    npm install
    ```

6. Include the files from the HTTPS configuration (`index.js`) in the parent directory of `/webserver` and `/gameserver`:

    ```javascript
    const fs = require('fs');
    const options = {
      key: fs.readFileSync('private.key.pem'), // Private key file
      cert: fs.readFileSync('domain.cert.pem'), // Domain certificate file
      ca: fs.readFileSync('intermediate.cert.pem'), // Intermediate certificate file
      rejectUnauthorized: true // Reject unauthorized connections
    };
    ```

7. Update `servers.json` under `/webserver/public/` with the appropriate hostnames. For testing, use `localhost`.

## Usage

### Running the Game

To run the game:

1. Start the game server:

    ```bash
    cd gameserver
    npm start
    ```

2. Start the web server:

    ```bash
    cd webserver
    npm start
    ```

### Updating Service Worker

Whenever an update is made, modify the `sw.js` file in `webserver/views` to include the new version number.

## How to Play

1. **Join a Game**: Enter a username and join a game.
2. **Avoid the Infected**: Run away from the infected player if you're a survivor.
3. **Infect Others**: If you're the infected, chase and infect the survivors.
4. **Use Power-ups**: Collect power-ups to gain advantages and enhance your gameplay.
5. **Survive**: The game continues until all players are infected or the time runs out.

## Contributing

We welcome contributions to improve `Infects.io`! Please fork the repository and submit pull requests.
