// Creates a Game on the client side to render the players and entities.
function Game(socket, drawing) {
  this.status = null; // Game status.
  this.socket = socket; // Socket connected to the server.
  this.drawing = drawing; // Drawing object to render the game.
  this.selfPlayer = null; // Reference to the local player.
  this.otherPlayers = []; // Array of other players.
  this.animationFrameId = 0; // ID for animation frame.
}

// Factory method to create a Game object.
Game.create = function (socket, canvasElement) {
  canvasElement.width = window.innerWidth; // Set canvas width.
  canvasElement.height = window.innerHeight; // Set canvas height.
  var canvasContext = canvasElement.getContext('2d'); // Get canvas context.
  var drawing = Drawing.create(canvasContext); // Create Drawing object.
  return new Game(socket, drawing); // Return new Game object.
};

var startTime;
var latencyInterval;
var latency;
var emitted = false;

// Initializes the Game object and sets event handlers.
Game.prototype.init = function (username, skin) {
  startTime = Date.now(); // Initialize start time.
  latencyInterval = setInterval(function () {
    if (emitted == false) {
      startTime = Date.now(); // Update start time.
      socket.emit('ping'); // Emit ping event.
      emitted = true; // Set emitted to true.
    }
  }, 2000); // Interval for latency check.

  var context = this; // Save reference to Game object.

  // Handle 'update' event from the server.
  this.socket.on('update', function (data) {
    context.receiveGameState(data); // Receive game state.
  });

  // Emit 'player-join' event to the server.
  this.socket.emit('player-join', {
    playerInfo: {
      username: username, // Player's username.
      skin: skin, // Player's skin.
    },
  });
};

// Begins the animation loop for the game.
Game.prototype.animate = function () {
  this.animationFrameId = window.requestAnimationFrame(
    Util.bind(this, this.update)); // Request next animation frame.
};

// Stops the animation loop for the game.
Game.prototype.stopAnimation = function () {
  clearInterval(latencyInterval); // Clear latency interval.
  window.cancelAnimationFrame(this.animationFrameId); // Cancel animation frame.
};

// Updates the game's internal storage with the received game state.
Game.prototype.receiveGameState = function (state) {
  this.survivorCount = state['survivor_count']; // Update survivor count.
  this.infectedCount = state['infected_count']; // Update infected count.
  this.playerData = state['player_data']; // Update player data.
  this.winner = state['winner']; // Update winner.
  this.status = state['status']; // Update game status.
  this.powerups = state['powerups']; // Update powerups.
  this.selfPlayer = state['self']; // Update local player.
  this.otherPlayers = state['players']; // Update other players.
  this.loggedTime = state['loggedTime']; // Update logged time.
  this.closingTime = state['closingTime']; // Update closing time.
};

var disconnected = false; // Flag for disconnection.

// Updates the game client-side state and relays intents to the server.
Game.prototype.update = function () {
  if (this.selfPlayer) {
    this.socket.on('pong', function () {
      if (emitted == true) {
        latency = Date.now() - startTime; // Calculate latency.
        document.getElementById("latency").innerHTML = latency + " ms"; // Display latency.
        if (latency > 150 && latency <= 250) {
          document.getElementById("latency").style.color = "yellow"; // Set latency color to yellow.
        } else if (latency > 250) {
          document.getElementById("latency").style.color = "red"; // Set latency color to red.
        } else {
          document.getElementById("latency").style.color = "green"; // Set latency color to green.
        }
        if (latency >= 1000) {
          document.getElementById("lagging").style.display = "block"; // Show lagging message.
        } else {
          document.getElementById("lagging").style.display = "none"; // Hide lagging message.
        }
        emitted = false; // Reset emitted flag.
      }
    });

    if (this.socket.connected == false && disconnected == false) {
      alert("Disconnected from lobby"); // Alert disconnection.
      window.location.href = location.href; // Reload page.
      disconnected = true; // Set disconnected flag.
    }

    // Emit 'player-action' event to the server.
    this.socket.emit('player-action', {
      playerState: {
        left: Input.LEFT, // Move left.
        right: Input.RIGHT, // Move right.
        up: Input.UP, // Move up.
        down: Input.DOWN, // Move down.
        respawn: Input.RESPAWN, // Activate heal ability.
      },
      playerPosition: {
        rotation: Position.ROTATION, // Send player rotation to server.
      }
    });

    this.draw(); // Draw the game state.
  }

  this.animate(); // Continue animation loop.
};

// Draws the state of the game using the internal Drawing object.
Game.prototype.draw = function () {
  this.drawing.clear(); // Clear the canvas.

  this.drawing.drawBackground(
    this.selfPlayer.x,
    this.selfPlayer.y,
    this.selfPlayer.infected
  );

  for (var powerup of this.powerups) {
    this.drawing.drawPowerups(
      powerup.key,
      powerup.forInfected,
      this.selfPlayer.x,
      this.selfPlayer.y,
      this.selfPlayer.infected,
      powerup.x,
      powerup.y,
      powerup.hitbox,
      this.selfPlayer.powerupCooldown
    );
  }

  // Draw the local player.
  this.drawing.drawSelf(
    this.selfPlayer.x,
    this.selfPlayer.y,
    this.selfPlayer.hitbox,
    this.selfPlayer.rotation,
    this.selfPlayer.username,
    this.selfPlayer.skin,
    this.selfPlayer.infected,
    this.selfPlayer.infectedCount,
    this.selfPlayer.invisible,
    this.selfPlayer.invincible,
    this.status
  );

  // Draw other players.
  for (var player of this.otherPlayers) {
    this.drawing.drawOther(
      this.selfPlayer.x,
      this.selfPlayer.y,
      this.selfPlayer.infected,
      player.x,
      player.y,
      player.hitbox,
      player.rotation,
      player.username,
      player.skin,
      player.infected,
      player.invisible,
      player.invincible
    );
  }

  this.drawing.drawHud(
    this.selfPlayer.infected,
    this.status
  );

  this.drawing.gameStatus(
    this.playerData,
    this.status,
    this.winner,
    this.loggedTime,
    this.closingTime,
    this.survivorCount,
    this.infectedCount
  );
};
