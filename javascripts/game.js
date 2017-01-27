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

        if (!ball.hot_knife) {
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
        }
      })
      .onHit("Bullet", function () {
        --this.level;
        if (this.level <= 0) {
          this.destroy();
          checkIfToDropPowerup(this);
        }
        if (this.level > 0) {
          this.color(brickColors[(this.level - 1)]);
        }

        var theBullet = this.hit("Bullet");
        if (theBullet != false) {
          theBullet[0].obj.destroy();
        }
      })
      .onHit("Nuke", function () {
        this.level = 0;
        if (this.level <= 0) {
          this.destroy();
          checkIfToDropPowerup(this);
        }
      });
  }
}



//Paddle
var player = Crafty.e('PlayerPaddle, 2D, Canvas, Color, Fourway')
  .attr({ x: (viewWidth / 2 - 50), y: (viewHeight - 30), w: 100, h: 10, powerup: "" })
  .color('rgb(205, 155, 155)')
  .fourway(8)
  .bind('EnterFrame', function () {
    this.y = (viewHeight - 30);
    if (this.x < 0) {
      this.x = 0;
    }
    if (this.x > viewWidth - this.w) {
      this.x = viewWidth - this.w;
    }
  }).bind('EnterFrame', function (e) {


    // Code to activate Power up
    if (this.powerup != "") {
      //Use and remove powerup
      if (this.powerup == "expand") {
        this.w += 50;
        this.powerup = "";
        Crafty.e("Delay").delay(function () {
          player.w -= 50;
          removePowerUpFrom();
        }, 10000, 0);
      }
      else if (this.powerup == "rambo") {
        this.powerup = "";
        var bulletColor = 'rgb(247,180,38)';
        Crafty.e("Delay").delay(function () {
          Crafty.e('Bullet, 2D, Canvas, Color, Collision')
            .attr({ x: player.x, y: player.y - 20, w: 5, h: 10, dX: 0, dY: -4 })
            .color(bulletColor)
            .bind('EnterFrame', function () {
              if (this.y < 0 - this.h) {
                this.destroy()
              }
              this.y += this.dY;
            });

          Crafty.e('Bullet, 2D, Canvas, Color, Collision')
            .attr({ x: player.x + player.w - 5, y: player.y - 20, w: 5, h: 10, dX: 0, dY: -4 })
            .color(bulletColor)
            .bind('EnterFrame', function () {
              if (this.y < 0 - this.h) {
                this.destroy()
              }
              this.y += this.dY;
            });
        }, 500, 20, function () {
          removePowerUpFrom();
        });
      } else if (this.powerup == "hot_knife") {
        this.powerup = "";
        ball.hot_knife = true;
        ball.image('./icons/ball_red.png');
        Crafty.e("Delay").delay(function () {
          ball.hot_knife = false;
          ball.image('./icons/ball.png');
          removePowerUpFrom();
        }, 10000, 0);
      } else if (this.powerup == "fat_boy") {
        this.powerup = "";
        var nuke = Crafty.e('Bullet, 2D, DOM, Image, Collision')
          .image("./icons/nuke.png")
          .attr({
            x: player.x + (player.w / 2) - 10, y: player.y - 20, w: 20, h: 49,
            dX: 0,
            dY: -3
          })
          .bind('EnterFrame', function () {
            this.y += this.dY;
            if (this.y < -20) {
              this.destroy();
            }
          })
          .onHit("brick", function () {
            var blast = Crafty.e('Nuke, 2D, DOM, Color, Collision')
              .color("rgb(247,180,38)")
              .attr({
                x: nuke.x + nuke.w - 150 / 2, y: nuke.y + nuke.h - 150 / 2, w: 150, h: 150
              })
              .bind('EnterFrame', function () {
                if (blast.color() == "rgb(247,180,38)" || blast.color() == "rgba(247,180,38, 1.0)") {
                  blast.color("rgba(247,180,38, 0.2)");
                } else {
                  blast.color("rgba(247,180,38, 1.0)");
                }
              });
            Crafty.e("Delay").delay(function () {
              blast.destroy();
              removePowerUpFrom();
            }, 600, 0, function () {
            });
            nuke.destroy();
          });

      }

    }
  });;





//Ball
var ball = Crafty.e('Ball, 2D, DOM, Image, Collision')
  .image("./icons/ball.png")
  .attr({
    x: viewWidth / 2, y: viewHeight / 2, w: 10, h: 10,
    dX: 0,
    dY: 3,
    hot_knife: false
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
        if (this.lives > 0) {
          this.text(--this.lives + " Lives");
        } else {
          Crafty("GameStatus").each(function () {
            this.text("Game: Lost");
          });
        }
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

    if (Crafty("brick").length == 0) {
      Crafty("GameStatus").each(function () {
        this.text("Game: Won!");
      });
    }

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
    if (theBrick != false && !this.hot_knife) {
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

// Game status
Crafty.e('GameStatus, DOM, 2D, Text')
  .attr({ x: 20, y: 60, w: 100, h: 20 })
  .textColor('#000000', 0.8)
  .text('Game : In Progress');




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



function checkIfToDropPowerup(brick) {
  var chanceOfDrop = Crafty.math.randomInt(1, 100);
  if ((chanceOfDrop < 60 && !ball.hot_knife) || chanceOfDrop < 5) {
    var dropIndex = Crafty.math.randomInt(1, 4);
    if (dropIndex == 1) {
      createPowerup("expand", brick);
    } else if (dropIndex == 2) {
      createPowerup("rambo", brick);
    } else if (dropIndex == 3) {
      createPowerup("hot_knife", brick);
    } else if (dropIndex == 4) {
      createPowerup("fat_boy", brick);
    }
  }
}


function createPowerup(dropName, brick) {
  Crafty.e('2D, DOM, Image, Collision')
    .image("./icons/" + dropName + ".png")
    .attr({
      x: brick.x + (brick.w / 2), y: brick.y, w: 20, h: 20, dX: 0, dY: 4
    })
    .onHit('PlayerPaddle', function () {
      player.powerup = dropName;
      Crafty('PowerUp').each(function () {
        this.text('Power Up: ' + dropName);
      });
      this.destroy();
    })
    .bind('EnterFrame', function () {
      if (this.y > viewHeight + this.h) {
        this.destroy();
      }
      this.y += this.dY;
    });
}


function removePowerUpFrom() {
  Crafty('PowerUp').each(function () {
    this.text('Power Up: none');
  });
}