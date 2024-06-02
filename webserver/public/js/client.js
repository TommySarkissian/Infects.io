// Variables
var isMobile;
var server;
var host;
var hostList;
var game;
var socket;
var link;
var sharedLink = false;
var region;
var serverRetrieved = false;
var inActiveGame = false;
sessionStorage.setItem('inGame', inActiveGame); // Initialize session storage

var skin = ["#d2b48c", "#d3d3d3", "#371d33"]; // Default skin colors
var hint = "3 players are needed to start a game"; // Initial hint

// Detect if the user is on a mobile device
if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4)) || window.matchMedia("(pointer: coarse)").matches == true) {
    isMobile = true;
    document.getElementById("respawn").innerHTML = "TAKE CURE"; // Change button text for mobile
} else {
    isMobile = false;
}

// Get URL parameter by name
function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1]; // Return parameter value
        }
    }
}

// Copy text to clipboard
function copyToClipboard(value) {
    var tempInput = document.createElement("input");
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy"); // Execute copy command
    document.body.removeChild(tempInput);
}

// Copy host information to clipboard
function copyHostToClipboard(host) {
    host = host.replace("https://", "");
    tempHost = host.substr(0, host.indexOf(':'));
    fetch("./public/servers.json").then(res => res.json())
        .then((json) => {
            server = json;
            if (tempHost == server["OC"]["host"]) {
                host = "o" + host.replace(host.substr(0, host.indexOf(':')), "").replace(":", "");
            } else if (tempHost == server["AS"]["host"]) {
                host = "a" + host.replace(host.substr(0, host.indexOf(':')), "").replace(":", "");
            } else if (tempHost == server["NA"]["host"]) {
                host = "n" + host.replace(host.substr(0, host.indexOf(':')), "").replace(":", "");
            } else if (tempHost == server["EU"]["host"]) {
                host = "e" + host.replace(host.substr(0, host.indexOf(':')), "").replace(":", "");
            }
            copyToClipboard(location.origin + "/?host=" + host); // Copy modified host to clipboard
            link = location.origin + "/?host=" + host; // Set link variable
        });
}

// Check if host parameter is present
var hostParameter = GetURLParameter('host');
if (hostParameter != undefined) {
    document.getElementById("sharegame").style.display = "block"; // Display share game button
    document.getElementById("resetgame").style.display = "block"; // Display reset game button
    document.getElementById("selectedHost").innerHTML = " (" + hostParameter + ")"; // Set selected host text
    document.getElementById("sharegame").setAttribute("onClick", "copyToClipboard(location.origin + '/?host=' + '" + hostParameter + "'); sharedLink = true; document.getElementById('sharegame').innerHTML = '<strong>COPIED LINK - GO AHEAD, SEND IT TO YOUR FRIENDS!</strong>'; setTimeout(function () { document.getElementById('sharegame').innerHTML = '<i class=\"fas fa-share-square fa-2x\"></i>'}, 4000);");
    fetch("./public/servers.json").then(res => res.json())
        .then((json) => {
            server = json;
            if (hostParameter.includes("o")) {
                selectedServer = server["OC"]["host"];
                hostParameter = hostParameter.replace("o", selectedServer + ":");
            } else if (hostParameter.includes("a")) {
                selectedServer = server["AS"]["host"];
                hostParameter = hostParameter.replace("a", selectedServer + ":");
            } else if (hostParameter.includes("n")) {
                selectedServer = server["NA"]["host"];
                hostParameter = hostParameter.replace("n", selectedServer + ":");
            } else if (hostParameter.includes("e")) {
                selectedServer = server["EU"]["host"];
                hostParameter = hostParameter.replace("e", selectedServer + ":");
            } else {
                window.location.href = location.origin; // Redirect if host is invalid
            }
            host = "https://" + hostParameter; // Set host URL
            serverRetrieved = true; // Mark server as retrieved
            document.getElementById("joinGame").style.display = "block"; // Display join game button
            reportWindowSize(); // Update window size
        });
} else {
    document.getElementById("sharegame").style.display = "none"; // Hide share game button
    document.getElementById("resetgame").style.display = "none"; // Hide reset game button
    region = "OC"; // Default region
    fetch("./public/servers.json").then(res => res.json())
        .then((json) => {
            server = json;
            fetch("https://" + server[region]["host"] + ":6900").then(res => res.json())
                .then((portlist) => {
                    port = portlist;
                    hostList = "https://" + server[region]["host"] + ":6900"; // Set host list URL
                    serverRetrieved = true; // Mark server as retrieved
                    document.getElementById("joinGame").style.display = "block"; // Display join game button
                    reportWindowSize(); // Update window size
                });
        });
}

// Update game UI based on status
function inGame(status) {
    if (status == true) {
        document.getElementById("container").style.display = "none"; // Hide container
        document.getElementById("background-canvas").style.display = "none"; // Hide background canvas
        document.getElementById("matchmaking").style.display = "none"; // Hide matchmaking
        document.getElementById("canvas").style.display = "block"; // Show game canvas
        document.getElementById("leavegame").style.display = "block"; // Show leave game button
        document.getElementById("latency").style.display = "block"; // Show latency display
        if (isMobile == true) {
            document.getElementById("joyDiv").style.display = "block"; // Show joystick for mobile
        }
        document.getElementById("sharegame").style.display = "block"; // Show share game button
        document.getElementById("resetgame").style.display = "none"; // Hide reset game button
        document.getElementById("respawn").style.display = "none"; // Hide respawn button
    } else {
        document.getElementById("container").style.display = "block"; // Show container
        document.getElementById("background-canvas").style.display = "block"; // Show background canvas
        document.getElementById("canvas").style.display = "none"; // Hide game canvas
        document.getElementById("leavegame").style.display = "none"; // Hide leave game button
        document.getElementById("latency").style.display = "none"; // Hide latency display
        document.getElementById("joyDiv").style.display = "none"; // Hide joystick
        document.getElementById("respawn").style.display = "none"; // Hide respawn button
        if (hostParameter == undefined) {
            document.getElementById("sharegame").style.display = "none"; // Hide share game button
        } else {
            document.getElementById("resetgame").style.display = "block"; // Show reset game button
        }
        if (sharedLink == true && hostParameter == undefined) {
            window.location.href = link; // Redirect to shared link
        }
    }
    reportWindowSize(); // Update window size
}

// Cancel matchmaking
function cancelMatchmaking() {
    document.getElementById("matchmaking").style.display = "none"; // Hide matchmaking
}

// Event handler for join game button
$(document).on("click", "#joinGame", function () {
    retrieveGame(); // Retrieve game on click
});

// Retrieve server information
function retrieveServer() {
    if (inActiveGame == false) {
        setTimeout(function () {
            retrieveGame(); // Retrieve game after delay
        }, 2000);
    }
}

// Retrieve game information
function retrieveGame() {
    if (serverRetrieved == true) {
        document.getElementById("matchmaking").style.display = "block"; // Show matchmaking
        if (hostParameter != undefined) {
            joinGame(); // Join game if host parameter is present
        } else {
            var i = 0;
            fetch(hostList).then(function (response) {
                var res = response.json();
                return res;
            }).then(function (status) {
                while (i < status.length && inActiveGame == false && document.getElementById("matchmaking").style.display != "none") {
                    if (status[i].port != undefined && status[i].status <= 1 && status[i].pc < 25) {
                        host = "https://" + server[region]["host"] + ":" + status[i].port; // Set host URL
                        if (document.getElementById("matchmaking").style.display == "block") {
                            joinGame(); // Join game
                            inActiveGame = true; // Mark as in active game
                        }
                    } else {
                        i = i + 1; // Increment server index
                    }
                    retrieveServer(); // Retrieve server again
                }
            });
        }
    }
}

// Join the game
function joinGame() {
    // Anti-cheat
    try {
        if (socket.connected == true) {
            socket.disconnect(); // Disconnect existing socket
        }
    } catch (e) { }
    if (inActiveGame == false) {
        inActiveGame = true; // Mark as in active game
        fetch(host).then(function (response) {
            var res = response.json();
            return res;
        }).then(function (status) {
            if (status <= 1) {

                var canvas = document.getElementById('canvas');
                var canvasContext = canvas.getContext('2d');

                canvasContext.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

                var username = document.getElementById("username").value;

                socket = io(host, { rememberTransport: false, transports: ['websocket', 'Flash Socket', 'AJAX long-polling'] }); // Initialize socket
                game = Game.create(socket, canvas); // Create game instance

                Input.applyEventHandlers(); // Apply input handlers

                game.init(username, skin); // Initialize game
                game.animate(); // Start game animation

                localStorage.setItem('username', username); // Save username
                localStorage.setItem('skin', JSON.stringify(skin)); // Save skin
                sessionStorage.setItem('inGame', inActiveGame); // Save game status

                updateDisplaySize(); // Update display size

                setTimeout(function () {
                    if (document.getElementById("matchmaking").style.display == "block") {
                        inGame(true); // Update UI for active game
                        document.getElementById("sharegame").setAttribute("onClick", "copyHostToClipboard('" + host + "'); sharedLink = true; document.getElementById('sharegame').innerHTML = '<strong>COPIED LINK - GO AHEAD, SEND IT TO YOUR FRIENDS!</strong>'; setTimeout(function () { document.getElementById('sharegame').innerHTML = '<i class=\"fas fa-share-square fa-2x\"></i>'}, 4000);");
                        document.getElementById("leavegame").setAttribute("onClick", "game.stopAnimation(); socket.disconnect(); inActiveGame = false; sessionStorage.setItem('inGame', inActiveGame); inGame(inActiveGame);");
                    } else {
                        socket.disconnect(); // Disconnect socket
                        inActiveGame = false; // Mark as not in active game
                        sessionStorage.setItem('inGame', inActiveGame); // Save game status
                    }
                }, 2000);

                checkStatus(); // Check game status
                function checkStatus() {
                    setTimeout(function () {
                        if (game.status <= 1) {
                            checkStatus(); // Recursively check status
                        }
                        if (game.status == 2) {
                            document.getElementById("leavegame").style.display = "none"; // Hide leave game button
                            document.getElementById("sharegame").style.display = "none"; // Hide share game button
                            checkStatus(); // Recursively check status
                        }
                        if (game.status >= 3) {
                            document.getElementById("leavegame").style.display = "block"; // Show leave game button
                            document.getElementById("respawn").style.display = "none"; // Hide respawn button
                        }
                    }, 2000);
                }
            } else if (status > 1) {
                if (hostParameter != undefined) {
                    inActiveGame = false; // Mark as not in active game
                    sessionStorage.setItem('inGame', inActiveGame); // Save game status
                    joinGame(); // Join game again
                }
            }
        }).catch(function () {
            if (hostParameter != undefined) {
                alert("Could not find the game lobby at: " + GetURLParameter('host'));
                window.location.href = location.origin; // Redirect to home
            }
        });
    }
}

// Hint display function
var hintID = 0;
function hintDisplay() {
    setTimeout(function () {
        hintID++;
        if (hintID == 1) {
            hint = "3 players are needed to start a game"; // Hint message
        } else if (hintID == 2) {
            hint = "Survivors must run and hide from the infected"; // Hint message
        } else if (hintID == 3) {
            hint = "Acquire pills to become invisible, invincible or fast"; // Hint message
        } else if (hintID == 4) {
            hint = "The infected find and infect survivors"; // Hint message
        } else if (hintID == 5) {
            hint = "The infected can be cured by infecting two survivors"; // Hint message
            hintID = 0; // Reset hint ID
        }
        hintDisplay(); // Recursively display hints
    }, 4000); // Hint display interval
}

// Update display size
function updateDisplaySize() {
    var canvas = document.getElementById('canvas');
    var backgroundcanvas = document.getElementById('background-canvas');

    var innerWidth = window.innerWidth;

    if (window.innerWidth > 1920 && window.innerHeight > 1080) {
        while (innerWidth > 1920) {
            innerWidth = innerWidth - 120;
        }
        canvas.width = innerWidth;
        canvas.height = innerWidth * 0.5625;

        canvas.height = canvas.height * 1.2;
        canvas.width = canvas.width * 1.2;
    } else {
        if (window.innerHeight <= window.outerHeight) {
            canvas.height = window.innerHeight;
        } else {
            canvas.height = window.outerHeight;
        }
        canvas.width = window.innerWidth;

        canvas.height = canvas.height * 1.2;
        canvas.width = canvas.width * 1.2;
    }

    if (window.innerWidth <= 900 && window.innerHeight <= 500) {
        if (window.innerHeight <= window.outerHeight) {
            canvas.height = window.innerHeight;
        } else {
            canvas.height = window.outerHeight;
        }
        canvas.width = window.innerWidth;

        canvas.height = canvas.height * 1.75;
        canvas.width = canvas.width * 1.75;
    }

    backgroundcanvas.width = window.innerWidth;
    backgroundcanvas.height = window.innerHeight;
}

// Document ready function
$(function () {
    document.getElementById("canvas").style.display = "none"; // Hide game canvas
    document.getElementById("leavegame").style.display = "none"; // Hide leave game button
    document.getElementById("matchmaking").style.display = "none"; // Hide matchmaking
    document.addEventListener('contextmenu', event => event.preventDefault()); // Prevent context menu

    window.addEventListener('resize', updateDisplaySize); // Update size on resize
    window.addEventListener('fullscreenchange', updateDisplaySize); // Update size on fullscreen change
    window.addEventListener('orientationchange', updateDisplaySize); // Update size on orientation change
    window.addEventListener('load', updateDisplaySize); // Update size on load

    updateDisplaySize(); // Initial update size
    hintDisplay(); // Start hint display

    if (localStorage.getItem('username') != null) {
        document.getElementById("username").value = localStorage.getItem('username'); // Set username from localStorage
    }

    if (localStorage.getItem('skin') != null) {
        var skinArray = JSON.parse(localStorage.getItem("skin"));
        skin[0] = skinArray[0]; // Set skin color 0
        skin[1] = skinArray[1]; // Set skin color 1
        skin[2] = skinArray[2]; // Set skin color 2
    }

    requestAnimationFrame(playBackground); // Start background animation

    var survivorskin = document.querySelector('#survivorskin');
    var infectedskin = document.querySelector('#infectedskin');
    var clothingskin = document.querySelector('#clothingskin');

    survivorskin.style.background = skin[0]; // Set survivor skin background
    infectedskin.style.background = skin[1]; // Set infected skin background
    clothingskin.style.background = skin[2]; // Set clothing skin background

    var survivorpicker = new Picker({
        parent: survivorskin,
        popup: 'right',
        color: survivorskin.style.background,
        alpha: false,
    });
    var infectedpicker = new Picker({
        parent: infectedskin,
        popup: 'right',
        color: infectedskin.style.background,
        alpha: false,
    });
    var clothingpicker = new Picker({
        parent: clothingskin,
        popup: 'right',
        color: clothingskin.style.background,
        alpha: false,
    });

    survivorpicker.onChange = function (color) {
        survivorskin.style.background = color.hexString; // Change survivor skin color
        skin[0] = color.hexString; // Update skin array
    };
    infectedpicker.onChange = function (color) {
        infectedskin.style.background = color.hexString; // Change infected skin color
        skin[1] = color.hexString; // Update skin array
    };
    clothingpicker.onChange = function (color) {
        clothingskin.style.background = color.hexString; // Change clothing skin color
        skin[2] = color.hexString; // Update skin array
    };

});

// Reset skin colors to default
function resetSkin() {
    skin = ["#d2b48c", "#d3d3d3", "#371d33"];
    localStorage.setItem('skin', JSON.stringify(skin)); // Save default skin to localStorage
    var survivorskin = document.querySelector('#survivorskin');
    var infectedskin = document.querySelector('#infectedskin');
    var clothingskin = document.querySelector('#clothingskin');
    survivorskin.style.background = skin[0]; // Reset survivor skin background
    infectedskin.style.background = skin[1]; // Reset infected skin background
    clothingskin.style.background = skin[2]; // Reset clothing skin background
}

// Variables for pawn movement
var border = 80;
var positionX = border;
var positionY = border;
var size = 40;
var goingtop = true;
var goingright = false;
var goingbottom = false;
var goingleft = false;
var rotation = 0;
var infected = false;

// Handle pawn movement
function pawnMovement() {
    var canvas = document.getElementById("background-canvas");
    if (positionX >= canvas.width / 2) {
        infected = true; // Mark pawn as infected
    } else {
        infected = false; // Mark pawn as not infected
    }
    if (positionX < canvas.width && goingtop == true) {
        positionX += 5;
        if (positionX > canvas.width - border) {
            goingtop = false;
            goingright = true;
            rotation = 90; // Rotate pawn
        }
    } else if (goingright == true) {
        positionY += 5;
        if (positionY > canvas.height - border) {
            goingright = false;
            goingbottom = true;
            rotation = 180; // Rotate pawn
        }
    } else if (goingbottom == true) {
        positionX -= 5;
        if (positionX < border) {
            goingbottom = false;
            goingleft = true;
            rotation = 270; // Rotate pawn
        }
    } else if (goingleft == true) {
        positionY -= 5;
        if (positionY < border) {
            goingleft = false;
            goingtop = true;
            rotation = 0; // Rotate pawn
        }
    }
}

// Play background animation
function playBackground() {
    var canvas = document.getElementById("background-canvas");
    var ctx = canvas.getContext("2d");
    border = 80;
    pawnMovement(); // Update pawn position
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    for (var x = 0; x <= canvas.width; x += 200) {
        for (var y = 0; y <= canvas.height; y += 200) {
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            if (x > canvas.width / 2 && canvas.height / 2 > 0) {
                ctx.fillStyle = "darkslategray"; // Set fill color
            } else {
                ctx.fillStyle = "darkolivegreen"; // Set fill color
            }
            ctx.arc(x + 50, y + 50, 200, 0, 2 * Math.PI); // Draw circle
            ctx.fill();
        }
    }
    ctx.translate(positionX, positionY); // Translate context
    ctx.rotate(rotation * Math.PI / 180); // Rotate context
    ctx.globalAlpha = 1;
    if (infected == false) {
        ctx.rotate(90 * Math.PI / 180);
        ctx.beginPath();
        ctx.fillStyle = skin[2].substring(0, 7);
        ctx.arc(0, size * 0.6, size * 0.85, 0, Math.PI);
        ctx.fill();
        ctx.rotate(- 90 * Math.PI / 180);
        ctx.beginPath();
        ctx.fillStyle = skin[0].substring(0, 7);
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.rotate(20 * Math.PI / 180);
        ctx.beginPath();
        ctx.fillStyle = skin[2].substring(0, 7);
        ctx.rect(- size * 0.9, size * 0.6, size * 1.6, size * 0.25);
        ctx.arc(size * 0.7, size * 0.72, size * 0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.rotate(- 20 * Math.PI / 180);
        ctx.rotate(- 20 * Math.PI / 180);
        ctx.beginPath();
        ctx.fillStyle = skin[2].substring(0, 7);
        ctx.rect(- size * 0.9, - size * 0.85, size * 1.6, size * 0.25);
        ctx.arc(size * 0.7, - size * 0.72, size * 0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.rotate(20 * Math.PI / 180);
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(size * 0.35, size * 0.4, size * 0.3, 0, Math.PI * 2);
        ctx.arc(size * 0.35, - size * 0.4, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(size * 0.45, size * 0.4, size * 0.2, 0, Math.PI * 2);
        ctx.arc(size * 0.45, - size * 0.4, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(size * 0.75, size * 0.1, size * 0.05, 0, Math.PI * 2);
        ctx.rect(size * 0.7, - size * 0.1, size * 0.1, size * 0.2);
        ctx.arc(size * 0.75, - size * 0.1, size * 0.05, 0, Math.PI * 2);
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.fillStyle = skin[1].substring(0, 7);
        ctx.arc(size * 1.55, size * 1.03, size * 0.35, 0, Math.PI * 2);
        ctx.arc(size * 1.55, - size * 1.03, size * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = skin[1].substring(0, 7);
        ctx.arc(size * 1.55, size * 0.75, size * 0.15, 0, Math.PI * 2);
        ctx.arc(size * 1.55, - size * 0.75, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = skin[2].substring(0, 7);
        ctx.arc(0, size * 0.9, size * 0.5, 0, Math.PI * 2);
        ctx.rect(0, size * 0.65, size * 1.35, size * 0.75);
        ctx.arc(0, -size * 0.9, size * 0.5, 0, Math.PI * 2);
        ctx.rect(0, -size * 1.4, size * 1.35, size * 0.75);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = skin[1].substring(0, 7);
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.arc(size * 0.35, size * 0.4, size * 0.3, 0, Math.PI * 2);
        ctx.arc(size * 0.35, - size * 0.4, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(size * 0.45, size * 0.4, size * 0.2, 0, Math.PI * 2);
        ctx.arc(size * 0.45, - size * 0.4, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.arc(size * 0.75, size * 0.1, size * 0.12, 0, Math.PI * 2);
        ctx.rect(size * 0.63, - size * 0.1, size * 0.24, size * 0.22);
        ctx.arc(size * 0.75, - size * 0.1, size * 0.12, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
    requestAnimationFrame(playBackground); // Loop background animation
}
