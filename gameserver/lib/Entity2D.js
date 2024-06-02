const Constants = require('./Constants'); // Importing constants
const Util = require('../shared/Util'); // Importing utility functions
const DIMENSIONS = 2; // Number of dimensions for the entity

// Constructor for an Entity2D
function Entity2D(position, velocity, acceleration, orientation, mass, hitbox, rotation, username, skin, infected, infectedCount, speed, powerupCooldown, invisible, invincible) {
  this.position = position || [0, 0]; // Initial position
  this.velocity = velocity || [0, 0]; // Initial velocity
  this.acceleration = acceleration || [0, 0]; // Initial acceleration
  this.orientation = orientation || 0; // Initial orientation
  this.mass = mass || 1; // Mass of the entity
  this.hitbox = hitbox || 0; // Hitbox radius
  this.rotation = rotation || 0; // Sprite rotation
  this.username = username || ""; // Username
  this.skin = skin || Constants.DEFAULT_SKIN; // Skin colors
  this.infected = infected || false; // Infection status
  this.infectedCount = infectedCount || 0; // Number of infections caused
  this.speed = speed || 0; // Speed of the entity
  this.powerupCooldown = powerupCooldown || 0; // Powerup cooldown time
  this.invisible = invisible || false; // Invisibility status
  this.invincible = invincible || false; // Invincibility status

  this.lastUpdateTime = 0; // Last update time
  this.deltaTime = 0; // Time difference

  // Define position properties
  Util.splitProperties(this, ['x', 'y'], 'position');
  // Define velocity properties
  Util.splitProperties(this, ['vx', 'vy'], 'velocity');
  // Define acceleration properties
  Util.splitProperties(this, ['ax', 'ay'], 'acceleration');
}

// Applies a force to the Entity2D
Entity2D.prototype.applyForce = function (force) {
  for (var i = 0; i < DIMENSIONS; ++i) {
    this.acceleration[i] += force[i] / this.mass;
  }
};

// Checks if this Entity2D is in contact with another Entity2D
Entity2D.prototype.isCollidedWith = function (other) {
  var minDistance = (this.hitbox + other.hitbox);
  return Util.getEuclideanDistance2(this._position, other.position) <=
    (minDistance * minDistance);
};

// Updates the Entity2D's position, velocity, and acceleration
Entity2D.prototype.update = function (deltaTime) {
  var currentTime = (new Date()).getTime();
  if (deltaTime) {
    this.deltaTime = deltaTime;
  } else if (this.lastUpdateTime === 0) {
    this.deltaTime = 0;
  } else {
    this.deltaTime = (currentTime - this.lastUpdateTime) / 1000;
  }
  for (var i = 0; i < DIMENSIONS; ++i) {
    this.x = Util.bound(this.x, Constants.WORLD_MIN, Constants.WORLD_MAX);
    this.y = Util.bound(this.y, Constants.WORLD_MIN, Constants.WORLD_MAX);
    this.position[i] += this.velocity[i] * this.deltaTime;
    this.velocity[i] += this.acceleration[i] * this.deltaTime;
    this.acceleration[i] = 0;
  }
  this.lastUpdateTime = currentTime;
};

module.exports = Entity2D; // Exporting the Entity2D class
