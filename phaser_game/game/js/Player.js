const main = {
  key: "main",
  preload: preload,
  create: create,
  update: update,
  score: 0,
};

function preload() {
  this.load.image("sky", "game/assets/sky.png");
  this.load.image("ground", "game/assets/platform.png");
  this.load.image("star", "game/assets/star.png");
  this.load.image("bomb", "game/assets/bomb.png");
  this.load.image("head", "game/assets/head.png");
  this.load.image("bullet", "game/assets/bullet.png");
  this.load.spritesheet("dude", "game/assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
  this.load.image("gun", "game/assets/gun.png");
}

function create() {
  this.SprintNum = 0;
  this.mouse_point = {
    x: 0,
    y: 0,
    velocity_X: 0,
    velocity_Y: 0,
  };
  main.health = 3;
  main.score = 0;
  this.mouseX = 0;
  this.mouseY = 0;

  this.cursors = this.input.keyboard.createCursorKeys();
  this.input.keyboard.on("keydown-W", () => {
    Jump.call(this); // 使用箭頭函數確保正確的上下文
  });
  this.input.keyboard.on("keydown-UP", () => {
    Jump.call(this); // 使用箭頭函數確保正確的上下文
  });
  this.input.keyboard.on("keydown-SPACE", () => {
    Jump.call(this); // 使用箭頭函數確保正確的上下文
  });
  this.input.keyboard.on("keydown-F", () => {
    Sprint.call(this); // 使用箭頭函數確保正確的上下文
  });
  this.input.keyboard.on("keydown-G", () => {
    bombCreate.call(this); // 使用箭頭函數確保正確的上下文
  });
  this.input.keyboard.on("keydown-ESC", () => {
    this.scene.pause(this.scene.key);
    this.scene.run("Pause");
  });

  this.input.on(
    "pointerdown",
    function (pointer) {
      if (pointer.rightButtonDown()) {
        Sprint.call(this);
      } else if (pointer.leftButtonDown()) {
        fireBullet.call(this, pointer);
      }
    },
    this
  );

  this.input.on(
    "pointermove",
    function (pointer) {
      // 獲取滑鼠位置
      this.mouseX = pointer.x;
      this.mouseY = pointer.y;

      // 輸出滑鼠位置
    },
    this
  );
  // 監聽左右方向鍵的按下事件
  this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  this.keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
  this.keySpace = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SPACE
  );

  this.sky = this.add.image(400, 300, "sky");
  this.sky.setScrollFactor(0);

  this.platforms = this.physics.add.staticGroup();
  this.platforms.create(-400, 600, "ground").setScale(9, 1).refreshBody();
  this.platforms.create(600, 400, "ground");
  this.platforms.create(0, -100, "ground").setScale(2, 1).refreshBody();
  for (let i = 0; i <= 4; i++) {
    this.platforms
      .create(-400 - 135 * i, -125, "ground")
      .setScale(1 / 4, 1)
      .refreshBody();
  }
  this.platforms.create(-280, 50, "ground").setScale(6, 2).refreshBody();
  this.platforms.create(50, 350, "ground").setScale(1, 9).refreshBody();
  this.platforms.create(-500, 350, "ground").setScale(1, 9).refreshBody();
  this.platforms.create(750, 220, "ground");

  this.player = this.physics.add.sprite(95, 506, "dude");
  this.player.setBounce(0, 0);
  this.player.body.setGravityY(1000);
  this.player.health = 3;
  this.player.body.debug = true;
  this.player.body.setSize(10, 30);
  let offsetX = 32 / 2 - this.player.body.width / 2;
  let offsetY = 48 / 2 - this.player.body.height / 2 + 10;
  this.player.body.setOffset(offsetX, offsetY);

  this.head = this.add.sprite(400, 300, "head");
  this.head.setOrigin(0.5, 1);

  this.gun = this.add.sprite(this.player.x, this.player.y, "gun");
  this.gun.setOrigin(-0.4, 0.5);
  this.gun.velocity_x = 0;
  this.gun.velocity_y = 0;
  this.physics.add.collider(this.player, this.platforms);
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20,
  });
  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  this.stars = this.physics.add.group({
    // key: "star",
    // repeat: 11,
    // setXY: { x: 0, y: -350, stepX: 70 },
  });
  createStar.call(this);

  this.bullets = this.physics.add.group();
  this.physics.add.overlap(
    this.bullets,
    this.platforms,
    (bullet, platform) => {
      bullet.destroy();
    },
    null,
    this
  );

  this.stars.children.iterate(function (child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });
  this.physics.add.collider(this.stars, this.platforms);
  this.physics.add.overlap(this.player, this.stars, collectStar, null, this);

  this.bombs = this.physics.add.group();
  this.physics.add.collider(this.bombs, this.platforms);
  this.physics.add.collider(this.bombs, this.bullets, hitbullet, null, this);
  this.physics.add.collider(this.player, this.bombs, hitBomb, null, this);

  this.scoreText = this.add.text(16, 16, "score: 0", {
    color: "#ff0",
    fontFamily: "Tahoma",
    fontSize: 40,
    resolution: 2,
  });
  this.liftText = this.add.text(16, 530, "health:", {
    color: "#f00",
    fontFamily: "Tahoma",
    fontSize: 40,
    resolution: 2,
  });
  this.healthBarBackground = this.add
    .rectangle(175, 555, 60, 35, 0x000000)
    .setOrigin(0, 0.5)
    .setScrollFactor(0);
  this.healthBarBackground_ = this.add
    .rectangle(180, 555, 50, 25, 0xff0000)
    .setOrigin(0, 0.5)
    .setScrollFactor(0);

  // 創建血量條指示器
  this.healthBar = this.add
    .rectangle(180, 555, 50, 25, 0x00ff00)
    .setOrigin(0, 0.5)
    .setScrollFactor(0);

  this.scoreText.setScrollFactor(0);
  this.liftText.setScrollFactor(0);
  let graphics = this.add.graphics();
  let gameWidth = this.game.config.width * 2;
  let gameHeight = this.game.config.height * 2;
  let gridSize = 50; // 網格的單元大小
  // 設置網格線的顏色和透明度
  graphics.lineStyle(1, 0xffffff, 0.5);

  // 繪製垂直線和添加數字
  for (let x = -gameWidth; x <= gameWidth; x += gridSize) {
    graphics.beginPath();
    graphics.moveTo(x, -gameHeight);
    graphics.lineTo(x, gameHeight);
    graphics.closePath();
    graphics.strokePath();

    // 添加垂直線上的數字
    this.add.text(x + 5, 5, x.toString(), {
      fontSize: "10px",
      fill: "#ffffff",
    });
  }

  // 繪製水平線和添加數字
  for (let y = -gameHeight; y <= gameHeight; y += gridSize) {
    graphics.beginPath();
    graphics.moveTo(-gameWidth, y);
    graphics.lineTo(gameWidth, y);
    graphics.closePath();
    graphics.strokePath();
    // 添加水平線上的數字
    this.add.text(5, y + 5, y.toString(), {
      fontSize: "10px",
      fill: "#ffffff",
    });
  }
}
function updatePlayerHealthBar() {
  // 更新血量條的寬度
  this.healthBar.setSize(50 * (this.player.health / 3), 25);
  gmaeEnd.call(this);
}
function createStar() {
  this.platforms.getChildren().forEach((platform) => {
    for (
      let i = 0;
      i <
      Phaser.Math.Between(
        0,
        (1 * (platform.body.right - platform.body.left)) / 100
      );
      i++
    ) {
      this.stars.create(
        Phaser.Math.Between(platform.body.left, platform.body.right),
        platform.body.top - 50,
        "star"
      );
    }
  });
}
function fireBullet(pointer) {
  // 創建子彈精靈，位置在玩家位置

  this.bullet = this.bullets.create(this.gun.x, this.gun.y, "bullet");
  this.bullet.body.setSize(5, 5);
  // 設置子彈的速度和方向
  let deltaX = this.mouseX - 400;
  let deltaY = this.mouseY - 300;
  let length = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  let velocity = new Phaser.Math.Vector2(
    1500 * (deltaX / length),
    1500 * (deltaY / length)
  )
    .normalize()
    .scale(1000);

  if (velocity.x !== 0 || velocity.y !== 0) {
    let angleInRadians = Math.atan2(velocity.y, velocity.x);
    this.bullet.setRotation(angleInRadians);
  }
  this.gun.x -= velocity.x / 50;
  this.gun.y -= velocity.y / 50;
  this.bullet.setVelocity(velocity.x, velocity.y);
  this.bullet.setImmovable(true);
}
let max_velocity = {
  x: 260,
  y: 500,
};
function update() {
  this.head.x = this.player.body.x + this.player.body.width / 2;
  this.head.y = this.player.body.y + 16;
  this.gun.x +=
    (this.player.body.x + this.player.body.width / 2 - this.gun.x) / 5;
  this.gun.y += (this.player.body.y + 15 - this.gun.y) / 5;

  let angle = Phaser.Math.Angle.Between(
    this.gun.x,
    this.gun.y,
    this.player.body.x + this.mouseX - 400,
    this.player.body.y + this.mouseY - 300
  );
  this.gun.setRotation(angle);
  this.head.setRotation(angle);

  if (angle < Math.PI / 2 && angle > -Math.PI / 2) {
    this.gun.setFlipY(false);
    this.head.setFlipY(false);
    this.head.setOrigin(0.5, 1);
  } else {
    this.gun.setFlipY(true);
    this.head.setFlipY(true);
    this.head.setOrigin(0.5, 0);
  }




  this.bullets.children.each(function (bullet) {
    if (bullet.body.velocity.x !== 0 || bullet.body.velocity.y !== 0) {
      let angleInRadians = Math.atan2(
        bullet.body.velocity.y,
        bullet.body.velocity.x
      );
      bullet.setRotation(angleInRadians);
    }

    bullet.body.setAllowGravity(false);
    if (
      this.bullet.x < -2500 ||
      this.bullet.x > 2500 ||
      this.bullet.y < -2500 ||
      this.bullet.y > 2500
    ) {
      bullet.destroy();
    }
  }, this);

  if (this.player.body.touching.down) {
    this.SprintNum = 1;
  }
  this.bombs.getChildren().forEach((bomb) => {
    bomb.healthBarBackground.x = bomb.x - 50;
    bomb.healthBarBackground.y = bomb.body.top - 20;
    bomb.healthBar.x = bomb.x - 50;
    bomb.healthBar.y = bomb.body.top - 20;
    bomb.healthBar.setSize(100 * (bomb.health / 3), 10);
    if (bomb.health <= 0) {
      bomb.healthBar.destroy();
      bomb.healthBarBackground.destroy();
      bomb.destroy();
    }
  });

  bombsAngle.call(this);
  playerMove.call(this);
  movementCorrection.call(this);
  maxSpeed.call(this);
  playerAnmation.call(this);
  camerasMove.call(this);
}
function camerasMove() {
  // this.cameras.main.startFollow(this.player, false, 0.1,  0.1 );
  this.cameras.main.scrollY = this.player.body.y - 300;
  this.cameras.main.scrollX = this.player.body.x - 400;
  this.mouse_point.velocity_X = (this.mouseX - this.mouse_point.x) / 17.0;
  this.mouse_point.velocity_Y = (this.mouseY - this.mouse_point.y) / 17.0;
  this.mouse_point.x += this.mouse_point.velocity_X;
  this.mouse_point.y += this.mouse_point.velocity_Y;

  this.cameras.main.scrollX = Math.floor(
    this.player.body.x - 400.0 + (this.mouse_point.x - 400.0) / 2
  );

  this.cameras.main.scrollY = Math.floor(
    this.player.body.y - 300.0 + (this.mouse_point.y - 300.0) / 2
  );
  // this.cameras.main.scrollX=this.mouse_point.x;
  // this.cameras.main.scrollY=this.mouse_point.y;
}
function bombsAngle() {
  this.bombs.getChildren().forEach(function (bomb) {
    // 如果炸彈有速度，則計算並設置其旋轉角度
    if (bomb.body.velocity.x !== 0 || bomb.body.velocity.y !== 0) {
      let angleInRadians = Math.atan2(
        bomb.body.velocity.y,
        bomb.body.velocity.x
      );
      bomb.setRotation(angleInRadians);
    }
  });
}
function playerMove() {
  const bottomIsDown = this.cursors.down.isDown || this.keyS.isDown;
  const upIsDown =
    this.keySpace.isDown || this.keyW.isDown || this.cursors.up.isDown;
  const leftIsDown = this.cursors.left.isDown || this.keyA.isDown;
  const rightIsDown = this.cursors.right.isDown || this.keyD.isDown;
  // 左右移動
  if (upIsDown && this.player.body.velocity.y < 0) {
    this.player.body.setVelocityY(this.player.body.velocity.y - 4);
  }
  if (leftIsDown) {
    if (this.player.body.velocity.x >= -max_velocity.x) {
      this.player.body.setVelocityX(
        this.player.body.velocity.x - max_velocity.x / 9.8
      );
    }
  } else if (rightIsDown) {
    if (this.player.body.velocity.x <= max_velocity.x) {
      this.player.body.setVelocityX(
        this.player.body.velocity.x + max_velocity.x / 9.8
      );
    }
  } else if (this.player.body.touching.down) {
    this.player.body.setVelocityX(this.player.body.velocity.x * 0.9);
  } else {
    this.player.body.setVelocityX(this.player.body.velocity.x * 0.98);
  }
  //上跳時的額外上升速度
  if (bottomIsDown) {
    this.player.body.setVelocityY(this.player.body.velocity.y + 10);
  }
  // 蹬牆摩擦力
  if (
    ((this.player.body.touching.left && leftIsDown) ||
      (this.player.body.touching.right && rightIsDown)) &&
    !upIsDown
  ) {
    this.player.body.setVelocityY(this.player.body.velocity.y * 0.1);
  }
}
function movementCorrection() {
  const detectionRange = 10; // 小範圍偵測的範圍
  this.platforms.getChildren().forEach((platform) => {
    // 獲取平臺的位置和大小
    let platformBounds = platform.getBounds();
    // 檢查角色的底部是否與平臺的頂部發生碰撞

    if (
      ((platformBounds.left < this.player.body.right &&
        platformBounds.left + detectionRange > this.player.body.right) ||
        (platformBounds.right > this.player.body.left &&
          platformBounds.right - detectionRange < this.player.body.left)) &&
      platformBounds.top <= this.player.body.bottom + detectionRange &&
      platformBounds.top >= this.player.body.bottom
    ) {
      edgeJump.call(this);
    }

    if (
      this.player.body.velocity.x > 0 &&
      platformBounds.top < this.player.body.bottom &&
      platformBounds.top + 15 > this.player.body.bottom &&
      platformBounds.left >= this.player.body.right &&
      platformBounds.left <= this.player.body.right
    ) {
      // 角色的底部碰撞到了平臺的頂部
      this.player.body.velocity.y = 0;
      this.player.y = platformBounds.top - this.player.body.height - 1;
      // 在這裡可以執行碰撞後的動作
    }
    if (
      this.player.body.velocity.x < 0 &&
      platformBounds.top < this.player.body.bottom &&
      platformBounds.top + 15 > this.player.body.bottom &&
      platformBounds.right >= this.player.body.left &&
      platformBounds.right <= this.player.body.left
    ) {
      // 角色的底部碰撞到了平臺的頂部
      this.player.body.velocity.y = 0;
      this.player.y = platformBounds.top - this.player.body.height - 1;
      // 在這裡可以執行碰撞後的動作
    }

    if (
      this.player.body.velocity.x <= 0 &&
      platformBounds.bottom - 1 < this.player.body.top &&
      platformBounds.bottom + 3 >= this.player.body.top &&
      platformBounds.left > this.player.body.right - detectionRange &&
      platformBounds.left + 1 < this.player.body.right
    ) {
      // 角色的底部碰撞到了平臺的頂部

      this.player.body.velocity.x = 0;
      this.player.x = platformBounds.left - this.player.body.width / 2 - 1;
      // 在這裡可以執行碰撞後的動作
    }
    if (
      this.player.body.velocity.x >= 0 &&
      platformBounds.bottom - detectionRange < this.player.body.top &&
      platformBounds.bottom + 3 >= this.player.body.top &&
      platformBounds.right < this.player.body.left + detectionRange &&
      platformBounds.right - 1 > this.player.body.left
    ) {
      // 角色的底部碰撞到了平臺的頂部
      this.player.body.velocity.x = 0;
      this.player.x = platformBounds.right + this.player.body.width / 2 + 1;
      // 在這裡可以執行碰撞後的動作
    }
  });
}
function maxSpeed() {
  // 限製水平速度
  if (
    this.player.body.velocity.x < -max_velocity.x &&
    this.player.body.touching.down
  ) {
    this.player.body.setVelocityX(-max_velocity.x);
  }
  if (
    this.player.body.velocity.x > max_velocity.x &&
    this.player.body.touching.down
  ) {
    this.player.body.setVelocityX(max_velocity.x);
  }
}
function playerAnmation() {
  // 播放動畫
  if (this.player.body.velocity.x > 1) {
    this.player.anims.play("right", true);
  } else if (this.player.body.velocity.x < -1) {
    this.player.anims.play("left", true);
  } else {
    this.player.body.velocity.x = 0;
    this.player.anims.play("turn");
  }
}
function hitBomb(player, bomb) {
  if (!this.invincibleTime_) {
    console.log("hitBomb");
    invincibleTime.call(this, player, bomb);
    player.health--;

    updatePlayerHealthBar.call(this);
  }
}
function hitbullet(bomb, bullet) {
  bomb.health--;
  console.log(bomb.health);
}
function invincibleTime(player) {
  this.invincibleTime_ = this.time.addEvent({
    delay: 3000 / 12, // 每次執行間隔時間（毫秒）
    callback: () => {
      if (this.invincibleTime_.getOverallProgress() == 1) {
        this.invincibleTime_.remove();
        this.invincibleTime_ = null;
        player.setTint(0xffffff);
        player.setAlpha(1);
      } else {
        if (this.invincibleTime_.getRepeatCount() % 2) {
          player.setAlpha(0.2);
          player.setTint(0xff0000);
        } else {
          player.setAlpha(1);
          player.setTint(0xffffff);
        }
      }
    },
    callbackScope: this,
    hasDispatched: false,
    loop: false,
    repeat: 12, // 執行次數（0表示無限次）
  });
}
function collectStar(player, star) {
  star.disableBody(true, true);

  main.score += 10;
  this.scoreText.setText("Score: " + main.score);

  if (this.stars.countActive(true) === 0) {
    createStar.call(this);

    bombCreate.call(this);
  }
}
function bombCreate() {
  let x =
    this.player.x < 400
      ? Phaser.Math.Between(400, 800)
      : Phaser.Math.Between(0, 400);
  let bomb = this.bombs.create(x, 16, "bomb").setScale(2, 2).refreshBody();
  bomb.health = 3; // 設置炸彈的生命值

  bomb.healthBarBackground = this.add.rectangle(
    bomb.x - 50,
    bomb.y - 20,
    100,
    10,
    0xff0000
  );
  bomb.healthBarBackground.setOrigin(0, 0.5);
  bomb.healthBar = this.add.rectangle(
    bomb.x - 50,
    bomb.y - 20,
    100,
    10,
    0x00ff00
  );
  bomb.healthBar.setOrigin(0, 0.5);

  bomb.maxSpeed = 200;
  bomb.setBounce(1);
  bomb.setCollideWorldBounds(true);
  bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
}
function edgeJump() {
  this.delayedJump_ = this.time.addEvent({
    delay: 132 / 2, // 每次執行間隔時間（毫秒）
    callback: () => {
      if (this.delayedJump_.getOverallProgress() == 1) {
        this.delayedJump_.remove();
        this.delayedJump_ = null;
      }
    },
    callbackScope: this,
    hasDispatched: false,
    loop: false,
    repeat: 2, // 執行次數（0表示無限次）
  });
}
function Sprint() {
  let max_velocity_x = 0;
  let max_velocity_y = 0;
  const bottomIsDown = this.cursors.down.isDown || this.keyS.isDown;
  const upIsDown =
    this.keySpace.isDown || this.keyW.isDown || this.cursors.up.isDown;
  const leftIsDown = this.cursors.left.isDown || this.keyA.isDown;
  const rightIsDown = this.cursors.right.isDown || this.keyD.isDown;
  const max_velocity = 1800;
  // if (this.cursors.left.isDown || this.keyA.isDown) {
  //   max_velocity_x = -max_velocity;
  //   max_velocity_y = 0;
  // } else if (rightIsDown) {
  //   max_velocity_x = max_velocity;
  //   max_velocity_y = 0;
  // } else if (upIsDown) {
  //   max_velocity_x = 0;
  //   max_velocity_y = -max_velocity;
  // } else if (bottomIsDown) {
  //   max_velocity_x = 0;
  //   max_velocity_y = max_velocity;
  // }
  // if (leftIsDown && upIsDown) {
  //   max_velocity_x = max_velocity * Math.cos((135 * Math.PI) / 180);
  //   max_velocity_y = -max_velocity * Math.sin((135 * Math.PI) / 180);
  // } else if (rightIsDown && upIsDown) {
  //   max_velocity_x = max_velocity * Math.cos((45 * Math.PI) / 180);
  //   max_velocity_y = -max_velocity * Math.sin((45 * Math.PI) / 180);
  // }
  // if (leftIsDown && bottomIsDown) {
  //   max_velocity_x = max_velocity * Math.cos((225 * Math.PI) / 180);
  //   max_velocity_y = -max_velocity * Math.sin((225 * Math.PI) / 180);
  // } else if (rightIsDown && bottomIsDown) {
  //   max_velocity_x = max_velocity * Math.cos((315 * Math.PI) / 180);
  //   max_velocity_y = -max_velocity * Math.sin((315 * Math.PI) / 180);
  // }
  max_velocity_x =
    max_velocity *
    ((this.mouseX - 400) /
      Math.pow(
        Math.pow(this.mouseX - 400, 2) + Math.pow(this.mouseY - 300, 2),
        0.5
      ));
  max_velocity_y =
    max_velocity *
    ((this.mouseY - 300) /
      Math.pow(
        Math.pow(this.mouseX - 400, 2) + Math.pow(this.mouseY - 300, 2),
        0.5
      ));
  if (this.SprintNum) {
    this.sprint_ = this.time.addEvent({
      delay: 150 / 30, // 每次執行間隔時間（毫秒）
      callback: () => {
        if (this.sprint_.getOverallProgress() == 1) {
          this.player.setGravityY(1000);

          this.sprint_.remove();
          this.sprint_ = null;
          this.SprintNum = 0;
          this.player.body.setVelocityX(max_velocity_x * 0.1);
          this.player.body.setVelocityY(max_velocity_y * 0.1);
          this.head.setTint(0xffffff);
          this.player.setTint(0xffffff);
        } else {
          this.player.setTint(0x00ffff);
          this.head.setTint(0x00ffff);
          this.player.setGravityY(0);
          this.player.body.setVelocityX(
            max_velocity_x * (0.2 + (this.sprint_.getOverallProgress() * 3) / 4)
          );
          this.player.body.setVelocityY(
            max_velocity_y * (0.2 + (this.sprint_.getOverallProgress() * 3) / 4)
          );
        }
      },
      callbackScope: this,
      hasDispatched: false,
      loop: false,
      repeat: 30, // 執行次數（0表示無限次）
    });
  }
}
function gmaeEnd() {
  console.log(this.player.health);
  if (this.player.health <= 0) {
    this.scene.start("end");
    this.delayedhitBomb_ = null;
    this.delayedJump_ = null;
    this.sprint_ = null;
  }
}
function Jump(jumpHeigh, jumpspeed) {
  if (!jumpHeigh) jumpHeigh = 500;
  if (!jumpspeed) jumpspeed = 450;
  const detectionRange = 10; // 小範圍偵測的範圍
  this.platforms.getChildren().forEach((platform) => {
    let platformBounds = platform.getBounds();

    // 起跳碰撞偵測
    if (
      this.delayedJump_ ||
      (platformBounds.left < this.player.body.right &&
        platformBounds.right > this.player.body.left &&
        platformBounds.top <= this.player.body.bottom + detectionRange &&
        platformBounds.top >= this.player.body.bottom)
    ) {
      this.player.body.setVelocityY(-jumpHeigh);
    }

    // 左側碰撞偵測
    if (
      platformBounds.left >= this.player.body.right - detectionRange / 2 &&
      platformBounds.left <= this.player.body.right + detectionRange &&
      platformBounds.top + 2 < this.player.body.bottom &&
      platformBounds.bottom > this.player.body.top
    ) {
      // 處理碰撞後的動作

      this.player.body.setVelocityX(-jumpHeigh);
      this.player.body.setVelocityY(-jumpspeed);
    }
    // 右側碰撞偵測
    if (
      platformBounds.right <= this.player.body.left + detectionRange / 2 &&
      platformBounds.right >= this.player.body.left - detectionRange &&
      platformBounds.top + 2 < this.player.body.bottom &&
      platformBounds.bottom > this.player.body.top
    ) {
      // 處理碰撞後的動作
      this.player.body.setVelocityX(jumpHeigh);
      this.player.body.setVelocityY(-jumpspeed);
    }
  });
}
export default main;
