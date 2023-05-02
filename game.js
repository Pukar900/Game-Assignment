var upPressed = false;
var downPressed = false;
var leftPressed = false;
var rightPressed = false;
var lastPressed = false;
var start;
var bombsTimer;
var lifeCount = 3;
var player;
var bombs = [];
var speedMult = 1;
var gameTicks = 0;
var gamePaused = false;
var score = 0;
var sky = [];
var immortal = false;
var lives = [];
var fireMode = false;

function fireArrow() {
    var arrow = document.createElement('div');
    // element.style.border = 'solid black';
    arrow.className = 'arrow up';
    document.body.appendChild(arrow);
    arrow.style.top = player.offsetTop + 'px';
    arrow.style.left = player.offsetLeft + 'px';

    fireMode = true;
    setTimeout(() => {
        fireMode = false;
    }, 500);
    var aInterval = setInterval(() => {
        var top = arrow.offsetTop;
        arrow.style.top = top - 1 + 'px';
        for (var i = 0; i < bombs.length; i++) {
            if (objectCollision(bombs[i], arrow)) {
                reset(bombs[i]);
                score += 2;
                arrow.remove();
                clearInterval(aInterval);
            } if (arrow.top < 0) { arrow.remove() };
        }
    }, 1000 / 6000);
}

function explodeB(bomb) {
    var explode = document.createElement('div');
    // element.style.border = 'solid black';
    explode.className = 'explosion';
    document.body.appendChild(explode);
    explode.style.top = bomb.offsetTop + 'px';
    explode.style.left = bomb.offsetLeft + 'px';
    setTimeout(function () {
        explode.remove()
    }, 100);
    if (objectCollision(player, explode) && !immortal) {
        immortal = true;
        player.classList.add('hit');
        lifeCount--;
        lives[0].remove();
        if (lifeCount == 0) {
            gameOver();
        } setTimeout(function () {
            immortal = false;
            player.classList.remove('hit')
        }, 1000);

    } 
	else {
        score++;
    }
}

function objectCollision(obj1, obj2) {
    var top1 = obj1.offsetTop;
    var top2 = obj2.offsetTop;
    var left1 = obj1.offsetLeft;
    var left2 = obj2.offsetLeft;
    var height1 = obj1.offsetHeight;
    var height2 = obj2.offsetHeight;
    var width1 = obj1.offsetWidth;
    var width2 = obj2.offsetWidth;
    if (top1 - 10 < top2 + height2 && top1 + height1 > top2 - 1 && left1 < left2 + width2 && left1 + width1 - 10 > left2 - 1) {
        return 1;
    }
    return 0;
}

// this function takes element and timer as arguments to move down.
function reset(bomb) {
    var windowWidth = window.innerWidth;
    var heightRandom = Math.random() * (1000 - 1) + 1;
    bomb.style.top = -1 * heightRandom + 'px';
    bomb.style.left = Math.floor(Math.random() * windowWidth) + 'px';
}

function createBombs() {
    var element = document.createElement('div');
    // element.style.border = 'solid black';
    element.className = 'bomb';
    document.body.appendChild(element);
    reset(element);
    bombs.push(element);
}

function gameOver() {
    gamePaused = true;
    player.className = 'character dead';
    var element = document.createElement('div');
    element.className = 'start';
    var content = document.createTextNode(' you loser, Restart !!!');
    element.appendChild(content);
    element.addEventListener('click', () => location.reload());
    document.body.appendChild(element);
    return;

}

function dropBombs() {
    if (gamePaused) {
        return;
    }
    if (gameTicks > 1000 && speedMult < 5) {
        createBombs();
        speedMult += 1;
        console.log('gametick');
        gameTicks = 0;
    }
    gameTicks += 1;
    for (var i = 0; i < bombs.length; i++) {
        var topOfBomb = parseFloat(bombs[i].offsetTop);
        randomExplode = Math.ceil(Math.random() * (window.innerHeight - sky[0].offsetHeight)) + sky[0].offsetHeight;
        if (bombs[i].offsetTop == randomExplode || bombs[i].offsetTop > window.innerHeight - 10) {
            explodeB(bombs[i]);
            reset(bombs[i]);
            console.log(score);
        } else {
            if (objectCollision(player, bombs[i]) != 0 && !immortal) {
                explodeB(bombs[i]);
                reset(bombs[i]);
                console.log('hi');
            }
            else {
                var newPos = topOfBomb + 1 * speedMult;
                bombs[i].style.top = newPos + 'px';
            }
        }
    }

}

// prep for starting the game
function startGame() {
    requestAnimFrame(startGame);
    start[0].style.display = 'none';
    // generateBombs();
    move();
    dropBombs();
}

function keyup(event) {
    if (gamePaused) {
        return;
    }
    var player = document.getElementById('player');

    if (event.keyCode == 37) {
        leftPressed = false;
        lastPressed = 'left';
    }
    if (event.keyCode == 39) {
        rightPressed = false;
        lastPressed = 'right';
    }
    if (event.keyCode == 38) {
        upPressed = false;
        lastPressed = 'up';
    }
    if (event.keyCode == 40) {
        downPressed = false;
        lastPressed = 'down';
    }

    player.className = 'character stand ' + lastPressed;
}


function move() {
    if (gamePaused || fireMode) {
        return;
    }
    var positionLeft = player.offsetLeft;
    var positionTop = player.offsetTop;

    if (downPressed) {
        if (player.offsetTop < window.innerHeight - 30) {
            var newTop = positionTop + 2;
            player.style.top = newTop + 'px';
        }


        if (leftPressed == false) {
            if (rightPressed == false && !immortal) {
                player.className = 'character walk down';
            }
        }
    }
    if (upPressed) {
        var newTop = positionTop - 2;

        var element = document.elementFromPoint(0, newTop);
        if (element.classList.contains('sky') == false) {
            player.style.top = newTop + 'px';
        }

        if (leftPressed == false) {
            if (rightPressed == false && !immortal) {
                player.className = 'character walk up';
            }
        }
    }
    if (leftPressed) {
        var newLeft = positionLeft - 2;

        var element = document.elementFromPoint(newLeft, player.offsetTop);
        if (element.classList.contains('sky') == false) {
            player.style.left = newLeft + 'px';
        }

        if (!immortal) { player.className = 'character walk left'; }
    }
    if (rightPressed) {
        var newLeft = positionLeft + 2;

        var element = document.elementFromPoint(0, player.offsetTop);
        if (element.classList.contains('sky') == false) {
            player.style.left = newLeft + 'px';
        }
        if (!immortal) {
            player.className = 'character walk right';
        }

    }

}


function keydown(event) {
    if (gamePaused || fireMode) {
        return;
    }
    if (event.keyCode == 32) {
        fireArrow();
    }
    if (event.keyCode == 37) {
        leftPressed = true;
    }
    if (event.keyCode == 39) {
        rightPressed = true;
    }
    if (event.keyCode == 38) {
        upPressed = true;
    }
    if (event.keyCode == 40) {
        downPressed = true;
    }
}


function myLoadFunction() {
    player = document.getElementById('player');
    // timeout = setInterval(move, 10);
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
    start = document.getElementsByClassName('start');
    start[0].addEventListener('click', startGame);
    sky = document.getElementsByClassName('sky');
    for (var i = 0; i < 20; i++) {
        createBombs();
    }
    lives = document.getElementsByClassName('health')[0].getElementsByTagName('li');

}
// not mine : ) ref: codepen from panas cunt 
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();


document.addEventListener('DOMContentLoaded', myLoadFunction);