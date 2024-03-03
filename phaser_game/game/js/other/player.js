import bullet from "./bullet.js";
let player = function (game, platforms, RoleInfo) {
  this.game = game;
  this.platforms = platforms;
  this.RoleInfo = RoleInfo;

  this.invincibleTime_ = null;
  this.SprintNum = 0;
  this.health = this.RoleInfo.max_health;

  this.sprite = this.game.physics.add.sprite(95, 506, "dude");
  this.sprite.setBounce(0, 0);
  this.sprite.body.setGravityY(1350);
  this.sprite.body.setSize(10, 30);

  this.sprite.MaxVelocityX = 260;
  this.sprite.MaxVvelocityY = 500;

  this.bullet = new bullet(this.game, this.platforms);

  let offsetX = 32 / 2 - this.sprite.body.width / 2;
  let offsetY = 48 / 2 - this.sprite.body.height / 2 + 8;
  this.sprite.body.setOffset(offsetX, offsetY);

  this.head = this.game.add.sprite(400, 300, "head");
  this.head.setOrigin(0.5, 1);

  this.gun = this.game.physics.add.sprite(this.sprite.x, this.sprite.y, "gun");
  this.gun.body.setSize(10, 10);
  this.gun.setOrigin(-0.4, 0.5);
  this.gun.setOffset(this.gun.width * -0.4, this.gun.height * 0.5);
  this.gun.body.setAllowGravity(false);

  this.skick= this.game.sound.add("kick");
  this.skick.setVolume(0.2);

  this.cursors = this.game.input.keyboard.createCursorKeys();
  this.keyA = this.game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  this.keyS = this.game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  this.keyW = this.game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  this.keyD = this.game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  this.keyZ = this.game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
  this.pointer = this.game.input.mousePointer;
  this.keySpace = this.game.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SPACE
  );
  this.game.input.keyboard.on("keydown-W", () => {
    this.Jump(); // 使用箭頭函數確保正確的上下文
  });
  this.game.input.keyboard.on("keydown-UP", () => {
    this.Jump(); // 使用箭頭函數確保正確的上下文
  });
  this.game.input.keyboard.on("keydown-SPACE", () => {
    this.Jump(); // 使用箭頭函數確保正確的上下文
  });
  this.game.input.on(
    "pointerdown",
    function (pointer) {
      if (pointer.rightButtonDown()) {
        this.Sprint();
      } else if (pointer.leftButtonDown()) {
        this.bullet.fireBullet(this.gun, pointer);
      }
    },
    this
  );
  if (!this.game.anims.exists("left")) {
    this.game.anims.create({
      key: "left",
      frames: this.game.anims.generateFrameNumbers("dude", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }
  if (!this.game.anims.exists("turn")) {
    this.game.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });
  }

  if (!this.game.anims.exists("right")) {
    this.game.anims.create({
      key: "right",
      frames: this.game.anims.generateFrameNumbers("dude", {
        start: 5,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  console.log("player_created");
};
player.prototype.Update = function () {
  this.head.x = this.sprite.body.x + this.sprite.body.width / 2;
  this.head.y = this.sprite.body.y + 19;
  this.gun.setVelocity(
    (this.sprite.body.x + this.sprite.body.width / 2 - this.gun.x) * 10,
    (this.sprite.body.y + 15 - this.gun.y) * 10
  );

  let angle_Gun = Phaser.Math.Angle.Between(
    this.gun.body.x,
    this.gun.body.y,
    this.sprite.body.x + this.pointer.x - 400,
    this.sprite.body.y + this.pointer.y - 300
  );
  this.gun.setRotation(angle_Gun);
  let angle_head = Phaser.Math.Angle.Between(
    this.head.x,
    this.head.y,
    this.sprite.body.x + this.pointer.x - 400,
    this.sprite.body.y + this.pointer.y - 300
  );
  this.head.setRotation(angle_head);
  if (this.sprite.body.touching.down) {
    this.SprintNum = 1;
  }
  if (angle_Gun < Math.PI / 2 && angle_Gun > -Math.PI / 2) {
    this.gun.setFlipY(false);
  } else {
    this.gun.setFlipY(true);
  }
  if (angle_head < Math.PI / 2 && angle_head > -Math.PI / 2) {
    this.head.setFlipY(false);
    this.head.setOrigin(0.5, 1);
  } else {
    this.head.setFlipY(true);
    this.head.setOrigin(0.5, 0);
  }

  this.PlayerMove();
  this.MovementCorrection();
  this.MaxSpeed();
  this.PlayerAnmation();
};
player.prototype.MovementCorrection = function () {
  const detectionRange = 10; // 小範圍偵測的範圍
  this.platforms.getChildren().forEach((platform) => {
    // 獲取平臺的位置和大小
    let platformBounds = platform.getBounds();
    // 檢查角色的底部是否與平臺的頂部發生碰撞

    if (
      ((platformBounds.left < this.sprite.body.right &&
        platformBounds.left + detectionRange > this.sprite.body.right) ||
        (platformBounds.right > this.sprite.body.left &&
          platformBounds.right - detectionRange < this.sprite.body.left)) &&
      platformBounds.top <= this.sprite.body.bottom + detectionRange &&
      platformBounds.top >= this.sprite.body.bottom
    ) {
      this.EdgeJump();
    }

    if (
      this.sprite.body.velocity.x > 0 &&
      platformBounds.top < this.sprite.body.bottom &&
      platformBounds.top + 15 > this.sprite.body.bottom &&
      platformBounds.left >= this.sprite.body.right &&
      platformBounds.left <= this.sprite.body.right
    ) {
      // 角色的底部碰撞到了平臺的頂部
      this.sprite.body.velocity.y = 0;
      this.sprite.y = platformBounds.top - this.sprite.body.height - 1;
      // 在這裡可以執行碰撞後的動作
    }
    if (
      this.sprite.body.velocity.x < 0 &&
      platformBounds.top < this.sprite.body.bottom &&
      platformBounds.top + 15 > this.sprite.body.bottom &&
      platformBounds.right >= this.sprite.body.left &&
      platformBounds.right <= this.sprite.body.left
    ) {
      // 角色的底部碰撞到了平臺的頂部
      this.sprite.body.velocity.y = 0;
      this.sprite.y = platformBounds.top - this.sprite.body.height - 1;
      // 在這裡可以執行碰撞後的動作
    }

    if (
      this.sprite.body.velocity.x <= 0 &&
      platformBounds.bottom - 1 < this.sprite.body.top &&
      platformBounds.bottom + 3 >= this.sprite.body.top &&
      platformBounds.left > this.sprite.body.right - detectionRange &&
      platformBounds.left + 1 < this.sprite.body.right
    ) {
      // 角色的底部碰撞到了平臺的頂部

      this.sprite.body.velocity.x = 0;
      this.sprite.x = platformBounds.left - this.sprite.body.width / 2 - 1;
      // 在這裡可以執行碰撞後的動作
    }
    if (
      this.sprite.body.velocity.x >= 0 &&
      platformBounds.bottom - detectionRange < this.sprite.body.top &&
      platformBounds.bottom + 3 >= this.sprite.body.top &&
      platformBounds.right < this.sprite.body.left + detectionRange &&
      platformBounds.right - 1 > this.sprite.body.left
    ) {
      // 角色的底部碰撞到了平臺的頂部
      this.sprite.body.velocity.x = 0;
      this.sprite.x = platformBounds.right + this.sprite.body.width / 2 + 1;
      // 在這裡可以執行碰撞後的動作
    }
  });
};
player.prototype.Jump = function (jumpHeigh, jumpspeed) {
  if (!jumpHeigh) jumpHeigh = 500;
  if (!jumpspeed) jumpspeed = 450;
  const detectionRange = 10; // 小範圍偵測的範圍
  this.platforms.getChildren().forEach((platform) => {
    let platformBounds = platform.getBounds();

    // 起跳碰撞偵測
    if (
      this.delayedJump_ ||
      (platformBounds.left < this.sprite.body.right &&
        platformBounds.right > this.sprite.body.left &&
        platformBounds.top <= this.sprite.body.bottom + detectionRange &&
        platformBounds.top >= this.sprite.body.bottom)
    ) {
      this.sprite.body.setVelocityY(-jumpHeigh);
    }

    // 左側碰撞偵測
    if (
      platformBounds.left >= this.sprite.body.right - detectionRange / 2 &&
      platformBounds.left <= this.sprite.body.right + detectionRange &&
      platformBounds.top + 2 < this.sprite.body.bottom &&
      platformBounds.bottom > this.sprite.body.top
    ) {
      // 處理碰撞後的動作

      this.sprite.body.setVelocityX(-jumpHeigh);
      this.sprite.body.setVelocityY(-jumpspeed);
    }
    // 右側碰撞偵測
    if (
      platformBounds.right <= this.sprite.body.left + detectionRange / 2 &&
      platformBounds.right >= this.sprite.body.left - detectionRange &&
      platformBounds.top + 2 < this.sprite.body.bottom &&
      platformBounds.bottom > this.sprite.body.top
    ) {
      // 處理碰撞後的動作
      this.sprite.body.setVelocityX(jumpHeigh);
      this.sprite.body.setVelocityY(-jumpspeed);
    }
  });
};
player.prototype.EdgeJump = function () {
  this.delayedJump_ = this.game.time.addEvent({
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
};
player.prototype.Sprint = function () {
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
    ((this.pointer.x - 400) /
      Math.pow(
        Math.pow(this.pointer.x - 400, 2) + Math.pow(this.pointer.y - 300, 2),
        0.5
      ));
  max_velocity_y =
    max_velocity *
    ((this.pointer.y - 300) /
      Math.pow(
        Math.pow(this.pointer.x - 400, 2) + Math.pow(this.pointer.y - 300, 2),
        0.5
      ));
  if (this.SprintNum) {
    this.sprint_ = this.game.time.addEvent({
      delay: 150 / 30, // 每次執行間隔時間（毫秒）
      callback: () => {
        if (this.sprint_.getOverallProgress() == 1) {
          

          this.sprint_.remove();
          this.sprint_ = null;
          this.SprintNum = 0;
          this.sprite.setGravityY(1350);
          this.sprite.body.setVelocityX(max_velocity_x * 0.1);
          this.sprite.body.setVelocityY(max_velocity_y * 0.1);
          this.head.setTint(0xffffff);
          this.sprite.setTint(0xffffff);
        } else {
          this.sprite.setTint(0x00ffff);
          this.head.setTint(0x00ffff);
          this.sprite.setGravityY(0);
          this.sprite.body.setVelocityX(
            max_velocity_x * (0.2 + (this.sprint_.getOverallProgress() * 3) / 4)
          );
          this.sprite.body.setVelocityY(
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
};
player.prototype.PlayerAnmation = function () {
  // 播放動畫
  if (this.sprite.body.velocity.x > 1) {
    this.sprite.anims.play("right", true);
  } else if (this.sprite.body.velocity.x < -1) {
    this.sprite.anims.play("left", true);
  } else {
    this.sprite.body.velocity.x = 0;
    this.sprite.anims.play("turn");
  }
};
player.prototype.MaxSpeed = function () {
  // 限製水平速度
  if (
    this.sprite.body.velocity.x < -this.sprite.MaxVelocityX &&
    this.sprite.body.touching.down
  ) {
    this.sprite.body.setVelocityX(-this.sprite.MaxVelocityX);
  }
  if (
    this.sprite.body.velocity.x > this.sprite.MaxVelocityX &&
    this.sprite.body.touching.down
  ) {
    this.sprite.body.setVelocityX(this.sprite.MaxVelocityX);
  }
};
player.prototype.PlayerMove = function () {
  const bottomIsDown = this.cursors.down.isDown || this.keyS.isDown;
  const upIsDown =
    this.keySpace.isDown || this.keyW.isDown || this.cursors.up.isDown;
  const leftIsDown = this.cursors.left.isDown || this.keyA.isDown;
  const rightIsDown = this.cursors.right.isDown || this.keyD.isDown;
  // 左右移動
  if (upIsDown && this.sprite.body.velocity.y < 0) {
    this.sprite.body.setVelocityY(this.sprite.body.velocity.y - 4);
  }
  if (leftIsDown) {
    if (this.sprite.body.velocity.x >= -this.sprite.MaxVelocityX) {
      this.sprite.body.setVelocityX(
        this.sprite.body.velocity.x - this.sprite.MaxVelocityX / 9.8
      );
    }
  } else if (rightIsDown) {
    if (this.sprite.body.velocity.x <= this.sprite.MaxVelocityX) {
      this.sprite.body.setVelocityX(
        this.sprite.body.velocity.x + this.sprite.MaxVelocityX / 9.8
      );
    }
  } else if (this.sprite.body.touching.down) {
    this.sprite.body.setVelocityX(this.sprite.body.velocity.x * 0.9);
  } else {
    this.sprite.body.setVelocityX(this.sprite.body.velocity.x * 0.98);
  }
  //上跳時的額外上升速度
  if (bottomIsDown) {
    this.sprite.body.setVelocityY(this.sprite.body.velocity.y + 10);
  }
  // 蹬牆摩擦力
  if (
    ((this.sprite.body.touching.left && leftIsDown) ||
      (this.sprite.body.touching.right && rightIsDown)) &&
    !upIsDown
  ) {
    this.sprite.body.setVelocityY(this.sprite.body.velocity.y * 0.1);
  }
};
player.prototype.InvincibleTime = function () {
  if (!this.invincibleTime_) {
    this.sprite.setAlpha(0.2);
    this.sprite.setTint(0xff0000);
    this.head.setTint(0xff0000);
    this.head.setAlpha(0.2);
    this.invincibleTime_ = this.game.time.addEvent({
      delay: 3000 / 12, // 每次執行間隔時間（毫秒）
      callback: () => {
        if (this.invincibleTime_.getOverallProgress() == 1) {
          this.invincibleTime_.remove();
          this.invincibleTime_ = null;
          this.sprite.setTint(0xffffff);
          this.sprite.setAlpha(1);
          this.head.setTint(0xffffff);
          this.head.setAlpha(1);
        } else {
          if (this.invincibleTime_.getRepeatCount() % 2 == 1) {
            this.sprite.setAlpha(0.2);
            this.sprite.setTint(0xff0000);
            this.head.setTint(0xff0000);
            this.head.setAlpha(0.2);
          } else {
            this.sprite.setAlpha(1);
            this.sprite.setTint(0xffffff);
            this.head.setTint(0xffffff);
            this.head.setAlpha(1);
          }
        }
      },
      callbackScope: this,
      hasDispatched: false,
      loop: false,
      repeat: 12, // 執行次數（0表示無限次）
    });
  }
};
player.prototype.hurt = function (damage) {
  if (this.invincibleTime_ == null) {
    this.skick.play();
    this.health -= damage;
    this.InvincibleTime();
  }
};
export default player;
