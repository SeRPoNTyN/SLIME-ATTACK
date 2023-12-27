var win = window,
  doc = document,
  docElem = doc.documentElement;


var gameDiff = {
  monsterLVL: 1,
  spawnRate: 600,
}

var Game = {
  width: win.innerWidth || docElem.clientWidth || body.clientWidth,
  height: win.innerHeight || docElem.clientHeight || body.clientHeight,
  background: "Linen",
  start: true
};

var canvas = document.getElementById("canvas");
var canvasWidth = Game.width;
var canvasHeight = Game.height;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
var canvasContext = canvas.getContext("2d");

var player = {
  x: Game.width / 2 - 45,
  y: Game.height / 2 - 75,
  isMoving: false,
  movingTimer: 0,
  movingStep: 0,
  width: 45,
  height: 74,
  got_hit: false,
  hit_kd: 0,
  direction: "none",
  hp: 20,
  exp: 0,
  lvl: 1,
  hit_from_right: "none",
  attack: {
    mouse_pos: [0, 0],
    attack_kd: 0,
    attackFrameTimer: 0,
    attackFrame: 0,
    isAttacking: false,
    angle: 0,
    power: 1,
  },
};

var enemyID = 0;
var delta = {
  x: 0,
  y: 0,
};

var buttonPressed = Array();

document.addEventListener("mousemove", function (e) {
  player.attack.mouse_pos = [e.pageX, e.pageY];
});

document.addEventListener("mousedown", function (e) {
  player_attack_valid();
  var p1 = {
    x: -(player.x - player.attack.mouse_pos[0] + player.width / 2),
    y: -(player.y + player.height / 2 - player.attack.mouse_pos[1]),
  };

  var b = p1.x ** 2 + p1.y ** 2;
  var a = (100 - p1.x) ** 2 + p1.y ** 2;
  player.attack.angle =
    (Math.acos((b - a + 10000) / (2 * Math.sqrt(b) * 100)) * 180) / Math.PI;
  if (p1.y > 0) {
    player.attack.angle = -player.attack.angle;
  } else if (p1.y < 0) {
    player.attack.angle = player.attack.angle;
  } else {
    player.attack.angle = 180;
  }
});

function player_attack_valid() {
  if (player.attack.attack_kd == 0) {
    player.attack.isAttacking = true;
  }
}

var deadSlimes = Array()


document.addEventListener("keydown", function (e) {
  g = String(e.key).toUpperCase();
  if (["A", "D", "S", "W"].includes(g) && !buttonPressed.includes(g)) {
    buttonPressed.push(g);
  }
  if (buttonPressed.length > 0) {
    player.isMoving = true;
  }
});

document.addEventListener("keyup", function (e) {
  g = String(e.key).toUpperCase();
  if (["A", "D", "S", "W"].includes(g)) {
    buttonPressed.splice(buttonPressed.indexOf(g), 1);

    if (g == "D") {
      delta.x = 0;
    } else if (g == "A") {
      delta.x = 0;
    } else if (g == "W") {
      delta.y = 0;
    } else if (g == "S") {
      delta.y = 0;
    }
  }
  if (buttonPressed.length == 0) {
    player.direction = "none";
    player.isMoving = false;
  }
});

var ts = null;

function checkCollisionCircleWithRect(rect, circle) {
  const x = Math.max(rect.minX, Math.min(circle.x, rect.maxX));
  const y = Math.max(rect.minY, Math.min(circle.y, rect.maxY));

  // Измеряем расстояние от найденной точки до центра круга
  const distance = Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2);

  const isCollision = distance < circle.radius;

  return isCollision;
}

function getAttackColPos(x, y) {
  return [
    x * Math.cos((225 / 180) * Math.PI) - y * Math.sin((225 / 180) * Math.PI),
    x * Math.sin((225 / 180) * Math.PI) + y * Math.cos((225 / 180) * Math.PI),
  ];
}

function TEMPdrawAttackCollision() {
  atColCordx = player.width / 2 + player.x;
  atColCordy = player.height / 2 + player.y;

  p1 = {
    x: -(atColCordx - player.attack.mouse_pos[0] + 5),
    y: -(atColCordy + 5 - player.attack.mouse_pos[1]),
  };

  var k = p1.y / p1.x;
  var answerX = Math.sqrt(5625 / (k ** 2 + 1));
  var answerX2 = Math.sqrt(900 / (k ** 2 + 1));

  var answer = getAttackColPos(answerX, answerX * k);

  if (player.attack.mouse_pos[0] <= atColCordx + 5) {
    var hitArc = {
      r: 130,
      x: player.x + player.width / 2 - answerX2,
      y: player.y + player.height / 2 - answerX2 * k,
    };

    var noHitArc = {
      x: -answer[0] + atColCordx,
      y: -answer[1] + atColCordy,
      r: 50,
    };

    // canvasContext.beginPath();
    // canvasContext.arc(
    //   -answer[0] + atColCordx,
    //   -answer[1] + atColCordy,
    //   50,
    //   0,
    //   2 * Math.PI
    // );
    // canvasContext.stroke();

    // canvasContext.beginPath();
    // canvasContext.arc(
    //   player.x + player.width / 2 - answerX2,
    //   player.y + player.height / 2 - answerX2 * k,
    //   140,
    //   0,
    //   2 * Math.PI
    // );
    // canvasContext.stroke();

    for (var i = 0; i < enemyList.length; i++) {
      var mob = enemyList[i];
      if (
        checkCollisionCircleWithRect(
          {
            minX: mob.x,
            maxX: mob.x + mob.width,
            minY: mob.y,
            maxY: mob.y + mob.height,
          },
          { x: hitArc.x, y: hitArc.y, radius: hitArc.r }
        ) &&
        mob.gotHit == false &&
        !checkCollisionCircleWithRect(
          {
            minX: mob.x,
            maxX: mob.x + mob.width,
            minY: mob.y,
            maxY: mob.y + mob.height,
          },
          { x: noHitArc.x, y: noHitArc.y, radius: noHitArc.r }
        )
      ) {
        console.log("gotHIT");
        mob.hp -= player.attack.power;
        mob.gotHit = true;
      }
    }
  } else {
    var noHitArc = {
      x: answer[0] + atColCordx,
      y: answer[1] + atColCordy,
      r: 50,
    };
    var hitArc = {
      r: 130,
      x: player.x + player.width / 2 + answerX2,
      y: player.y + player.height / 2 + answerX2 * k,
    };
    // canvasContext.beginPath();
    // canvasContext.arc(
    //   answer[0] + atColCordx,
    //   answer[1] + atColCordy,
    //   50,
    //   0,
    //   2 * Math.PI
    // );
    // canvasContext.stroke();

    // canvasContext.beginPath();
    // canvasContext.arc(
    //   player.x + player.width / 2 + answerX2,
    //   player.y + player.height / 2 + answerX2 * k,
    //   140,
    //   0,
    //   2 * Math.PI
    // );
    // canvasContext.stroke();
    for (var i = 0; i < enemyList.length; i++) {
      var mob = enemyList[i];
      if (
        checkCollisionCircleWithRect(
          {
            minX: mob.x,
            maxX: mob.x + mob.width,
            minY: mob.y,
            maxY: mob.y + mob.height,
          },
          { x: hitArc.x, y: hitArc.y, radius: hitArc.r }
        ) &&
        mob.gotHit == false &&
        !checkCollisionCircleWithRect(
          {
            minX: mob.x,
            maxX: mob.x + mob.width,
            minY: mob.y,
            maxY: mob.y + mob.height,
          },
          { x: noHitArc.x, y: noHitArc.y, radius: noHitArc.r }
        )
      ) {
        console.log("gotHIT");
        mob.hp -= player.attack.power;
        mob.gotHit = true;
      }
    }
  }
}

function updateGameArea() {
  canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
}

var enemyList = [];
var slime_power = 1

function spawnEnemy(k) {
  if (k > gameDiff.spawnRate && enemyList.length < 200 || Game.start) {
    if (Math.random() < 0.25) {
      var enemy = {
        id: enemyID,
        x: Math.random() * canvasWidth,
        y: 0,
        anim_time: 0,
        anim_frame: 1,
        power: slime_power,
        width: 55,
        height: 25,
        hp: 10,
        alive: true,
        gotHit: false,
        anim_hit_time: 0,
        anim_hit_frame: 0,
        exp: 10,
      };
    } else if (Math.random() > 0.25 && Math.random() < 0.5) {
      var enemy = {
        id: enemyID,
        x: Math.random() * canvasWidth,
        y: canvasHeight,
        anim_time: 0,
        anim_frame: 1,
        power: slime_power,
        width: 55,
        height: 25,
        hp: 10,
        alive: true,
        gotHit: false,
        anim_hit_time: 0,
        anim_hit_frame: 0,
        exp: 10,
      };
    } else if (Math.random() > 0.5 && Math.random() < 0.75) {
      var enemy = {
        id: enemyID,
        x: 0,
        y: Math.random() * canvasHeight,
        anim_time: 0,
        anim_frame: 1,
        power: slime_power,
        width: 55,
        height: 25,
        hp: 10,
        alive: true,
        gotHit: false,
        anim_hit_time: 0,
        anim_hit_frame: 0,
        exp: 10,
      };
    } else {
      var enemy = {
        id: enemyID,
        x: canvasWidth,
        y: Math.random() * canvasHeight,
        anim_time: 0,
        anim_frame: 1,
        power: slime_power,
        width: 55,
        height: 25,
        hp: 10,
        alive: true,
        gotHit: false,
        anim_hit_time: 0,
        anim_hit_frame: 0,
        exp: 10,
      };
    }
    if (enemy.power==2){
      enemy.hp = 50
      enemy.exp = 20
    } else if (enemy.power==3){
      enemy.hp = 150
      enemy.exp = 50
    }
    enemyID += 1;

    enemyList.push(enemy);
    k = 0;
  }
  Game.start = false
  k += 1;

  enemyList = enemyList.filter((enemy) => enemy.alive == true);

  for (var i = 0; i < enemyList.length; i++) {
    drawEnemy(enemyList[i]);
  }

  return k;
}

var slime_animation = 0;
var slime_animation_list = {first: Array(), second: Array(), third: Array()}

for (var i1 = 0; i1 < 7; i1++) {
  slime_animation_list.first[i1] = new Image(55, 35);
  slime_animation_list.first[i1].src =
    "SLIME_ANIMATION/RUN " + (i1 + 1).toString() + ".png";
    slime_animation_list.second[i1] = new Image(55, 35);
  slime_animation_list.second[i1].src =
    "green run/RUN " + (i1 + 1).toString() + ".png";
    slime_animation_list.third[i1] = new Image(55, 35);
  slime_animation_list.third[i1].src =
    "RED RUN/RUN " + (i1 + 1).toString() + ".png";
}

var player_animation_list_right = Array();

for (var i1 = 0; i1 < 7; i1++) {
  player_animation_list_right[i1] = new Image();
  player_animation_list_right[i1].src =
    "player_walk/Walk " + (i1 + 1).toString() + ".png";
}

var player_animation_list_left = Array();

for (var i1 = 0; i1 < 7; i1++) {
  player_animation_list_left[i1] = new Image();
  player_animation_list_left[i1].src =
    "player_walk/Walk " + (i1 + 1).toString() + "l.png";
}

var player_staying = Array();

for (var i1 = 0; i1 < 6; i1++) {
  player_staying[i1] = new Image();
  player_staying[i1].src = "player_stay/stay " + (i1 + 1).toString() + ".png";
}

var player_got_hit = Array();

for (var i1 = 0; i1 < 4; i1++) {
  player_got_hit[i1] = new Image();
  player_got_hit[i1].src = "hurt_player/HURT " + (i1 + 1).toString() + ".png";
}

var player_got_hit_left = Array();

for (var i1 = 0; i1 < 4; i1++) {
  player_got_hit_left[i1] = new Image();
  player_got_hit_left[i1].src =
    "hurt_player/HURT " + (i1 + 1).toString() + "l.png";
}

var frost_attack = Array();

for (var i1 = 0; i1 < 10; i1++) {
  frost_attack[i1] = new Image();
  frost_attack[i1].src = "frost_attack/" + (i1 + 1).toString() + ".png";
}

var slime_got_hit_l = {first: Array(), second: Array(), third: Array()}

for (var i1 = 0; i1 < 6; i1++) {
  slime_got_hit_l.first[i1] = new Image();
  slime_got_hit_l.first[i1].src =
    "b_slime_hurt/Hurt" + (i1 + 1).toString() + "_L.png";
  slime_got_hit_l.second[i1] = new Image();
  slime_got_hit_l.second[i1].src =
    "GREEN HURT/Hurt" + (i1 + 1).toString() + "_L.png";
  slime_got_hit_l.third[i1] = new Image();
  slime_got_hit_l.third[i1].src =
    "RED HURT/Hurt" + (i1 + 1).toString() + "_L.png";
}

var slime_got_hit_r = {first: Array(), second: Array(), third: Array()}

for (var i1 = 0; i1 < 6; i1++) {
  slime_got_hit_r.first[i1] = new Image();
  slime_got_hit_r.first[i1].src =
    "b_slime_hurt/Hurt" + (i1 + 1).toString() + "_R.png";
  slime_got_hit_r.second[i1] = new Image();
  slime_got_hit_r.second[i1].src =
    "GREEN HURT/Hurt" + (i1 + 1).toString() + "_R.png";
  slime_got_hit_r.third[i1] = new Image();
  slime_got_hit_r.third[i1].src =
    "RED HURT/Hurt" + (i1 + 1).toString() + "_R.png";
}


var slimeDeath = {first: Array(), second: Array(), third: Array()};

for (var i1 = 0; i1 < 3; i1++) {
    slimeDeath.first[i1] = new Image();
    slimeDeath.first[i1].src =
    "dead/DEAD" + (i1 + 1).toString() + ".png";
    slimeDeath.second[i1] = new Image();
    slimeDeath.second[i1].src =
    "GREEN DEAD/DEAD " + (i1 + 1).toString() + ".png";
    slimeDeath.third[i1] = new Image();
    slimeDeath.third[i1].src =
    "RED DEAD/DEAD " + (i1 + 1).toString() + ".png";
}

function drawEnemy(enemy) {
  if (enemy.gotHit) {
    if (enemy.anim_hit_time > 3) {
      if (enemy.anim_hit_frame > 4) {
        enemy.gotHit = false;
        enemy.anim_hit_frame = -1;
        return;
      }
      enemy.anim_hit_frame += 1;
      enemy.anim_hit_time = 0;
    } else {
      enemy.anim_hit_time += 1;
    }

    if (enemy.x > player.x) {

      if (enemy.power == 1 ){
        canvasContext.drawImage(
          slime_got_hit_r.first[enemy.anim_hit_frame],
          enemy.x - 5,
          enemy.y - 15,
          100,
          50
        );
      } else if (enemy.power == 2){
        canvasContext.drawImage(
          slime_got_hit_r.second[enemy.anim_hit_frame],
          enemy.x - 5,
          enemy.y - 15,
          100,
          50
        );
      } else if (enemy.power == 3) {
        canvasContext.drawImage(
          slime_got_hit_r.third[enemy.anim_hit_frame],
          enemy.x - 5,
          enemy.y - 15,
          100,
          50
      );}
    } else {
      if (enemy.power == 1 ){
        canvasContext.drawImage(
          slime_got_hit_l.first[enemy.anim_hit_frame],
          enemy.x - 45,
          enemy.y - 15,
          100,
          50
        );
      } else if (enemy.power == 2){
        canvasContext.drawImage(
          slime_got_hit_l.second[enemy.anim_hit_frame],
          enemy.x - 45,
          enemy.y - 15,
          100,
          50
        );
      } else if (enemy.power == 3) {
        canvasContext.drawImage(
          slime_got_hit_l.third[enemy.anim_hit_frame],
          enemy.x - 45,
          enemy.y - 15,
          100,
          50
      );}
      
    }
    return;
  }

  if (enemy.anim_time > 10) {
    if (enemy.anim_frame > 5) {
      enemy.anim_frame = -1;
    }
    enemy.anim_frame += 1;
    enemy.anim_time = 0;
  } else {
    enemy.anim_time += 1;
  }
  if (enemy.power == 1){
  canvasContext.drawImage(
    slime_animation_list.first[enemy.anim_frame],
    enemy.x,
    enemy.y,
    55,
    35
  );} else if (enemy.power == 2){
    canvasContext.drawImage(
      slime_animation_list.second[enemy.anim_frame],
      enemy.x,
      enemy.y,
      55,
      35
    ); 
  } else if (enemy.power == 3){
    canvasContext.drawImage(
      slime_animation_list.third[enemy.anim_frame],
      enemy.x,
      enemy.y,
      55,
      35
    );
  }
  // canvasContext.fillStyle = "blue";
  // canvasContext.fillRect(enemy.x, enemy.y, 55, 35);
  return enemy;
}

function drawPlayer() {
  if (player.attack.isAttacking) {
    if (player.attack.attackFrameTimer > 2) {
      player.attack.attackFrameTimer = 0;
      player.attack.attackFrame += 1;
    }
    player.attack.attackFrameTimer += 1;
    if (player.attack.attackFrame < 10) {
      canvasContext.save();
      canvasContext.translate(
        player.x + player.width * 0.5,
        player.y + player.height * 0.5
      );
      canvasContext.rotate((-(player.attack.angle + 10) * Math.PI) / 180);
      canvasContext.translate(
        -player.x - player.width * 0.5,
        -player.y - player.height * 0.5
      );
      canvasContext.drawImage(
        frost_attack[player.attack.attackFrame],
        player.x - 100,
        player.y - 100,
        300,
        300
      );
      canvasContext.restore();
    }
    if (player.attack.attackFrame > 9) {
      player.attack.attackFrame = 0;
      player.attack.isAttacking = false;
      player.attack.attack_kd = 10;
    }
    TEMPdrawAttackCollision();
    for (var i = 0; i < enemyList.length; i++) {
      if (enemyList[i].hp <= 0) {
        player.exp += enemyList[i].exp

        enemyList[i].alive = false;
        
        deadSlimes.push({x:enemyList[i].x, y:enemyList[i].y, frame:0, frameTime:0, del:false, power:enemyList[i].power})
      }
    }
  }
  if (
    (player.isMoving == false || player.direction == "none") &&
    player.hit_kd < 1
  ) {
    if (player.movingTimer > 10) {
      player.movingStep += 1;
      player.movingTimer = 0;
    }
    if (player.movingStep > 5) {
      player.movingStep = 0;
    }
    player.movingTimer += 1;
    canvasContext.drawImage(
      player_staying[player.movingStep],
      player.x,
      player.y,
      45,
      75
    );
  }

  if (player.hit_kd > 0) {
    player.hit_kd -= 1;
  }

  // canvasContext.fillStyle = "blue";
  // canvasContext.fillRect(player.x, player.y, player.width, player.height);
  if (player.hit_kd > 30 && player.hit_from_right === true) {
    canvasContext.drawImage(player_got_hit[3], player.x, player.y, 45, 75);
  } else if (player.hit_kd > 20 && player.hit_from_right === true) {
    canvasContext.drawImage(player_got_hit[2], player.x, player.y, 45, 75);
  } else if (player.hit_kd > 10 && player.hit_from_right === true) {
    canvasContext.drawImage(player_got_hit[1], player.x, player.y, 45, 75);
  } else if (player.hit_kd > 0 && player.hit_from_right === true) {
    canvasContext.drawImage(player_got_hit[0], player.x, player.y, 45, 75);
  } else if (player.hit_kd > 30) {
    canvasContext.drawImage(player_got_hit_left[3], player.x, player.y, 45, 75);
  } else if (player.hit_kd > 20) {
    canvasContext.drawImage(player_got_hit_left[2], player.x, player.y, 45, 75);
  } else if (player.hit_kd > 10) {
    canvasContext.drawImage(player_got_hit_left[1], player.x, player.y, 45, 75);
  } else if (player.hit_kd > 0) {
    canvasContext.drawImage(player_got_hit_left[0], player.x, player.y, 45, 75);
  } else {
    if (player.isMoving) {
      if (player.movingTimer > 10) {
        player.movingStep += 1;
        player.movingTimer = 0;
      }
      if (player.movingStep > 6) {
        player.movingStep = 0;
      }
      player.movingTimer += 1;
      if (player.direction == "right") {
        canvasContext.drawImage(
          player_animation_list_right[player.movingStep],
          player.x,
          player.y,
          45,
          75
        );
      } else if (player.direction == "left") {
        canvasContext.drawImage(
          player_animation_list_left[player.movingStep],
          player.x,
          player.y,
          45,
          75
        );
      }
    }
  }
}

function enemyMove(playerX, playerY) {
  for (var i = 0; i < enemyList.length; i++) {
    var flagE = true;
    var needX;
    var needY;
    var coefficientX;
    var coefficientY;

    needX = Math.abs(playerX - enemyList[i].x);
    needY = Math.abs(playerY - enemyList[i].y);

    coefficientY = needY / (needX + needY);
    coefficientX = needX / (needY + needX);

    if (coefficientX > 0.65) {
      coefficientX = 0.65;
    }
    if (coefficientY > 0.65) {
      coefficientY = 0.65;
    }

    for (var j = 0; j < enemyList.length; j++) {
      
      if (i != j) {
        if (
          Math.abs(enemyList[i].x - enemyList[j].x) < 45 &&
          Math.abs(enemyList[i].y - enemyList[j].y) < 25
        ) {
          if (enemyList[i].x > enemyList[j].x) {
            enemyList[i].x += 1;
            enemyList[i].y -= 0.5;
            coefficientX -= 0.5 * coefficientX;
            coefficientY -= 0.5 * coefficientY;
            flagE = false;
          } else if (enemyList[i].x < enemyList[j].x) {
            enemyList[i].x -= 1;
            enemyList[i].y += 0.5;
            coefficientX -= 0.5 * coefficientX;
            coefficientY -= 0.5 * coefficientY;
            flagE = false;
          }
          if (enemyList[i].y > enemyList[j].y) {
            enemyList[i].y += 1;
            enemyList[i].x -= 0.5;
            coefficientX -= 0.5 * coefficientX;
            coefficientY -= 0.5 * coefficientY;
            flagE = false;
          } else if (enemyList[i].y < enemyList[j].y) {
            enemyList[i].y -= 1;
            enemyList[i].x += 0.5;
            coefficientX -= 0.5 * coefficientX;
            coefficientY -= 0.5 * coefficientY;
            flagE = false;
          }
        }}
        if (
          Math.abs(enemyList[i].x - player.x + 2) < player.width - 20 &&
          Math.abs(enemyList[i].y - player.y - 15) < player.height - 30
        ) {
          if (enemyList[i].x > player.x) {
            enemyList[i].x += 1;
            if (player.hit_kd == 0) {
              player.got_hit = true;
              player.hit_kd = 40;
              player.hit_from_right = true;
            }
          } else if (enemyList[i].x < player.x) {
            enemyList[i].x -= 1;
            if (player.hit_kd == 0) {
              player.got_hit = true;
              player.hit_kd = 40;
              player.hit_from_right = false;
            }
          }
          if (enemyList[i].y > player.y) {
            enemyList[i].y += 1;
            if (player.hit_kd == 0) {
              player.got_hit = true;
              player.hit_kd = 40;
              player.hit_from_right = true;
            }
          } else if (enemyList[i].y < player.y) {
            enemyList[i].y -= 1;
            if (player.hit_kd == 0) {
              player.got_hit = true;
              player.hit_kd = 40;
              player.hit_from_right = false;
            }
          }
        }
      
    }
    if (flagE) {
      if (enemyList[i].x > playerX) {
        enemyList[i].x -= 1.5 * coefficientX;
      } else if (enemyList[i].x < playerX) {
        enemyList[i].x += 1.5 * coefficientX;
      }
      if (enemyList[i].y > playerY) {
        enemyList[i].y -= 1.5 * coefficientY;
      } else if (enemyList[i].y < playerY) {
        enemyList[i].y += 1.5 * coefficientY;
      }
      if (player.got_hit == true) {
        player.hp -= 2;
        player.got_hit = false;
        console.log("Player hp: ", player.hp);
      }
    }
  }
}
var k = 0;

function playerVector(timestamp) {
  if (
    buttonPressed.includes("A") &&
    buttonPressed.includes("W") &&
    buttonPressed.includes("S") &&
    buttonPressed.includes("D")
  ) {
    delta.x = 0;
    delta.y = 0;
    player.direction = "none";
  } else if (
    buttonPressed.includes("A") &&
    buttonPressed.includes("W") &&
    buttonPressed.includes("S")
  ) {
    delta.x = -1.3;
    delta.y = 0;
    player.direction = "left";
  } else if (
    buttonPressed.includes("D") &&
    buttonPressed.includes("W") &&
    buttonPressed.includes("S")
  ) {
    delta.x = 1.3;
    delta.y = 0;
    player.direction = "right";
  } else if (
    buttonPressed.includes("A") &&
    buttonPressed.includes("W") &&
    buttonPressed.includes("D")
  ) {
    delta.x = 0;
    delta.y = -1.3;
    player.direction = "right";
  } else if (
    buttonPressed.includes("A") &&
    buttonPressed.includes("S") &&
    buttonPressed.includes("D")
  ) {
    delta.x = 0;
    delta.y = 1.3;
    player.direction = "left";
  } else if (buttonPressed.includes("A") && buttonPressed.includes("S")) {
    delta.x = -1;
    delta.y = 1;
    player.direction = "left";
  } else if (buttonPressed.includes("A") && buttonPressed.includes("W")) {
    delta.x = -1;
    delta.y = -1;
    player.direction = "left";
  } else if (buttonPressed.includes("A") && buttonPressed.includes("D")) {
    delta.x = 0;
    delta.y = 0;
    player.direction = "none";
  } else if (buttonPressed.includes("W") && buttonPressed.includes("S")) {
    delta.x = 0;
    delta.y = 0;
    player.direction = "none";
  } else if (buttonPressed.includes("W") && buttonPressed.includes("D")) {
    delta.x = 1;
    delta.y = -1;
    player.direction = "right";
  } else if (buttonPressed.includes("S") && buttonPressed.includes("D")) {
    delta.x = 1;
    delta.y = 1;
    player.direction = "right";
  } else if (buttonPressed.includes("D")) {
    delta.x = 1.3;
    delta.y = 0;
    player.direction = "right";
  } else if (buttonPressed.includes("A")) {
    delta.x = -1.3;
    delta.y = 0;
    player.direction = "left";
  } else if (buttonPressed.includes("W")) {
    delta.y = -1.3;
    delta.x = 0;
    player.direction = "left";
  } else if (buttonPressed.includes("S")) {
    delta.y = 1.3;
    delta.x = 0;
    player.direction = "right";
  }

  if (!ts) ts = timestamp;
  var passed = timestamp - ts;

  ts = timestamp;
  if (delta.x || delta.y) {
    player.x += (delta.x * passed) / 10;
    player.y += (delta.y * passed) / 10;
    if (player.x + player.width > Game.width) {
      player.x = Game.width - player.width;
    }
    if (player.y + player.height > Game.height) {
      player.y = Game.height - player.height;
    }
    if (player.x < 0) {
      player.x = 0;
    }
    if (player.y < 0) {
      player.y = 0;
    }
  }
}

//{x: enemyList[i].x, y: enemyList[i].y, frame: 0, frameTime: 0}


function drawDeadSlimes(list){
    for (var i = 0; i<list.length; i++){
            if (list[i].frameTime > 10) {
                
                list[i].frame += 1;
                list[i].frameTime = 0;
              } else {
                list[i].frameTime += 1;
              }
              if (list[i].frame > 2) {
                list[i].del = true
                continue
            }
            if (list[i].power == 1){
              canvasContext.drawImage(
                slimeDeath.first[list[i].frame],
                list[i].x,
                list[i].y,
                55,
                35
              );
            } else if (list[i].power == 2){
              canvasContext.drawImage(
                slimeDeath.second[list[i].frame],
                list[i].x,
                list[i].y,
                55,
                35
              );
            } else if (list[i].power == 3){
              canvasContext.drawImage(
                slimeDeath.third[list[i].frame],
                list[i].x,
                list[i].y,
                55,
                35
              );
            }
              
    }
    list = list.filter((mob) => mob.del==false)
    return list
}

function drawBars() {
  canvasContext.strokeStyle = "black";
  canvasContext.beginPath();
  canvasContext.moveTo(100, Game.height - 120);
  canvasContext.lineTo(100 + 300, Game.height - 120);
  canvasContext.lineTo(100 + 300, Game.height - 100);
  canvasContext.lineTo(100, Game.height - 100);
  canvasContext.closePath();
  canvasContext.stroke();
  canvasContext.beginPath();
  canvasContext.moveTo(101, Game.height - 119);
  canvasContext.lineTo(99 + 300, Game.height - 119);
  canvasContext.lineTo(99 + 300, Game.height - 101);
  canvasContext.lineTo(101, Game.height - 101);
  canvasContext.closePath();
  canvasContext.stroke();

  if (player.hp / 20 > 0) {
    canvasContext.fillStyle = "red";
    canvasContext.beginPath();
    canvasContext.moveTo(102, Game.height - 118);
    canvasContext.lineTo(98 + 300 * (player.hp / 20), Game.height - 118);
    canvasContext.lineTo(98 + 300 * (player.hp / 20), Game.height - 102);
    canvasContext.lineTo(102, Game.height - 102);
    canvasContext.closePath();
    canvasContext.fill();
  }
  canvasContext.fillStyle = "black";
  canvasContext.fillRect(0, Game.height-20, Game.width, Game.height)
  canvasContext.fillStyle = "yellow";
  canvasContext.fillRect(0, Game.height-20, Game.width*(player.exp/needToLVLup), Game.height)
  canvasContext.fillStyle="black";
  canvasContext.font="40px Pixelify Sans"
  canvasContext.fillText(String(player.lvl) + " LVL",Game.width-160,Game.height-40);



  canvasContext.fillStyle="black";
  canvasContext.font="20px Pixelify Sans"
  canvasContext.fillText("ATK: "+ String(player.attack.power),110, Game.height - 140);

  canvasContext.fillStyle="black";
  canvasContext.font="20px Pixelify Sans"
  canvasContext.fillText("HP: "+ String(player.hp),110, Game.height - 170);

  if (isLVLUP){
    canvasContext.fillStyle="red";
    canvasContext.font="20px Pixelify Sans"
    canvasContext.fillText("+1",180, Game.height - 140);

    canvasContext.fillStyle="red";
    canvasContext.font="20px Pixelify Sans"
    canvasContext.fillText("+"+ String(20-player.hp),180, Game.height - 170);
  }
}

var restartIMG = new Image()
restartIMG.src = "bg/restart_new.png"


function drawText() {
  canvasContext.fillStyle = "black"
  canvasContext.font = '100px Sevillana';
  canvasContext.drawImage(
    restartIMG,
    Game.width/2 - 490,
    Game.height/2 - 250,
    1000,
    500,
  );
  canvasContext.fillText('Press any key', (Game.width/2-250), Game.height/2);
  document.addEventListener("keydown", function (e) {
    location.reload()
  });
}

lvlupPIC = new Image()
lvlupPIC.src = "bg/lvlup.png"

function gameOver(redScreen){

  canvasContext.fillStyle = `rgba(128,0,0,0.02)`;
  canvasContext.fillRect(0,0, Game.width, Game.height)
  redScreen+=1
  if (redScreen>=100){
    window.cancelAnimationFrame(anim)
  }
  drawText()
  var anim = window.requestAnimationFrame(gameOver)
}

var lvlupanim = 0
var isLVLUP = false
function playerLVLUP(){
  isLVLUP = true
  lvlupanim +=1
  canvasContext.drawImage(
    lvlupPIC,
    player.x + player.width - 30,
    player.y - 60,
    100,
    80
  );
  
  
  if (lvlupanim>100){

      if (player.lvl<6){
      player.hp = 20
      player.attack.power +=1
      player.lvl +=1
      needToLVLup+=40
      if (player.lvl<3){
        gameDiff.spawnRate = gameDiff.spawnRate/2;
    } else {gameDiff.spawnRate -= 50}
      
      
      } else if (player.lvl<12){
        player.hp = 20
        player.attack.power +=1
        player.lvl +=1
        needToLVLup+=100
        gameDiff.spawnRate -= 10
  
      } else {
        player.hp = 20
        player.attack.power +=1
        player.lvl +=1
        needToLVLup+=1000
        gameDiff.spawnRate = gameDiff.spawnRate/2
        gameDiff.spawnRate -= 10
      }
      
    
    
    lvlupanim = 0
    player.exp = 0
  }
}
var needToLVLup = 40
var startTime = new Date()
function drawElapsedTime(){
  var date1 = new Date()
  var elapsed=String(parseInt((date1 - startTime)/1000));
  if (Number(elapsed)>=60){
    var minutes = String(parseInt(Math.floor(Number(elapsed)/60)))
    elapsed = String(Number(elapsed) - minutes*60)
  } else {
    var minutes = "00"
  }
  if (elapsed.length==1){
    elapsed = "0" + elapsed
  }
  if (minutes.length==1){
    minutes = "0" + minutes
  }
  canvasContext.save();
  canvasContext.beginPath();
  canvasContext.fillStyle="black";
  canvasContext.font="40px Pixelify Sans"
  canvasContext.globalAlpha=0.50;
  canvasContext.fillText(minutes+":"+elapsed,canvas.width/2-80,55);
  canvasContext.restore();
}
function play(timestamp) {
  if (player.hp <= 0) {
    console.log("Game Over");
    return;
  }
  updateGameArea(canvasContext);
  
  deadSlimes = drawDeadSlimes(deadSlimes)
  if (player.exp >= needToLVLup){
    playerLVLUP()
  } else {isLVLUP = false}
  

  k = spawnEnemy(k);

  enemyMove(player.x, player.y);

  playerVector(timestamp);

  drawPlayer();

  player.attack.attack_kd -= 1;
  if (player.attack.attack_kd < 0) {
    player.attack.attack_kd = 0;
  }
  drawBars();
  drawElapsedTime();

  if (player.hp<=0){
    var redScreen = 0
    gameOver(redScreen)
  }
  window.requestAnimationFrame(play);
}

play();
