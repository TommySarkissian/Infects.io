const HashMap = require('hashmap'); // Importing hashmap
const Player = require('./Player'); // Importing Player class
const Powerup = require('./Powerup'); // Importing Powerup class
const Util = require('../shared/Util'); // Importing utility functions
const Constants = require('./Constants'); // Importing constants
const express = require('express'); // Importing express
const e = require('express'); // Importing express (duplicate, possibly unnecessary)
var usernames = ["Krazyazure", "Joygood", "Fairytiny", "Smilehead", "Shinybad", "Fungrow", "Bravedar", "Braverat", "Tinywatch", "Dawntor", "Krazygar", "Darburp", "Wavehead", "Bucksbucks", "Lenpunch", "Smellsmell", "Mousedeath", "Snakezero", "Solidsickle", "Cakebucks", "Hamumu", "BraveSnake", "ZeroDar", "psyborg", "PunchGood", "BraveSnake", "GarWatch", "GarWatch", "EinstBucks", "LaughBurp", "SmellBoard", "WaveLite", "HeadShiny", "BillLen", "TinyGood", "Maggiehk", "INDOGSSSSS", "DeathPunch", "ZeroBad", "TickleLaugh", "WaveSmell", "BadFlash", "DeathCake", "remy", "SolidEinst", "GripShiny", "BucksYou", "DeathMouse", "WaveZero", "GripTickle", "WiggleBill", "NiceGuy", "ZyfensALT", "mon123", "qwifsd1dsf", "TorLuck", "NotBobbi", "Cunnnntbla", "FireSquish", "GarTiny", "DuckBob", "GarBucks", "TorFun", "PanBestia", "TickleYou", "BananaGrow", "CakeBad", "BurpRat", "GoodTor", "SickleGrip", "WiggleLaugh", "WaveLen", "SickleBill", "goldice", "DawnBoard", "MouseDuck", "piirakka", "WaveDar", "EinstPunch", "DawnWatch", "LiteSnake", "FireKrazy", "FlashGrow", "FunBob", "tttiiimmm2", "GarTor", "BudTickleW", "Alt", "CakeLaugh", "SmileSolid", "CryPunch", "DarCry", "BucksLite", "BananaLuck", "FunFairy", "HAMZA"]; // List of usernames

// Constructor for a Game object
function Game() {
  this.status = 0; // 0: Default, 1: Waiting, 2: Playing, 3: One alive (END GAME), 4: No winners (Winner left), 5: Two winners (Infected Left)
  this.clients = new HashMap(); // Map for clients
  this.players = new HashMap(); // Map for players
  this.winner = null; // Winner of the game
  this.powerups = []; // List of powerups
  this.loggedTime = null; // Logged time
  this.closeDuration = null; // Close duration
}

// Factory method for a Game object
Game.create = function () {
  return new Game();
};

// Returns a list containing the connected Player objects
Game.prototype.getPlayers = function () {
  return this.players.values();
};

// Returns callbacks for accessing other elements and entities in the game
Game.prototype._callbacks = function () {
  return {
    players: Util.bind(this, this.players)
  };
};

// Adds a new player to the game
Game.prototype.addNewPlayer = function (socket, data) {
  this.clients.set(socket.id, socket);
  if (data.playerInfo.username != "") {
    this.players.set(socket.id, Player.create(socket.id, data.playerInfo.username, data.playerInfo.skin));
  } else {
    this.players.set(socket.id, Player.create(socket.id, usernames[Math.floor(Math.random() * usernames.length)], data.playerInfo.skin));
  }
};

// Adds a bot to the game
Game.prototype.addBot = function (id) {
  this.players.set(id, Player.create(id, usernames[Math.floor(Math.random() * usernames.length)], ['#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'), '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'), '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')]));
};

// Removes a player from the game
Game.prototype.removePlayer = function (id) {
  this.clients.delete(id);
  this.players.delete(id);
};

// Removes all bots from the game
Game.prototype.removeAllBots = function () {
  var players = this.getPlayers();
  for (x = 0; x < players.length; x++) {
    if (players[x].id.includes("@bot")) {
      this.players.delete(players[x].id);
    }
  }
};

// Removes all players from the game
Game.prototype.removeAll = function () {
  var players = this.getPlayers();
  for (x = 0; x < players.length; x++) {
    this.removePlayer(players[x].id);
  }
};

// Resets the game
Game.prototype.resetGame = function () {
  this.status = 0; // Reset status
  this.clients = new HashMap(); // Reset clients
  this.players = new HashMap(); // Reset players
  this.winner = null; // Reset winner
  this.powerups = []; // Reset powerups
  this.loggedTime = null; // Reset logged time
  this.closeDuration = null; // Reset close duration
};

// Updates a player based on input received from their client
Game.prototype.updatePlayerOnInput = function (id, data) {
  var player = this.players.get(id);
  if (player) {
    player.updateOnInput(data.playerState);
    player.updateRotation(data.playerPosition);
  }
};

// Steps the server forward in time and updates every entity in the game
Game.prototype.update = function () {
  var players = this.getPlayers();

  if (players.length >= 1 && this.status == 0) {
    this.loggedTime = Date.now();
    this.closeDuration = Date.now() + Constants.WAITING_TIME;
    this.status = 1;
  }

  if (this.status == 1) {
    this.loggedTime = Date.now();
    if (players.length >= 3) {
      if (this.players.values().filter((player) => player.id.includes("@bot") == false).length > 6) {
        this.removeAllBots();
      }
      if (this.loggedTime >= this.closeDuration) {
        this.status = 2;
        randomInfected = Math.floor(Math.random() * players.length);
        players[randomInfected].infected = true;
        players[randomInfected].speed = Constants.DEFAULT_INFECTED_SPEED;
      }
    } else if (players.length == 0) {
      this.status = 0;
    } else {
      this.closeDuration = Date.now() + Constants.WAITING_TIME;
    }
  }

  if (this.status == 2) {
    while (this.powerups.length < Constants.MAX_POWERUP_COUNT) {
      this.powerups.push(Powerup.prototype.create());
    }
    this.closeDuration = Date.now() + Constants.RESET_SERVER_TIME; // 2 seconds to close server
    if (this.players.values().filter((player) => player.id.includes("@bot") == false).length == 0) {
      this.winner = null;
      this.status = 4;
    }
    if (this.players.values().filter((player) => player.infected == false).length <= 1) {
      if (this.players.values().filter((player) => player.infected == false).length == 1) {
        if (this.players.values().filter((player) => player.infected == false)[0].username.length > 20) {
          this.winner = this.players.values().filter((player) => player.infected == false)[0].username.substring(0, 20) + "...";
        } else {
          this.winner = this.players.values().filter((player) => player.infected == false)[0].username;
        }
        this.status = 3;
      } else {
        this.winner = null;
        this.status = 4;
      }
    } else if (this.players.values().filter((player) => player.infected == true).length <= 0) {
      if (players.length >= 3) {
        randomInfected = Math.floor(Math.random() * players.length);
        players[randomInfected].infected = true;
        players[randomInfected].speed = Constants.DEFAULT_INFECTED_SPEED;
      } else {
        this.winner = "";
        for (x = 0; x < this.players.values().filter((player) => player.infected == false).length; x++) {
          if (this.players.values().filter((player) => player.infected == false)[x].username.length > 20) {
            this.winner = this.winner + (this.players.values().filter((player) => player.infected == false)[x].username.substring(0, 20) + "...") + " & ";
          } else {
            this.winner = this.winner + this.players.values().filter((player) => player.infected == false)[x].username + " & ";
          }
        }
        this.winner = this.winner.slice(0, -3);
        this.status = 5;
      }
    } else {
      var powerups = this.powerups;
      // Collision with other player
      for (var i = 0; i < players.length; ++i) {
        players[i].update();
        players[i].ai(players, powerups);
        for (var j = i + 1; j < players.length; ++j) {
          p1 = players[i];
          p2 = players[j];
          minDistance = (p1.hitbox + p2.hitbox);
          collided = Util.getEuclideanDistance2(p1.position, p2.position) <=
            (minDistance * minDistance);
          if (collided == true) {
            if (p1.infected == true && p2.infected == false && p2.invincible == false) {
              p2.infected = true;
              p2.speed = Constants.DEFAULT_INFECTED_SPEED;
              p1.infectedCount = p1.infectedCount + 1;
            } else if (p1.infected == false && p2.infected == true && p1.invincible == false) {
              p1.infected = true;
              p1.speed = Constants.DEFAULT_INFECTED_SPEED;
              p2.infectedCount = p2.infectedCount + 1;
            }
            var vCollision = { x: p2.x - p1.x, y: p2.y - p1.y };
            var distance = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
            var vCollisionNorm = { x: vCollision.x / distance, y: vCollision.y / distance };
            if (p1.x > Constants.WORLD_MIN && p1.x < Constants.WORLD_MAX && p1.y > Constants.WORLD_MIN && p1.y < Constants.WORLD_MAX && p2.x > Constants.WORLD_MIN && p2.x < Constants.WORLD_MAX && p2.y > Constants.WORLD_MIN && p2.y < Constants.WORLD_MAX) {
              p1.x -= (2 * vCollisionNorm.x);
              p1.y -= (2 * vCollisionNorm.y);
              p2.x += (2 * vCollisionNorm.x);
              p2.y += (2 * vCollisionNorm.y);
            }
          }
        }
        // Collision with the powerup entity
        for (var x = 0; x < powerups.length; ++x) {
          var p = players[i];
          var e = powerups[x];
          minDistance = (p.hitbox + 20);
          powerups_collided = Util.getEuclideanDistance2(p.position, e.position) <=
            (minDistance * minDistance);
          if (powerups_collided == true && p.infected == false && e.destroyed == false && Date.now() >= p.powerupCooldown && e.forInfected == false) {
            p.powerupCooldown = Date.now() + e.duration + Constants.POWERUP_COOLDOWN;
            e.expirationTime = Date.now() + e.duration;
            e.junky = p.id;
            e.destroyed = true;
            if (e.key == "speed") {
              p.speed = Constants.POWERUP_SPEED;
            } else if (e.key == "invincible") {
              p.invincible = true;
            } else if (e.key == "invisible") {
              p.invisible = true;
            }
          } else if (p.infected == false && e.junky == p.id && Date.now() >= e.expirationTime) {
            e.expirationTime = 0;
            e.destroyed = false;
            e.position = [Util.randRange(Constants.WORLD_MIN, Constants.WORLD_MAX), Util.randRange(Constants.WORLD_MIN, Constants.WORLD_MAX)];
            e.junky = "";
            if (e.key == "speed") {
              p.speed = Constants.DEFAULT_SURVIVOR_SPEED;
            } else if (e.key == "invincible") {
              p.invincible = false;
            } else if (e.key == "invisible") {
              p.invisible = false;
            }
          } else if (powerups_collided == true && p.infected == true && e.destroyed == false && Date.now() >= p.powerupCooldown && e.forInfected == true) {
            p.powerupCooldown = Date.now() + e.duration + Constants.POWERUP_COOLDOWN;
            e.expirationTime = Date.now() + e.duration;
            e.junky = p.id;
            e.destroyed = true;
            if (e.key == "giant") {
              p.hitbox = Constants.POWERUP_GIANT;
            } else if (e.key == "zspeed") {
              p.speed = Constants.POWERUP_ZSPEED;
            }
          } else if (p.infected == true && e.junky == p.id && Date.now() >= e.expirationTime) {
            e.expirationTime = 0;
            e.destroyed = false;
            e.position = [Util.randRange(Constants.WORLD_MIN, Constants.WORLD_MAX), Util.randRange(Constants.WORLD_MIN, Constants.WORLD_MAX)];
            e.junky = "";
            if (e.key == "giant") {
              p.hitbox = Constants.HITBOX;
            } else if (e.key == "zspeed") {
              p.speed = Constants.DEFAULT_INFECTED_SPEED;
            }
          }
        }
      }
    }
  }

  if (this.status >= 3) {
    this.loggedTime = Date.now();
    if (this.loggedTime >= this.closeDuration) {
      this.removeAll();
      this.resetGame();
    }
  }

};

// Sends the state of the game to every client
Game.prototype.sendState = function () {
  var ids = this.clients.keys();
  for (var i = 0; i < ids.length; ++i) {
    this.clients.get(ids[i]).emit('update', {
      survivor_count: this.players.values().filter((player) => player.infected == false).length,
      infected_count: this.players.values().filter((player) => player.infected == true).length,
      player_data: this.players.values(),
      powerups: this.powerups.filter((powerup) => powerup.destroyed == false),
      self: this.players.get(ids[i]),
      players: this.players.values().filter((player) => player.id != ids[i]),
      winner: this.winner,
      status: this.status,
      loggedTime: this.loggedTime,
      closingTime: this.closeDuration,
    });
  }
};

module.exports = Game; // Exporting the Game class