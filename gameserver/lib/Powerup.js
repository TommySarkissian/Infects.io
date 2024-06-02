const Constants = require('./Constants'); // Importing constants
const Util = require('../shared/Util'); // Importing utility functions

// Constructor for a Powerup
function Powerup(position, key, junky, forInfected, duration, hitbox) {
    this.position = position || [0, 0]; // Setting position
    this.key = key || ""; // Setting key type
    this.junky = junky || ""; // Setting junky (user)
    this.forInfected = forInfected; // Setting if for infected
    this.duration = duration | 0; // Setting duration
    this.hitbox = hitbox | 0; // Setting hitbox

    this.expirationTime = 0; // Initial expiration time
    this.destroyed = false; // Initial destroyed state

    Util.splitProperties(this, ['x', 'y'], 'position'); // Splitting properties for x and y
}

// Updates this Powerup's expiration time
Powerup.prototype.create = function () {
    position = [Util.randRange(Constants.WORLD_MIN, Constants.WORLD_MAX), Util.randRange(Constants.WORLD_MIN, Constants.WORLD_MAX)]; // Random position
    key = Util.choiceArray(Constants.POWERUP_KEYS); // Random key type
    junky = ""; // Initial junky value
    forInfected = Constants.POWERUP_KEYS_FOR_INFECTED[Constants.POWERUP_KEYS.indexOf(key)]; // Setting forInfected
    duration = Constants.POWERUP_DURATION; // Setting duration
    hitbox = Constants.POWERUP_HITBOX; // Setting hitbox
    return new Powerup(position, key, junky, forInfected, duration, hitbox); // Return new Powerup object
};

module.exports = Powerup; // Exporting the Powerup class
