module.exports = {
  WORLD_MIN: 0, // Minimum coordinate in the world
  WORLD_MAX: 5000, // Maximum coordinate in the world

  HITBOX: 40, // Player hitbox size
  DEFAULT_ROTATION: 90, // Default player rotation angle
  DEFAULT_SURVIVOR_SPEED: 500, // Default speed for survivors
  DEFAULT_INFECTED_SPEED: 550, // Default speed for infected players
  DEFAULT_SKIN: ["#d2b48c", "#d3d3d3", "#371d33"], // Default skin colors

  MAX_POWERUP_COUNT: 25, // Maximum number of power-ups in the game
  POWERUP_HITBOX: 25, // Power-up hitbox size
  POWERUP_DURATION: 10000, // Duration of power-up effects
  POWERUP_KEYS: [ // List of power-up types
    'speed',
    'invincible',
    'invisible',
    'giant',
    'zspeed'
  ],
  POWERUP_KEYS_FOR_INFECTED: [ // Power-up availability for infected players
    false,
    false,
    false,
    true,
    true
  ],
  POWERUP_SPEED: 750, // Speed power-up value
  POWERUP_ZSPEED: 700, // Z-speed power-up value
  POWERUP_GIANT: 100, // Giant power-up value
  POWERUP_COOLDOWN: 5000, // Cooldown time for power-ups

  WAITING_TIME: 20000, // Waiting time for game start
  RESET_SERVER_TIME: 20000, // Server reset time
}
