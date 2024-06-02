const Constants = require('./Constants'); // Importing constants
const Entity2D = require('./Entity2D'); // Importing Entity2D class
const Util = require('../shared/Util'); // Importing utility functions
const e = require('express'); // Importing express

// Constructor for a Player
function Player(id, username, skin) {
  Entity2D.call(this, [Util.randRange(Constants.WORLD_MIN, Constants.WORLD_MAX), Util.randRange(Constants.WORLD_MIN, Constants.WORLD_MAX)], null, null, null, null, Constants.HITBOX, Constants.DEFAULT_ROTATION, username, skin, false, 0, Constants.DEFAULT_SURVIVOR_SPEED, (Date.now() + Constants.POWERUP_DURATION), false, false); // Initializing Entity2D properties
  this.id = id; // Setting player ID
}
Util.extend(Player, Entity2D); // Extending Entity2D class

// Factory method for creating a Player
Player.create = function (id, username, skin) {
  JSON.stringify(skin); // Convert skin to JSON string
  skin[0] = skin[0].substring(0, 7); // Ensure color format
  skin[1] = skin[1].substring(0, 7); // Ensure color format
  skin[2] = skin[2].substring(0, 7); // Ensure color format
  return new Player(id, username.substring(0, 20), skin); // Return new Player object
};

// Updates the Player based on received input
Player.prototype.updateOnInput = function (playerState) {
  this.vy = this.speed * (Number(playerState.down) - Number(playerState.up)); // Update y velocity
  this.vx = this.speed * (Number(playerState.right) - Number(playerState.left)); // Update x velocity
  if (playerState.respawn == true && this.infectedCount > 1) { // Check for respawn
    this.position = [Util.randRange(Constants.WORLD_MIN, Constants.WORLD_MAX), Util.randRange(Constants.WORLD_MIN, Constants.WORLD_MAX)]; // Randomize position
    this.speed = Constants.DEFAULT_SURVIVOR_SPEED; // Reset speed
    this.hitbox = Constants.HITBOX; // Reset hitbox
    this.infectedCount = 0; // Reset infected count
    this.infected = false; // Reset infection status
  }
};

// AI logic for bot players
Player.prototype.ai = function (players, powerups) {
  var angle; // Variable for angle calculation
  var rad; // Variable for radians
  if (this.id.includes("@bot") == true && this.infected == true) { // Bot infected logic
    var closestPlayerDistance; // Closest player distance
    var loggedPlayerDistance; // Logged player distance
    var targetPlayerPosition = []; // Target player position
    for (var i = 0; i < players.length; ++i) {
      if (players[i].infected == false && players[i].invisible == false) { // Check for visible non-infected players
        loggedPlayerDistance = Math.sqrt(Math.pow(Math.abs(players[i].position[0] - this.position[0]), 2) + Math.pow(Math.abs(players[i].position[1] - this.position[1]), 2)); // Calculate distance
        if ((closestPlayerDistance == null || loggedPlayerDistance < closestPlayerDistance || (targetPlayerPosition[0] + Constants.HITBOX >= this.position[0] && targetPlayerPosition[0] - Constants.HITBOX <= this.position[0] && targetPlayerPosition[1] + Constants.HITBOX >= this.position[1] && targetPlayerPosition[1] - Constants.HITBOX <= this.position[1]))) {
          closestPlayerDistance = loggedPlayerDistance; // Update closest player distance
          targetPlayerPosition = [players[i].position[0], players[i].position[1]]; // Update target player position
        }
      }
    }

    rad = Math.atan2(targetPlayerPosition[1] - this.position[1], targetPlayerPosition[0] - this.position[0]); // Calculate angle to target
    this.rotation = rad * (180 / Math.PI); // Convert to degrees

    if (this.id.includes("x") == true) { // Bot movement logic for infected
      if (targetPlayerPosition[0] + (Constants.HITBOX * 1.5) < this.position[0] && closestPlayerDistance > (Constants.HITBOX - 5)) {
        this.vx = this.speed * -0.8; // Move left
      } else if (targetPlayerPosition[0] - (Constants.HITBOX * 1.5) > this.position[0] && closestPlayerDistance > (Constants.HITBOX - 5)) {
        this.vx = this.speed * 0.8; // Move right
      } else {
        if (targetPlayerPosition[1] + (Constants.HITBOX * 1.5) < this.position[1] && closestPlayerDistance > (Constants.HITBOX - 5)) {
          this.vy = this.speed * -0.8; // Move up
        } else if (targetPlayerPosition[1] - (Constants.HITBOX * 1.5) > this.position[1] && closestPlayerDistance > (Constants.HITBOX - 5)) {
          this.vy = this.speed * 0.8; // Move down
        } else {
          this.vx = this.speed * 0; // Stop horizontal movement
          this.vy = this.speed * 0; // Stop vertical movement
        }
      }
    } else {
      if (targetPlayerPosition[1] + (Constants.HITBOX * 1.5) < this.position[1] && closestPlayerDistance > (Constants.HITBOX - 5)) {
        this.vy = this.speed * -0.8; // Move up
      } else if (targetPlayerPosition[1] - (Constants.HITBOX * 1.5) > this.position[1] && closestPlayerDistance > (Constants.HITBOX - 5)) {
        this.vy = this.speed * 0.8; // Move down
      } else {
        if (targetPlayerPosition[0] + (Constants.HITBOX * 1.5) < this.position[0] && closestPlayerDistance > (Constants.HITBOX - 5)) {
          this.vx = this.speed * -0.8; // Move left
        } else if (targetPlayerPosition[0] - (Constants.HITBOX * 1.5) > this.position[0] && closestPlayerDistance > (Constants.HITBOX - 5)) {
          this.vx = this.speed * 0.8; // Move right
        } else {
          this.vy = this.speed * 0; // Stop vertical movement
          this.vx = this.speed * 0; // Stop horizontal movement
        }
      }
    }
  } else if (this.id.includes("@bot") == true && this.infected == false) { // Bot non-infected logic
    var closestPowerupDistance; // Closest powerup distance
    var loggedPowerupDistance; // Logged powerup distance
    var targetPowerupPosition = []; // Target powerup position
    var closestInfectedDistance; // Closest infected distance
    var loggedInfectedDistance; // Logged infected distance
    var targetInfectedPosition = []; // Target infected position
    for (var i = 0; i < players.length; ++i) {
      if (players[i].infected == true) { // Check for infected players
        loggedInfectedDistance = Math.sqrt(Math.pow(Math.abs(players[i].position[0] - this.position[0]), 2) + Math.pow(Math.abs(players[i].position[1] - this.position[1]), 2)); // Calculate distance
        if ((closestInfectedDistance == null || loggedInfectedDistance < closestInfectedDistance || (targetInfectedPosition[0] + Constants.HITBOX >= this.position[0] && targetInfectedPosition[0] - Constants.HITBOX <= this.position[0] && targetInfectedPosition[1] + Constants.HITBOX >= this.position[1] && targetInfectedPosition[1] - Constants.HITBOX <= this.position[1]))) {
          closestInfectedDistance = loggedInfectedDistance; // Update closest infected distance
          targetInfectedPosition = [players[i].position[0], players[i].position[1]]; // Update target infected position
        }
      }
    }
    for (var i = 0; i < powerups.length; ++i) {
      loggedPowerupDistance = Math.sqrt(Math.pow(Math.abs(powerups[i].position[0] - this.position[0]), 2) + Math.pow(Math.abs(powerups[i].position[1] - this.position[1]), 2)); // Calculate distance
      if (powerups[i].destroyed == false && powerups[i].forInfected == false) { // Check for available powerups
        if ((closestPowerupDistance == null || loggedPowerupDistance < closestPowerupDistance || (targetPowerupPosition[0] + Constants.HITBOX >= this.position[0] && targetPowerupPosition[0] - Constants.HITBOX <= this.position[0] && targetPowerupPosition[1] + Constants.HITBOX >= this.position[1] && targetPowerupPosition[1] - Constants.HITBOX <= this.position[1]))) {
          closestPowerupDistance = loggedPowerupDistance; // Update closest powerup distance
          targetPowerupPosition = [powerups[i].position[0], powerups[i].position[1]]; // Update target powerup position
        }
      }
    }

    if (closestInfectedDistance <= 200) { // Avoid close infected players
      rad = Math.atan2(targetInfectedPosition[1] - this.position[1], targetInfectedPosition[0] - this.position[0]); // Calculate angle
      angle = (rad * (180 / Math.PI)) + 180; // Convert to degrees
      if (targetInfectedPosition[0] + Constants.HITBOX < this.position[0]) {
        this.vx = this.speed * 1; // Move right
      } else if (targetInfectedPosition[0] - Constants.HITBOX > this.position[0]) {
        this.vx = this.speed * -1; // Move left
      } else {
        this.vx = this.speed * 0; // Stop horizontal movement
      }
      if (targetInfectedPosition[1] + Constants.HITBOX < this.position[1]) {
        this.vy = this.speed * 1; // Move down
      } else if (targetInfectedPosition[1] - Constants.HITBOX > this.position[1]) {
        this.vy = this.speed * -1; // Move up
      } else {
        this.vy = this.speed * 0; // Stop vertical movement
      }
    } else if (closestInfectedDistance > 200 && closestInfectedDistance <= 600) { // Mid-range infected players
      rad = Math.atan2((Constants.WORLD_MAX) - targetInfectedPosition[1] - this.position[1], (Constants.WORLD_MAX) - targetInfectedPosition[0] - this.position[0]); // Calculate angle
      angle = rad * (180 / Math.PI); // Convert to degrees
      if ((Constants.WORLD_MAX) - targetInfectedPosition[0] + Constants.HITBOX < this.position[0]) {
        this.vx = this.speed * -1; // Move left
      } else if ((Constants.WORLD_MAX) - targetInfectedPosition[0] - Constants.HITBOX > this.position[0]) {
        this.vx = this.speed * 1; // Move right
      } else {
        this.vx = this.speed * 0; // Stop horizontal movement
      }
      if ((Constants.WORLD_MAX) - targetInfectedPosition[1] + Constants.HITBOX < this.position[1]) {
        this.vy = this.speed * -1; // Move up
      } else if ((Constants.WORLD_MAX) - targetInfectedPosition[1] - Constants.HITBOX > this.position[1]) {
        this.vy = this.speed * 1; // Move down
      } else {
        this.vy = this.speed * 0; // Stop vertical movement
      }
    } else {
      rad = Math.atan2(targetPowerupPosition[1] - this.position[1], targetPowerupPosition[0] - this.position[0]); // Calculate angle
      angle = rad * (180 / Math.PI); // Convert to degrees
      if (targetPowerupPosition[0] + Constants.HITBOX < this.position[0] && closestPowerupDistance > (Constants.HITBOX + Constants.POWERUP_HITBOX - 5)) {
        this.vx = this.speed * -1; // Move left
      } else if (targetPowerupPosition[0] - Constants.HITBOX > this.position[0] && closestPowerupDistance > (Constants.HITBOX + Constants.POWERUP_HITBOX - 5)) {
        this.vx = this.speed * 1; // Move right
      } else {
        this.vx = this.speed * 0; // Stop horizontal movement
      }
      if (targetPowerupPosition[1] + Constants.HITBOX < this.position[1] && closestPowerupDistance > (Constants.HITBOX + Constants.POWERUP_HITBOX - 5)) {
        this.vy = this.speed * -1; // Move up
      } else if (targetPowerupPosition[1] - Constants.HITBOX > this.position[1] && closestPowerupDistance > (Constants.HITBOX + Constants.POWERUP_HITBOX - 5)) {
        this.vy = this.speed * 1; // Move down
      } else {
        this.vy = this.speed * 0; // Stop vertical movement
      }
    }
  }
  if (this.rotation > Math.ceil((angle) / 10) * 10) {
    this.rotation = this.rotation - 10; // Adjust rotation left
  } else if ((this.rotation < Math.ceil((angle) / 10) * 10)) {
    this.rotation = this.rotation + 10; // Adjust rotation right
  }
};

// Updates the Player based on their rotation
Player.prototype.updateRotation = function (playerPosition) {
  this.rotation = parseFloat(playerPosition.rotation).toFixed(2); // Set rotation
};

// Steps the Player forward in time and updates the internal position, velocity, etc.
Player.prototype.update = function () {
  this.parent.update.call(this); // Call parent update method
};

module.exports = Player; // Exporting the Player class
