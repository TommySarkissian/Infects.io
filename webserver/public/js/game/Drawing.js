// Creates a Drawing object.
function Drawing(context) {
  this.context = context; // Set the drawing context.
}

// Factory method for creating a Drawing object.
Drawing.create = function (context) {
  return new Drawing(context); // Return a new Drawing object.
};

// Creates and returns an Image object.
Drawing.createImage = function (src, width, height) {
  var image = new Image(width, height); // Create a new Image object.
  image.src = src; // Set the image source.
  return image; // Return the Image object.
};

// Clears the canvas context.
Drawing.prototype.clear = function () {
  var canvas = this.context.canvas; // Get the canvas element.
  this.context.clearRect(0, 0, window.innerWidth, window.innerHeight); // Clear the canvas.
};

// Draws the player character on the canvas.
Drawing.prototype.drawSelf = function (x, y, size, rotation, name, skin, infected, player_infectedCount, invisible, invincible, status) {
  magnification = canvas.width / 17; // Set magnification based on canvas width.
  this.context.save(); // Save the current state.
  this.context.translate(canvas.width / 2, canvas.height / 2); // Move the canvas origin to the center.
  this.context.translate(-x, -y); // Center the canvas to the player.
  this.context.save(); // Save the current state.
  this.context.translate(x, y); // Translate to player position.
  this.context.rotate(rotation * Math.PI / 180); // Rotate the context.
  this.context.globalAlpha = (infected == false && invisible == true) ? 0.3 : 1; // Set transparency.

  if (infected == false) {
    if (invincible == true) {
      this.context.beginPath(); // Start a new path.
      this.context.arc(0, 0, size * 2, 0, 2 * Math.PI); // Draw a circle.
      this.context.lineWidth = 3; // Set line width.
      this.context.strokeStyle = "aqua"; // Set stroke color.
      this.context.globalAlpha = 0.3; // Set transparency.
      this.context.fillStyle = "aqua"; // Set fill color.
      this.context.fill(); // Fill the circle.
      this.context.stroke(); // Stroke the circle.
      this.context.globalAlpha = 1; // Reset transparency.
    }
    // Draw backpack.
    this.context.rotate(90 * Math.PI / 180); // Rotate 90 degrees.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = skin[2].substring(0, 7); // Set fill color.
    this.context.arc(0, size * 0.6, size * 0.85, 0, Math.PI); // Draw an arc.
    this.context.fill(); // Fill the arc.
    this.context.rotate(-90 * Math.PI / 180); // Rotate back.

    // Draw body.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = skin[0].substring(0, 7); // Set fill color.
    this.context.arc(0, 0, size, 0, Math.PI * 2); // Draw a circle.
    this.context.fill(); // Fill the circle.

    // Draw backpack strap (right).
    this.context.rotate(20 * Math.PI / 180); // Rotate 20 degrees.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = skin[2].substring(0, 7); // Set fill color.
    this.context.rect(-size * 0.9, size * 0.6, size * 1.6, size * 0.25); // Draw a rectangle.
    this.context.arc(size * 0.7, size * 0.72, size * 0.12, 0, Math.PI * 2); // Draw a small circle.
    this.context.fill(); // Fill the shapes.
    this.context.rotate(-20 * Math.PI / 180); // Rotate back.

    // Draw backpack strap (left).
    this.context.rotate(-20 * Math.PI / 180); // Rotate 20 degrees.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = skin[2].substring(0, 7); // Set fill color.
    this.context.rect(-size * 0.9, -size * 0.85, size * 1.6, size * 0.25); // Draw a rectangle.
    this.context.arc(size * 0.7, -size * 0.72, size * 0.12, 0, Math.PI * 2); // Draw a small circle.
    this.context.fill(); // Fill the shapes.
    this.context.rotate(20 * Math.PI / 180); // Rotate back.

    // Draw eyes.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = "white"; // Set fill color.
    this.context.arc(size * 0.35, size * 0.4, size * 0.3, 0, Math.PI * 2); // Draw a circle.
    this.context.arc(size * 0.35, -size * 0.4, size * 0.3, 0, Math.PI * 2); // Draw another circle.
    this.context.fill(); // Fill the circles.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = "black"; // Set fill color.
    this.context.arc(size * 0.45, size * 0.4, size * 0.2, 0, Math.PI * 2); // Draw a small circle.
    this.context.arc(size * 0.45, -size * 0.4, size * 0.2, 0, Math.PI * 2); // Draw another small circle.
    this.context.fill(); // Fill the circles.

    // Draw mouth.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = "black"; // Set fill color.
    this.context.arc(size * 0.75, size * 0.1, size * 0.05, 0, Math.PI * 2); // Draw a small circle.
    this.context.rect(size * 0.7, -size * 0.1, size * 0.1, size * 0.2); // Draw a rectangle.
    this.context.arc(size * 0.75, -size * 0.1, size * 0.05, 0, Math.PI * 2); // Draw another small circle.
    this.context.fill(); // Fill the shapes.
  } else {
    // Draw hands.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = skin[1].substring(0, 7); // Set fill color.
    this.context.arc(size * 1.55, size * 1.03, size * 0.35, 0, Math.PI * 2); // Draw a circle.
    this.context.arc(size * 1.55, -size * 1.03, size * 0.35, 0, Math.PI * 2); // Draw another circle.
    this.context.fill(); // Fill the circles.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = skin[1].substring(0, 7); // Set fill color.
    this.context.arc(size * 1.55, size * 0.75, size * 0.15, 0, Math.PI * 2); // Draw a small circle.
    this.context.arc(size * 1.55, -size * 0.75, size * 0.15, 0, Math.PI * 2); // Draw another small circle.
    this.context.fill(); // Fill the circles.

    // Draw arms.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = skin[2].substring(0, 7); // Set fill color.
    this.context.arc(0, size * 0.9, size * 0.5, 0, Math.PI * 2); // Draw a circle.
    this.context.rect(0, size * 0.65, size * 1.35, size * 0.75); // Draw a rectangle.
    this.context.arc(0, -size * 0.9, size * 0.5, 0, Math.PI * 2); // Draw another circle.
    this.context.rect(0, -size * 1.4, size * 1.35, size * 0.75); // Draw another rectangle.
    this.context.fill(); // Fill the shapes.

    // Draw body.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = skin[1].substring(0, 7); // Set fill color.
    this.context.arc(0, 0, size, 0, Math.PI * 2); // Draw a circle.
    this.context.fill(); // Fill the circle.

    // Draw eyes.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = "white"; // Set fill color.
    this.context.arc(size * 0.35, size * 0.4, size * 0.3, 0, Math.PI * 2); // Draw a circle.
    this.context.arc(size * 0.35, -size * 0.4, size * 0.3, 0, Math.PI * 2); // Draw another circle.
    this.context.fill(); // Fill the circles.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = "black"; // Set fill color.
    this.context.arc(size * 0.45, size * 0.4, size * 0.2, 0, Math.PI * 2); // Draw a small circle.
    this.context.arc(size * 0.45, -size * 0.4, size * 0.2, 0, Math.PI * 2); // Draw another small circle.
    this.context.fill(); // Fill the circles.

    // Draw mouth.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = "black"; // Set fill color.
    this.context.arc(size * 0.75, size * 0.1, size * 0.12, 0, Math.PI * 2); // Draw a small circle.
    this.context.rect(size * 0.63, -size * 0.1, size * 0.24, size * 0.22); // Draw a rectangle.
    this.context.arc(size * 0.75, -size * 0.1, size * 0.12, 0, Math.PI * 2); // Draw another small circle.
    this.context.fill(); // Fill the shapes.
  }

  this.context.restore(); // Restore the saved state.
  this.context.font = "15px Arial"; // Set font.
  this.context.textAlign = "center"; // Set text alignment.
  this.context.globalAlpha = 0.5; // Set transparency.
  this.context.fillStyle = "white"; // Set fill color.
  this.context.fillText(name, x, y + size * 2); // Draw player name.
  this.context.translate(x, y); // Translate to player position.
  this.context.translate(-canvas.width / 2, -canvas.height / 2); // Translate back to original position.

  // Draw infection status.
  if (infected == true && status == 2) {
    if (player_infectedCount == 0) {
      this.context.globalAlpha = 0.1; // Set transparency.
      this.context.save(); // Save the current state.
      this.context.translate(magnification * 0.6, magnification * 0.85); // Translate context.
      this.context.beginPath(); // Start a new path.
      this.context.fillStyle = "white"; // Set fill color.
      this.context.arc(0, magnification * 0.28, magnification * 0.3, 0, Math.PI); // Draw an arc.
      this.context.fill(); // Fill the arc.
      this.context.beginPath(); // Start a new path.
      this.context.fillStyle = "white"; // Set fill color.
      this.context.rect(-magnification * 0.3, 0, magnification * 0.6, magnification * 0.3); // Draw a rectangle.
      this.context.fill(); // Fill the rectangle.
      this.context.beginPath(); // Start a new path.
      this.context.fillStyle = "white"; // Set fill color.
      this.context.rect(-magnification * 0.3, -magnification * 0.3, magnification * 0.6, magnification * 0.3); // Draw another rectangle.
      this.context.fill(); // Fill the rectangle.
      this.context.rotate(180 * Math.PI / 180); // Rotate context.
      this.context.beginPath(); // Start a new path.
      this.context.fillStyle = "white"; // Set fill color.
      this.context.arc(0, magnification * 0.28, magnification * 0.3, 0, Math.PI); // Draw an arc.
      this.context.fill(); // Fill the arc.
      this.context.rotate(-180 * Math.PI / 180); // Rotate back.
      this.context.restore(); // Restore the saved state.
      this.context.globalAlpha = 0.5; // Set transparency.
    } else if (player_infectedCount == 1) {
      this.context.globalAlpha = 1; // Set transparency.
      this.context.save(); // Save the current state.
      this.context.translate(magnification * 0.6, magnification * 0.85); // Translate context.
      this.context.beginPath(); // Start a new path.
      this.context.fillStyle = "fuchsia"; // Set fill color.
      this.context.arc(0, magnification * 0.28, magnification * 0.3, 0, Math.PI); // Draw an arc.
      this.context.fill(); // Fill the arc.
      this.context.globalAlpha = 0.1; // Set transparency.
      this.context.beginPath(); // Start a new path.
      this.context.fillStyle = "white"; // Set fill color.
      this.context.rect(-magnification * 0.3, 0, magnification * 0.6, magnification * 0.3); // Draw a rectangle.
      this.context.fill(); // Fill the rectangle.
      this.context.beginPath(); // Start a new path.
      this.context.fillStyle = "white"; // Set fill color.
      this.context.rect(-magnification * 0.3, -magnification * 0.3, magnification * 0.6, magnification * 0.3); // Draw another rectangle.
      this.context.fill(); // Fill the rectangle.
      this.context.rotate(180 * Math.PI / 180); // Rotate context.
      this.context.globalAlpha = 1; // Set transparency.
      this.context.beginPath(); // Start a new path.
      this.context.fillStyle = "maroon"; // Set fill color.
      this.context.arc(0, magnification * 0.28, magnification * 0.3, 0, Math.PI); // Draw an arc.
      this.context.fill(); // Fill the arc.
      this.context.rotate(-180 * Math.PI / 180); // Rotate back.
      this.context.restore(); // Restore the saved state.
      this.context.globalAlpha = 0.5; // Set transparency.
    } else if (player_infectedCount >= 2) {
      this.context.globalAlpha = 1; // Set transparency.
      this.context.save(); // Save the current state.
      this.context.translate(magnification * 0.6, magnification * 0.85); // Translate context.
      this.context.beginPath(); // Start a new path.
      this.context.fillStyle = "fuchsia"; // Set fill color.
      this.context.arc(0, magnification * 0.28, magnification * 0.3, 0, Math.PI); // Draw an arc.
      this.context.fill(); // Fill the arc.
      this.context.beginPath(); // Start a new path.
      this.context.fillStyle = "fuchsia"; // Set fill color.
      this.context.rect(-magnification * 0.3, 0, magnification * 0.6, magnification * 0.3); // Draw a rectangle.
      this.context.fill(); // Fill the rectangle.
      this.context.beginPath(); // Start a new path.
      this.context.fillStyle = "maroon"; // Set fill color.
      this.context.rect(-magnification * 0.3, -magnification * 0.3, magnification * 0.6, magnification * 0.3); // Draw another rectangle.
      this.context.fill(); // Fill the rectangle.
      this.context.rotate(180 * Math.PI / 180); // Rotate context.
      this.context.beginPath(); // Start a new path.
      this.context.fillStyle = "maroon"; // Set fill color.
      this.context.arc(0, magnification * 0.28, magnification * 0.3, 0, Math.PI); // Draw an arc.
      this.context.fill(); // Fill the arc.
      this.context.rotate(-180 * Math.PI / 180); // Rotate back.
      this.context.restore(); // Restore the saved state.
      document.getElementById("respawn").style.display = "block"; // Show respawn button.
    }
  }
  this.context.restore(); // Restore the saved state.
};

// Draws other players on the canvas.
Drawing.prototype.drawOther = function (player_x, player_y, player_infected, x, y, size, rotation, name, skin, infected, invisible, invincible) {
  this.context.save(); // Save the current state.
  this.context.translate(canvas.width / 2, canvas.height / 2); // Move the canvas origin to the center.
  this.context.translate(-player_x, -player_y); // Move other players relative to the main player.
  this.context.save(); // Save the current state.
  this.context.translate(x, y); // Translate to player position.
  this.context.rotate(rotation * Math.PI / 180); // Rotate the context.
  this.context.globalAlpha = (infected == false && invisible == true) ? 0 : 1; // Set transparency.

  if (infected == false) {
    if (invincible == true) {
      this.context.beginPath(); // Start a new path.
      this.context.arc(0, 0, size * 2, 0, 2 * Math.PI); // Draw a circle.
      this.context.lineWidth = 3; // Set line width.
      this.context.strokeStyle = "aqua"; // Set stroke color.
      this.context.globalAlpha = 0.3; // Set transparency.
      this.context.fillStyle = "aqua"; // Set fill color.
      this.context.fill(); // Fill the circle.
      this.context.stroke(); // Stroke the circle.
      this.context.globalAlpha = 1; // Reset transparency.
    }
    // Draw backpack.
    this.context.rotate(90 * Math.PI / 180); // Rotate 90 degrees.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = skin[2].substring(0, 7); // Set fill color.
    this.context.arc(0, size * 0.6, size * 0.85, 0, Math.PI); // Draw an arc.
    this.context.fill(); // Fill the arc.
    this.context.rotate(-90 * Math.PI / 180); // Rotate back.

    // Draw body.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = skin[0].substring(0, 7); // Set fill color.
    this.context.arc(0, 0, size, 0, Math.PI * 2); // Draw a circle.
    this.context.fill(); // Fill the circle.

    // Draw backpack strap (right).
    this.context.rotate(20 * Math.PI / 180); // Rotate 20 degrees.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = skin[2].substring(0, 7); // Set fill color.
    this.context.rect(-size * 0.9, size * 0.6, size * 1.6, size * 0.25); // Draw a rectangle.
    this.context.arc(size * 0.7, size * 0.72, size * 0.12, 0, Math.PI * 2); // Draw a small circle.
    this.context.fill(); // Fill the shapes.
    this.context.rotate(-20 * Math.PI / 180); // Rotate back.

    // Draw backpack strap (left).
    this.context.rotate(-20 * Math.PI / 180); // Rotate 20 degrees.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = skin[2].substring(0, 7); // Set fill color.
    this.context.rect(-size * 0.9, -size * 0.85, size * 1.6, size * 0.25); // Draw a rectangle.
    this.context.arc(size * 0.7, -size * 0.72, size * 0.12, 0, Math.PI * 2); // Draw a small circle.
    this.context.fill(); // Fill the shapes.
    this.context.rotate(20 * Math.PI / 180); // Rotate back.

    // Draw eyes.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = "white"; // Set fill color.
    this.context.arc(size * 0.35, size * 0.4, size * 0.3, 0, Math.PI * 2); // Draw a circle.
    this.context.arc(size * 0.35, -size * 0.4, size * 0.3, 0, Math.PI * 2); // Draw another circle.
    this.context.fill(); // Fill the circles.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = "black"; // Set fill color.
    this.context.arc(size * 0.45, size * 0.4, size * 0.2, 0, Math.PI * 2); // Draw a small circle.
    this.context.arc(size * 0.45, -size * 0.4, size * 0.2, 0, Math.PI * 2); // Draw another small circle.
    this.context.fill(); // Fill the circles.

    // Draw mouth.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = "black"; // Set fill color.
    this.context.arc(size * 0.75, size * 0.1, size * 0.05, 0, Math.PI * 2); // Draw a small circle.
    this.context.rect(size * 0.7, -size * 0.1, size * 0.1, size * 0.2); // Draw a rectangle.
    this.context.arc(size * 0.75, -size * 0.1, size * 0.05, 0, Math.PI * 2); // Draw another small circle.
    this.context.fill(); // Fill the shapes.
  } else {
    // Draw hands.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = skin[1].substring(0, 7); // Set fill color.
    this.context.arc(size * 1.55, size * 1.03, size * 0.35, 0, Math.PI * 2); // Draw a circle.
    this.context.arc(size * 1.55, -size * 1.03, size * 0.35, 0, Math.PI * 2); // Draw another circle.
    this.context.fill(); // Fill the circles.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = skin[1].substring(0, 7); // Set fill color.
    this.context.arc(size * 1.55, size * 0.75, size * 0.15, 0, Math.PI * 2); // Draw a small circle.
    this.context.arc(size * 1.55, -size * 0.75, size * 0.15, 0, Math.PI * 2); // Draw another small circle.
    this.context.fill(); // Fill the circles.

    // Draw arms.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = skin[2].substring(0, 7); // Set fill color.
    this.context.arc(0, size * 0.9, size * 0.5, 0, Math.PI * 2); // Draw a circle.
    this.context.rect(0, size * 0.65, size * 1.35, size * 0.75); // Draw a rectangle.
    this.context.arc(0, -size * 0.9, size * 0.5, 0, Math.PI * 2); // Draw another circle.
    this.context.rect(0, -size * 1.4, size * 1.35, size * 0.75); // Draw another rectangle.
    this.context.fill(); // Fill the shapes.

    // Draw body.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = skin[1].substring(0, 7); // Set fill color.
    this.context.arc(0, 0, size, 0, Math.PI * 2); // Draw a circle.
    this.context.fill(); // Fill the circle.

    // Draw eyes.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = "white"; // Set fill color.
    this.context.arc(size * 0.35, size * 0.4, size * 0.3, 0, Math.PI * 2); // Draw a circle.
    this.context.arc(size * 0.35, -size * 0.4, size * 0.3, 0, Math.PI * 2); // Draw another circle.
    this.context.fill(); // Fill the circles.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = "black"; // Set fill color.
    this.context.arc(size * 0.45, size * 0.4, size * 0.2, 0, Math.PI * 2); // Draw a small circle.
    this.context.arc(size * 0.45, -size * 0.4, size * 0.2, 0, Math.PI * 2); // Draw another small circle.
    this.context.fill(); // Fill the circles.

    // Draw mouth.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = "black"; // Set fill color.
    this.context.arc(size * 0.75, size * 0.1, size * 0.12, 0, Math.PI * 2); // Draw a small circle.
    this.context.rect(size * 0.63, -size * 0.1, size * 0.24, size * 0.22); // Draw a rectangle.
    this.context.arc(size * 0.75, -size * 0.1, size * 0.12, 0, Math.PI * 2); // Draw another small circle.
    this.context.fill(); // Fill the shapes.
  }

  this.context.restore(); // Restore the saved state.
  this.context.textAlign = "center"; // Set text alignment.

  // Set player name style.
  if (player_infected == false) {
    if (infected == true) {
      this.context.globalAlpha = 1; // Set transparency.
      this.context.font = "Bold 15px Arial"; // Set font.
      this.context.fillStyle = "maroon"; // Set fill color.
    } else {
      this.context.globalAlpha = 0.5; // Set transparency.
      this.context.font = "normal 15px Arial"; // Set font.
      this.context.fillStyle = "white"; // Set fill color.
    }
  } else {
    if (infected == true) {
      this.context.globalAlpha = 0.5; // Set transparency.
      this.context.font = "normal 15px Arial"; // Set font.
      this.context.fillStyle = "white"; // Set fill color.
    } else {
      this.context.globalAlpha = (invisible == true) ? 0 : 1; // Set transparency.
      this.context.font = "Bold 15px Arial"; // Set font.
      this.context.fillStyle = "fuchsia"; // Set fill color.
    }
  }

  this.context.fillText(name, x, y + size * 2); // Draw player name.
  this.context.restore(); // Restore the saved state.
};

// Draws the background on the canvas.
Drawing.prototype.drawBackground = function (player_x, player_y, infected) {
  this.context.save(); // Save the current state.
  this.context.translate(canvas.width / 2, canvas.height / 2); // Move the canvas origin to the center.
  this.context.translate(-player_x, -player_y); // Move background relative to the player.

  if (infected == true) {
    this.context.fillStyle = "black"; // Set fill color.
    this.context.fillRect(-1250, -1250, 7500, 7500); // Fill the background.
    for (var x = -1250; x <= 7500; x += 200) {
      for (var y = -1250; y <= 7500; y += 200) {
        this.context.globalAlpha = 0.3; // Set transparency.
        this.context.beginPath(); // Start a new path.
        this.context.fillStyle = (x < 0 || y < 0 || x > 5000 || y > 5000) ? "white" : "darkslategray"; // Set fill color.
        this.context.arc(x - 50, y - 50, 200, 0, 2 * Math.PI); // Draw a circle.
        this.context.fill(); // Fill the circle.
      }
    }
  } else {
    this.context.fillStyle = "black"; // Set fill color.
    this.context.fillRect(-1250, -1250, 7500, 7500); // Fill the background.
    for (var x = -1250; x <= 7500; x += 200) {
      for (var y = -1250; y <= 7500; y += 200) {
        this.context.globalAlpha = 0.3; // Set transparency.
        this.context.beginPath(); // Start a new path.
        this.context.fillStyle = (x < 0 || y < 0 || x > 5000 || y > 5000) ? "black" : "darkolivegreen"; // Set fill color.
        this.context.arc(x - 50, y - 50, 200, 0, 2 * Math.PI); // Draw a circle.
        this.context.fill(); // Fill the circle.
      }
    }
  }

  this.context.restore(); // Restore the saved state.
};

// Draws power-ups on the canvas.
Drawing.prototype.drawPowerups = function (key, forInfected, player_x, player_y, player_infected, x, y, size, powerupCooldown) {
  this.context.save(); // Save the current state.
  this.context.translate(canvas.width / 2, canvas.height / 2); // Move the canvas origin to the center.
  this.context.translate(-player_x, -player_y); // Move background relative to the player.
  this.context.save(); // Save the current state.
  this.context.translate(x, y); // Translate to power-up position.

  if (forInfected == false) {
    this.context.globalAlpha = (player_infected == false && Date.now() >= powerupCooldown) ? 1 : 0.2; // Set transparency.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = (key == "speed") ? "fuchsia" : (key == "invincible") ? "gold" : "peru"; // Set fill color.
    this.context.arc(0, (size * 0.5) - 0.25, size * 0.5, 0, Math.PI); // Draw an arc.
    this.context.fill(); // Fill the arc.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = (key == "speed") ? "fuchsia" : (key == "invincible") ? "gold" : "peru"; // Set fill color.
    this.context.rect(-size * 0.5, 0, size, size * 0.5); // Draw a rectangle.
    this.context.fill(); // Fill the rectangle.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = (key == "speed") ? "maroon" : (key == "invincible") ? "aqua" : "lime"; // Set fill color.
    this.context.rect(-size * 0.5, -size * 0.5, size, size * 0.5); // Draw another rectangle.
    this.context.fill(); // Fill the rectangle.
    this.context.rotate(180 * Math.PI / 180); // Rotate context.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = (key == "speed") ? "maroon" : (key == "invincible") ? "aqua" : "lime"; // Set fill color.
    this.context.arc(0, (size * 0.5) - 0.25, size * 0.5, 0, Math.PI); // Draw an arc.
    this.context.fill(); // Fill the arc.
    this.context.rotate(-180 * Math.PI / 180); // Rotate back.
  } else {
    this.context.globalAlpha = (player_infected == true && Date.now() >= powerupCooldown) ? 1 : 0.2; // Set transparency.
    this.context.beginPath(); // Start a new path.
    this.context.fillStyle = (key == "zspeed") ? "plum" : "purple"; // Set fill color.
    this.context.arc(0, 0, size, Math.PI, Math.PI * 2); // Draw an arc.
    this.context.fill(); // Fill the arc.
    this.context.beginPath(); // Start a new path.
    this.context.moveTo(-size, -0.25); // Move to start point.
    this.context.bezierCurveTo(-size * 0.75, size * 0.75, size * 0.75, size * 0.75, size, -0.25); // Draw a bezier curve.
    this.context.fill(); // Fill the shape.
    this.context.fillStyle = (key == "zspeed") ? "pink" : "orchid"; // Set fill color.
    this.context.beginPath(); // Start a new path.
    this.context.arc(0, 0, size * 0.75, Math.PI, Math.PI * 2); // Draw an arc.
    this.context.fill(); // Fill the arc.
    this.context.beginPath(); // Start a new path.
    this.context.moveTo(-size * 0.75, -0.25); // Move to start point.
    this.context.bezierCurveTo(-size * 0.75 * 0.75, size * 0.75 * 0.75, size * 0.75 * 0.75, size * 0.75 * 0.75, size * 0.75, -0.25); // Draw a bezier curve.
    this.context.fill(); // Fill the shape.
    this.context.fillStyle = (key == "zspeed") ? "plum" : "purple"; // Set fill color.
    this.context.beginPath(); // Start a new path.
    this.context.arc(0, 0, size * 0.75 * 0.75, Math.PI, Math.PI * 2); // Draw an arc.
    this.context.fill(); // Fill the arc.
    this.context.beginPath(); // Start a new path.
    this.context.moveTo(-size * 0.75 * 0.75, -0.25); // Move to start point.
    this.context.bezierCurveTo(-size * 0.75 * 0.75 * 0.75, size * 0.75 * 0.75 * 0.75, size * 0.75 * 0.75 * 0.75, size * 0.75 * 0.75 * 0.75, size * 0.75 * 0.75, -0.25); // Draw a bezier curve.
    this.context.fill(); // Fill the shape.
    this.context.fillStyle = (key == "zspeed") ? "pink" : "orchid"; // Set fill color.
    this.context.beginPath(); // Start a new path.
    this.context.arc(0, 0, size * 0.75 * 0.75 * 0.75, Math.PI, Math.PI * 2); // Draw an arc.
    this.context.fill(); // Fill the arc.
    this.context.beginPath(); // Start a new path.
    this.context.moveTo(-size * 0.75 * 0.75 * 0.75, -0.25); // Move to start point.
    this.context.bezierCurveTo(-size * 0.75 * 0.75 * 0.75 * 0.75, size * 0.75 * 0.75 * 0.75 * 0.75, size * 0.75 * 0.75 * 0.75 * 0.75, size * 0.75 * 0.75 * 0.75 * 0.75, size * 0.75 * 0.75 * 0.75, -0.25); // Draw a bezier curve.
    this.context.fill(); // Fill the shape.
  }

  this.context.restore(); // Restore the saved state.
  this.context.restore(); // Restore the saved state.
};

// Draws the HUD on the canvas.
Drawing.prototype.drawHud = function (infected, status) {
  shadow = 50; // Set shadow size.
  magnification = canvas.width / 17; // Set magnification based on canvas width.
  this.context.save(); // Save the current state.

  if (infected == false) {
    this.context.globalAlpha = 0.5; // Set transparency.
    this.context.beginPath(); // Start a new path.
    this.context.moveTo(0, 0); // Move to start point.
    this.context.lineTo(0, canvas.height); // Draw line to bottom left.
    this.context.lineTo(canvas.width / 2, canvas.height); // Draw line to bottom center.
    this.context.lineTo(canvas.width / 2, canvas.height - shadow); // Draw line up by shadow size.
    this.context.bezierCurveTo(((canvas.width / 2) - (canvas.height / 1.5)) + shadow, canvas.height - shadow, ((canvas.width / 2) - (canvas.height / 1.5)) + shadow, shadow, canvas.width / 2, shadow); // Draw a bezier curve.
    this.context.lineTo(canvas.width / 2, 0); // Draw line to top center.
    this.context.closePath(); // Close the path.
    this.context.fill(); // Fill the shape.
    this.context.beginPath(); // Start a new path.
    this.context.moveTo(canvas.width, 0); // Move to top right.
    this.context.lineTo(canvas.width, canvas.height); // Draw line to bottom right.
    this.context.lineTo(canvas.width / 2, canvas.height); // Draw line to bottom center.
    this.context.lineTo(canvas.width / 2, canvas.height - shadow); // Draw line up by shadow size.
    this.context.bezierCurveTo((canvas.width - ((canvas.width / 2) - (canvas.height / 1.5))) - shadow, canvas.height - shadow, (canvas.width - ((canvas.width / 2) - (canvas.height / 1.5))) - shadow, shadow, canvas.width / 2, shadow); // Draw a bezier curve.
    this.context.lineTo(canvas.width / 2, 0); // Draw line to top center.
    this.context.closePath(); // Close the path.
    this.context.fill(); // Fill the shape.
    this.context.globalAlpha = 1; // Reset transparency.
    this.context.beginPath(); // Start a new path.
    this.context.moveTo(0, 0); // Move to top left.
    this.context.lineTo(0, canvas.height); // Draw line to bottom left.
    this.context.lineTo(canvas.width / 2, canvas.height); // Draw line to bottom center.
    this.context.bezierCurveTo((canvas.width / 2) - (canvas.height / 1.5), canvas.height, (canvas.width / 2) - (canvas.height / 1.5), 0, canvas.width / 2, 0); // Draw a bezier curve.
    this.context.closePath(); // Close the path.
    this.context.fill(); // Fill the shape.
    this.context.beginPath(); // Start a new path.
    this.context.moveTo(canvas.width, 0); // Move to top right.
    this.context.lineTo(canvas.width, canvas.height); // Draw line to bottom right.
    this.context.lineTo(canvas.width / 2, canvas.height); // Draw line to bottom center.
    this.context.bezierCurveTo(canvas.width - ((canvas.width / 2) - (canvas.height / 1.5)), canvas.height, canvas.width - ((canvas.width / 2) - (canvas.height / 1.5)), 0, canvas.width / 2, 0); // Draw a bezier curve.
    this.context.closePath(); // Close the path.
    this.context.fill(); // Fill the shape.
  }

  // Draw status text.
  if (status == 2) {
    this.context.textAlign = "left"; // Set text alignment.
    this.context.font = "Bold 40px Arial"; // Set font.
    if (infected == true) {
      this.context.globalAlpha = 0.5; // Set transparency.
      this.context.fillStyle = "maroon"; // Set fill color.
      this.context.fillText("INFECTED", magnification / 4, canvas.height - magnification / 4); // Draw text.
    } else {
      this.context.globalAlpha = 0.5; // Set transparency.
      this.context.fillStyle = "white"; // Set fill color.
      this.context.fillText("SURVIVOR", magnification / 4, canvas.height - magnification / 4); // Draw text.
    }
  }

  this.context.restore(); // Restore the saved state.
};

// Displays game status on the canvas.
Drawing.prototype.gameStatus = function (playerData, status, winner, loggedTime, closingTime, survivorCount, infectedCount) {
  magnification = canvas.width / 17; // Set magnification based on canvas width.
  this.context.save(); // Save the current state.

  // Display waiting for players.
  if (status == 1) {
    this.context.globalAlpha = 0.9; // Set transparency.
    this.context.fillRect(0, 0, canvas.width, canvas.height); // Fill the background.
    this.context.globalAlpha = 1; // Reset transparency.
    this.context.textAlign = "center"; // Set text alignment.
    this.context.fillStyle = "white"; // Set fill color.
    if (playerData.length >= 3) {
      countdown = ((closingTime - loggedTime) / 1000).toFixed(1); // Calculate countdown.
      this.context.font = "Bold 80px Arial"; // Set font.
      this.context.fillText(countdown.toString(), canvas.width / 2, canvas.height / 2 - 40); // Draw countdown.
    }
    this.context.font = "Bold 20px Arial"; // Set font.
    this.context.fillText("WAITING FOR PLAYERS", canvas.width / 2, canvas.height / 2); // Draw text.
    this.context.font = "12px Arial"; // Set font.
    this.context.globalAlpha = 0.7; // Set transparency.
    this.context.fillText(hint, canvas.width / 2, canvas.height / 2 + 20); // Draw hint text.
    this.context.globalAlpha = 1; // Reset transparency.
    this.context.font = "Bold 20px Arial"; // Set font.
    this.context.fillText("(" + playerData.length + " / 25)", canvas.width / 2, canvas.height / 2 + 60); // Draw player count.
  }

  // Display in-game status.
  if (status == 2) {
    this.context.globalAlpha = 0.5; // Set transparency.
    this.context.fillStyle = "white"; // Set fill color.
    this.context.font = "Bold 15px Arial"; // Set font.
    this.context.textAlign = "right"; // Set text alignment.
    this.context.fillText("INFECTED: " + infectedCount + "  |  SURVIVORS: " + survivorCount, canvas.width - magnification * 0.85, magnification * 0.9); // Draw text.
    this.context.globalAlpha = 1; // Reset transparency.
    this.context.fillStyle = "maroon"; // Set fill color.
    this.context.font = "Bold 20px Arial"; // Set font.
    this.context.textAlign = "right"; // Set text alignment.
    if (survivorCount <= 3) {
      this.context.fillText(survivorCount + " SURVIVORS REMAINING", canvas.width - magnification * 0.85, (magnification + 40) * 0.9); // Draw text.
    }
  }

  // Display end-game status.
  if (status == 3) {
    this.context.textAlign = "center"; // Set text alignment.
    this.context.globalAlpha = 0.9; // Set transparency.
    this.context.fillRect(0, 0, canvas.width, canvas.height); // Fill the background.
    this.context.globalAlpha = 1; // Reset transparency.
    this.context.font = "12px Arial"; // Set font.
    this.context.fillStyle = "white"; // Set fill color.
    this.context.fillText("WE PAY TRIBUTE TO", canvas.width / 2, canvas.height / 2 - 55); // Draw text.
    this.context.font = "Bold 40px Arial"; // Set font.
    this.context.fillText(winner, canvas.width / 2, canvas.height / 2); // Draw winner name.
    this.context.font = "Bold 20px Arial"; // Set font.
    this.context.fillStyle = "maroon"; // Set fill color.
    this.context.fillText("THE LAST SURVIVOR", canvas.width / 2, canvas.height / 2 + 40); // Draw text.
  }

  // Display tribute to last survivors.
  if (status == 5) {
    this.context.textAlign = "center"; // Set text alignment.
    this.context.globalAlpha = 0.9; // Set transparency.
    this.context.fillRect(0, 0, canvas.width, canvas.height); // Fill the background.
    this.context.globalAlpha = 1; // Reset transparency.
    this.context.font = "12px Arial"; // Set font.
    this.context.fillStyle = "white"; // Set fill color.
    this.context.fillText("WE PAY TRIBUTE TO", canvas.width / 2, canvas.height / 2 - 40); // Draw text.
    this.context.font = "Bold 20px Arial"; // Set font.
    this.context.fillText(winner, canvas.width / 2, canvas.height / 2); // Draw winner name.
    this.context.font = "Bold 20px Arial"; // Set font.
    this.context.fillStyle = "maroon"; // Set fill color.
    this.context.fillText("THE LAST SURVIVORS", canvas.width / 2, canvas.height / 2 + 40); // Draw text.
  }

  // Display no survivors message.
  if (status == 4) {
    this.context.textAlign = "center"; // Set text alignment.
    this.context.globalAlpha = 0.9; // Set transparency.
    this.context.fillRect(0, 0, canvas.width, canvas.height); // Fill the background.
    this.context.globalAlpha = 1; // Reset transparency.
    this.context.font = "Bold 40px Arial"; // Set font.
    this.context.fillStyle = "maroon"; // Set fill color.
    this.context.fillText("NO SURVIVORS", canvas.width / 2, canvas.height / 2); // Draw text.
  }

  this.context.restore(); // Restore the saved state.
};
