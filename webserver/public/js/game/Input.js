// Empty constructor for the Input object.
function Input() {
  throw new Error('Input should not be instantiated!');
}

// Empty constructor for the Position object.
function Position() {
  throw new Error('Position should not be instantiated!');
}

// Define Input constants.
Input.LEFT = false;
Input.UP = false;
Input.RIGHT = false;
Input.DOWN = false;
Input.RESPAWN = false;

// Define Position constant.
Position.ROTATION = 90;

// Async function to handle joystick movement.
async function joystickMovement() {
  await new Promise(r => setTimeout(r, 10)); // Delay to simulate async operation.
  // Update Input based on joystick direction.
  if (Joy.GetDir() == "N") {
    Input.UP = true;
    Input.DOWN = false;
    Input.RIGHT = false;
    Input.LEFT = false;
  } else if (Joy.GetDir() == "NE") {
    Input.UP = true;
    Input.DOWN = false;
    Input.RIGHT = true;
    Input.LEFT = false;
  } else if (Joy.GetDir() == "E") {
    Input.UP = false;
    Input.DOWN = false;
    Input.RIGHT = true;
    Input.LEFT = false;
  } else if (Joy.GetDir() == "SE") {
    Input.UP = false;
    Input.DOWN = true;
    Input.RIGHT = true;
    Input.LEFT = false;
  } else if (Joy.GetDir() == "S") {
    Input.UP = false;
    Input.DOWN = true;
    Input.RIGHT = false;
    Input.LEFT = false;
  } else if (Joy.GetDir() == "SW") {
    Input.UP = false;
    Input.DOWN = true;
    Input.RIGHT = false;
    Input.LEFT = true;
  } else if (Joy.GetDir() == "W") {
    Input.UP = false;
    Input.DOWN = false;
    Input.RIGHT = false;
    Input.LEFT = true;
  } else if (Joy.GetDir() == "NW") {
    Input.UP = true;
    Input.DOWN = false;
    Input.RIGHT = false;
    Input.LEFT = true;
  } else {
    Input.UP = false;
    Input.DOWN = false;
    Input.RIGHT = false;
    Input.LEFT = false;
  }

  // Calculate rotation based on joystick position.
  var deltaX = Joy.GetPosX() - 100;
  var deltaY = Joy.GetPosY() - 100;
  var rad = Math.atan2(deltaY, deltaX);
  var deg = rad * (180 / Math.PI);
  Position.ROTATION = deg;
}

// Handle mouse movement for input.
mouseMovement = function (e) {
  // Update Input based on mouse position.
  if (e.pageY <= window.innerHeight * 4 / 10) {
    if (e.pageX < window.innerWidth * 4 / 10) {
      Input.UP = true;
      Input.DOWN = false;
      Input.RIGHT = false;
      Input.LEFT = true;
    } else if (e.pageX > window.innerWidth * 4 / 10 && e.pageX < window.innerWidth * 6 / 10) {
      Input.UP = true;
      Input.DOWN = false;
      Input.RIGHT = false;
      Input.LEFT = false;
    } else {
      Input.UP = true;
      Input.DOWN = false;
      Input.RIGHT = true;
      Input.LEFT = false;
    }
  } else if (e.pageY > window.innerHeight * 4 / 10 && e.pageY < window.innerHeight * 6 / 10) {
    if (e.pageX <= window.innerWidth * 4 / 10) {
      Input.UP = false;
      Input.DOWN = false;
      Input.RIGHT = false;
      Input.LEFT = true;
    } else if (e.pageX > window.innerWidth * 4 / 10 && e.pageX < window.innerWidth * 6 / 10) {
      Input.UP = false;
      Input.DOWN = false;
      Input.RIGHT = false;
      Input.LEFT = false;
    } else {
      Input.UP = false;
      Input.DOWN = false;
      Input.RIGHT = true;
      Input.LEFT = false;
    }
  } else {
    if (e.pageX <= window.innerWidth * 4 / 10) {
      Input.UP = false;
      Input.DOWN = true;
      Input.RIGHT = false;
      Input.LEFT = true;
    } else if (e.pageX > window.innerWidth * 4 / 10 && e.pageX < window.innerWidth * 6 / 10) {
      Input.UP = false;
      Input.DOWN = true;
      Input.RIGHT = false;
      Input.LEFT = false;
    } else {
      Input.UP = false;
      Input.DOWN = true;
      Input.RIGHT = true;
      Input.LEFT = false;
    }
  }

  // Calculate rotation based on mouse position.
  var rad = Math.atan2(e.pageX - window.innerWidth * 1 / 2, -(e.pageY - window.innerHeight * 1 / 2));
  var deg = rad * (180 / Math.PI);
  Position.ROTATION = deg - 90;
}

// Handle key down events for input.
Input.onKeyDown = function (event) {
  switch (event.keyCode) {
    case 37:
    case 65:
      Input.LEFT = true;
      if (Input.UP == true) {
        Position.ROTATION = 225;
      } else if (Input.DOWN == true) {
        Position.ROTATION = 135;
      } else {
        Position.ROTATION = 180;
      }
      break;
    case 38:
    case 87:
      Input.UP = true;
      if (Input.RIGHT == true) {
        Position.ROTATION = 315;
      } else if (Input.LEFT == true) {
        Position.ROTATION = 225;
      } else {
        Position.ROTATION = 270;
      }
      break;
    case 39:
    case 68:
      Input.RIGHT = true;
      if (Input.UP == true) {
        Position.ROTATION = 315;
      } else if (Input.DOWN == true) {
        Position.ROTATION = 45;
      } else {
        Position.ROTATION = 0;
      }
      break;
    case 40:
    case 83:
      Input.DOWN = true;
      if (Input.RIGHT == true) {
        Position.ROTATION = 45;
      } else if (Input.LEFT == true) {
        Position.ROTATION = 135;
      } else {
        Position.ROTATION = 90;
      }
      break;
    case 32:
      Input.RESPAWN = true;
      checkRespawn();
      break;
    default:
      Input.MISC_KEYS[event.keyCode] = true;
      break;
  }
}

// Handle key up events for input.
Input.onKeyUp = function (event) {
  switch (event.keyCode) {
    case 37:
    case 65:
      Input.LEFT = false;
      if (Input.UP == true) {
        Position.ROTATION = 270;
      } else if (Input.DOWN == true) {
        Position.ROTATION = 90;
      } else {
        Position.ROTATION = 180;
      }
      break;
    case 38:
    case 87:
      Input.UP = false;
      if (Input.RIGHT == true) {
        Position.ROTATION = 0;
      } else if (Input.LEFT == true) {
        Position.ROTATION = 180;
      } else {
        Position.ROTATION = 270;
      }
      break;
    case 39:
    case 68:
      Input.RIGHT = false;
      if (Input.UP == true) {
        Position.ROTATION = 270;
      } else if (Input.DOWN == true) {
        Position.ROTATION = 90;
      } else {
        Position.ROTATION = 0;
      }
      break;
    case 40:
    case 83:
      Input.DOWN = false;
      if (Input.RIGHT == true) {
        Position.ROTATION = 0;
      } else if (Input.LEFT == true) {
        Position.ROTATION = 180;
      } else {
        Position.ROTATION = 90;
      }
      break;
    default:
      Input.MISC_KEYS[event.keyCode] = false;
  }
}

// Check and handle respawn logic.
function checkRespawn() {
  var waitRespawn = setInterval(function () {
    if (Input.RESPAWN == true && document.getElementById("respawn").style.display != "none" && game.status < 3) {
      document.getElementById("respawn").style.display = "none";
      Input.RESPAWN = false;
      clearInterval(waitRespawn);
    }
  }, 100);
}

// Apply event handlers for input.
Input.applyEventHandlers = function () {
  if (isMobile == true) {
    document.addEventListener("mousedown", (event) => {
      var elementId = event.target.id;
      if (elementId == "canvas") {
        document.getElementById("joyDiv").style.top = (event.clientY - 100) + "px";
        document.getElementById("joyDiv").style.left = (event.clientX - 100) + "px";
      }
    });
    document.addEventListener("touchstart", (event) => {
      var elementId = event.target.id;
      if (elementId == "canvas") {
        document.getElementById("joyDiv").style.top = (event.clientY - 100) + "px";
        document.getElementById("joyDiv").style.left = (event.clientX - 100) + "px";
      }
    });
    document.addEventListener("touchmove", joystickMovement); // Add touch move event for joystick.
    document.addEventListener("mousemove", joystickMovement); // Add mouse move event for joystick.
  } else if (isMobile == false) {
    document.addEventListener("mousemove", mouseMovement); // Add mouse move event.
    document.addEventListener('keyup', Input.onKeyUp); // Add key up event.
    document.addEventListener('keydown', Input.onKeyDown); // Add key down event.
  }

  // Handle respawn button click.
  $(document).on("click", "#respawn", function () {
    Input.RESPAWN = true;
    checkRespawn();
  });
};
