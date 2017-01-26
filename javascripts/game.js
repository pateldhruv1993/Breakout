Crafty.init(800, 600, document.getElementById('game'));
Crafty.background('rgb(91,235,223)');


//Init Variables
var viewWidth = Crafty.viewport.width;
var viewHeight = Crafty.viewport.height;
//var brickColors = ['./icons/pink-brick.png', './icons/skyblue-brick.png', './icons/blue-brick.png'];
var brickColors = ['rgb(21,223,21)', 'rgb(223,190,21)', 'rgb(223,21,21)'];


// Loop to create bricks
var brickWidth = 30;
var brickHeight = 15;
var brickX = 60;
var brickY = 80;
for (var i = 0; i <= 12; i++) {
  for (var j = 0; j <= 21; j++) {
    var levelOfBrick = Crafty.math.randomInt(1, 3);
    var aBrick = Crafty.e("brick, 2D, Canvas, Color, Collision")
      .color(brickColors[(levelOfBrick - 1)])
      .attr({ x: brickX + (brickWidth * j), y: brickY + (brickHeight * i), w: brickWidth, h: brickHeight, level: levelOfBrick })
      .onHit("Ball", function () {
        --this.level;
        if (this.level <= 0) {
          this.destroy();
          checkIfToDropPowerup(this);
        }


        // Speed booster
        if (ball.dY < 0)
          ball.dY -= 0.05;
        else
          ball.dY += 0.05;

        if (ball.dX < 0)
          ball.dX -= 0.05;
        else
          ball.dX += 0.05;


        // Speed limiter
        if (ball.dY > 8)
          ball.dY = 8;

        if (ball.dX > 8)
          ball.dX = 8;
        else if (ball.dX < -8)
          ball.dX = -8;

        if (this.level > 0) {
          this.color(brickColors[(this.level - 1)]);
        }
      });
  }
}



//Paddle
var player = Crafty.e('PlayerPaddle, 2D, Canvas, Color, Fourway')
  .attr({ x: (viewWidth / 2 - 50), y: (viewHeight - 30), w: 100, h: 10, powerup: "" })
  .color('rgb(205, 155, 155)')
  .fourway(6)
  .bind('EnterFrame', function () {
    this.y = (viewHeight - 30);
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x > viewWidth - this.w) {
      this.x = viewWidth - this.w;
    }
  }).bind('KeyDown', function (e) {

    // Powerup usage
    if (e.key == Crafty.keys.SPACE) {

      // Code to activate Power up
      if (this.powerup != "") {
        //Use and remove powerup

      }
    }
  });;





//Ball
var ball = Crafty.e('Ball, 2D, DOM, Image, Collision')
  .image("./icons/ball.png")
  .attr({
    x: viewWidth / 2, y: viewHeight / 2, w: 10, h: 10,
    dX: 0,
    dY: 3
  })
  .bind('EnterFrame', function () {
    //hit floor or roof
    if (this.y <= 0) {
      this.dY *= -1;
    }
    if (this.x <= 0 || this.x >= viewWidth - this.w) {
      this.dX *= -1;
    }

    if (this.y >= viewHeight - this.h) {
      // Take away life
      Crafty("PlayerLives").each(function () {
        this.text(--this.lives + " Lives");
      });

      ball.x = viewWidth / 2;
      ball.y = viewHeight / 2;
      ball.dX = 0;
      ball.dY = 0;
      Crafty.e("Delay").delay(function () {
        ball.dX = 0;
        ball.dY = 3;
      }, 1000, 0);
    }
    this.x += this.dX;
    this.y += this.dY;
  })
  .onHit('PlayerPaddle', function () {
    this.dY *= -1;
    var ballsMiddle = this.x + (this.w / 2);
    var playersMiddle = player.x + (player.w / 2);
    var dis = ballsMiddle - playersMiddle;
    var reflection = (dis * 4) / (player.w / 2);
    this.dX += Math.floor(reflection);

  })
  .onHit("brick", function () {
    var theBrick = ball.hit("brick");
    if (theBrick != false) {
      findNewBallDirection(theBrick[0].obj);
    }
  });



//Lives Left
Crafty.e('PlayerLives, DOM, 2D, Text')
  .attr({ x: 20, y: 20, w: 100, h: 20, lives: 3 })
  .textColor('#000000', 0.8)
  .text('3 Lives');


// PowerUp board
Crafty.e('PowerUp, DOM, 2D, Text')
  .attr({ x: 20, y: 40, w: 100, h: 20 })
  .textColor('#000000', 0.8)
  .text('Power Up : None');






// Functions to check the direction of collision
function findNewBallDirection(brick) {

  ball_bottom = ball.y + ball.h;
  brick_bottom = brick.y + brick.h;
  ball_right = ball.x + ball.w;
  brick_right = brick.x + brick.w;

  b_collision = brick_bottom - ball.y;
  t_collision = ball_bottom - brick.y;
  l_collision = ball_right - brick.x;
  r_collision = brick_right - ball.x;

  if (t_collision < b_collision && t_collision < l_collision && t_collision < r_collision) {
    //Top collision
    ball.dY *= -1;
  }
  if (b_collision < t_collision && b_collision < l_collision && b_collision < r_collision) {
    //Bottom collision
    ball.dY *= -1;
  }
  if (l_collision < r_collision && l_collision < t_collision && l_collision < b_collision) {
    //Left collision
    ball.dX *= -1;
  }
  if (r_collision < l_collision && r_collision < t_collision && r_collision < b_collision) {
    //Right collision
    ball.dX *= -1;
  }
}



function checkIfToDropPowerup() {
}


function removePowerUpFrom(item, powerUpBoard) {
  item.powerup = "";
  Crafty(powerUpBoard).each(function () {
    this.text('Power Up: None');
  });
}