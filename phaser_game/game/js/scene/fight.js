import star from "../other/star.js";
import player from "../other/player.js";
import slime from "../enemy/slime.js";
import bomb from "../enemy/bomb.js";
import blackhole from "../other/blackhole.js";
const fight = {
  key: "fight",
  init: function (data) {
    this.mission = data.mission;
    this.map = this.mission.mapData;
  },
  preload: preload,
  create: create,
  update: update,
  score: 0,
};

function preload() {
  this.load.audio("damaged", "assets/audio/damaged.mp3");
  this.load.audio("coin", "assets/audio/coin.mp3");
  this.load.audio("kick", "assets/audio/kick.mp3");
  this.load.audio("bullletsound", "assets/audio/mini_bomb1.mp3");
  this.load.audio("blackhole", "assets/audio/atmosphere_noise1.mp3");
  this.load.audio("fightbgm", "assets/audio/fight_bgm.mp3");
  this.load.image("sky", "assets/sky.png");
  this.load.image("ground", "assets/platform.png");
  this.load.image("star", "assets/star.png");
  this.load.image("bomb", "assets/bomb.png");
  this.load.image("head", "assets/head.png");
  this.load.image("gun", "assets/gun.png");
  this.load.image("bullet", "assets/bullet.png");
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
}
function create() {


  this.sblackhole = this.sound.add("blackhole");
  this.sblackhole.loop = true;
  this.sblackhole.play();
  this.sblackhole.setVolume(0);

  this.bgm = this.sound.add("fightbgm");
  this.bgm.loop = true;
  this.bgm.setVolume(0.5);
  this.bgm.play();
  this.pointer = this.input.mousePointer;
  this.pointer_point = {
    x: this.pointer.x,
    y: this.pointer.y,
    velocity_X: 0,
    velocity_Y: 0,
  };
  fight.score = 0;
  initializeBackground.call(this);
  initializePlatforms.call(this);

  this.player = new player(this, this.platforms, this.game.RoleInfo);
  this.slime = new slime(this, this.platforms, this.player.sprite);
  this.star = new star(this, this.platforms);
  this.bomb = new bomb(this, this.platforms, this.player.sprite);
  this.blackhole_end = new blackhole(this, this.player);
  this.blackhole_end.sprite.setPosition(-2100, 490);

  this.scoin= this.game.sound.add("coin");
  this.scoin.setVolume(0.5);
  this.sdamaged = this.sound.add("damaged");
  this.sdamaged.setVolume(0.05);

  this.star.CreateStar();
  initializeInput.call(this);
  initializeUIset.call(this);
  initializeEvent.call(this);
  initializeMap.call(this);
  console.log("create_success");
}
function initializeInput() {
  this.invincibleTime_ = null;
  this.cursors = this.input.keyboard.createCursorKeys();

  this.input.keyboard.on("keydown-F", () => {
    this.slime.CreateSlime();
  });
  this.input.keyboard.on("keydown-G", () => {
    this.bomb.BombCreate();
  });
  this.input.keyboard.on("keydown-ESC", () => {
    this.scene.pause(this.scene.key);
    this.scene.run("Pause", { key: this.scene.key });
  });
}
function initializePlatforms() {
  this.platforms = this.physics.add.staticGroup();
  this.map.forEach((map) => {
    this.platforms
      .create(map.x, map.y, "ground")
      .setScale(map.scaleX, map.scaleY)
      .refreshBody();
  });
}
function initializeBackground() {
  this.sky = this.add.image(400, 300, "sky");
  this.sky.setScrollFactor(0);
}
function initializeMap() {
  this.miniMapCamera = this.cameras.add(525, 420, 270, 170).setZoom(0.16); // 在右下角添加一個100x75的鏡頭，並將其縮放為原來的十分之一
  this.miniMapCamera.setBackgroundColor(0xd2ebff);
  this.miniMapCamera.ignore(this.sky);
  this.miniMapCamera.ignore(this.player.gun);
  this.miniMapCamera.ignore(this.scoreText);
  this.miniMapCamera.ignore(this.liftText);
  this.miniMapCamera.ignore(this.healthBarBackground);
  this.miniMapCamera.ignore(this.healthBarBackground_);
  this.miniMapCamera.ignore(this.healthBar);
  this.miniMapCamera.ignore(this.blackhole_end.blackOverlay);
}
function initializeUIset() {
  // this.graphics = this.add.graphics();
  // let gameWidth = this.game.config.width * 2;
  // let gameHeight = this.game.config.height * 2;
  // let gridSize = 50; // 網格的單元大小
  // // 設置網格線的顏色和透明度
  // this.graphics.lineStyle(1, 0xffffff, 0.5);
  // // 繪製垂直線和添加數字
  // for (let x = -gameWidth; x <= gameWidth; x += gridSize) {
  //   this.graphics.beginPath();
  //   this.graphics.moveTo(x, -gameHeight);
  //   this.graphics.lineTo(x, gameHeight);
  //   this.graphics.closePath();
  //   this.graphics.strokePath();
  //   // 添加垂直線上的數字
  //   this.add.text(x + 5, 5, x.toString(), {
  //     fontSize: "10px",
  //     fill: "#ffffff",
  //   });
  // }
  // // 繪製水平線和添加數字
  // for (let y = -gameHeight; y <= gameHeight; y += gridSize) {
  //   this.graphics.beginPath();
  //   this.graphics.moveTo(-gameWidth, y);
  //   this.graphics.lineTo(gameWidth, y);
  //   this.graphics.closePath();
  //   this.graphics.strokePath();
  //   // 添加水平線上的數字
  //   this.add.text(5, y + 5, y.toString(), {
  //     fontSize: "10px",
  //     fill: "#ffffff",
  //   });
  // }

  this.scoreText = this.add.text(16, 16, "Score: 0", {
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
    .rectangle(
      175,
      555,
      50 + this.player.RoleInfo.max_health * 5 + 10,
      35,
      0x000000
    )
    .setOrigin(0, 0.5)
    .setScrollFactor(0);
  this.healthBarBackground_ = this.add
    .rectangle(180, 555, 50 + this.player.RoleInfo.max_health * 5, 25, 0xff0000)
    .setOrigin(0, 0.5)
    .setScrollFactor(0);
  this.healthBar = this.add
    .rectangle(180, 555, 50 + this.player.RoleInfo.max_health * 5, 25, 0x00ff00)
    .setOrigin(0, 0.5)
    .setScrollFactor(0);
  this.scoreText.setScrollFactor(0);
  this.liftText.setScrollFactor(0);
}
function initializeEvent() {
  this.physics.add.collider(
    this.player.sprite,
    this.blackhole_end.sprite,
    () => {
      this.bgm.stop();
      this.sblackhole.stop();
      this.scene.start("end", { pass: true, reward: this.mission.reward });
    },
    null,
    this
  );
  this.physics.add.collider(this.slime.slimes, this.platforms);
  this.physics.add.collider(this.player.sprite, this.platforms);
  this.physics.add.collider(this.bomb.bombs, this.platforms);
  this.physics.add.collider(
    this.bomb.bombs,
    this.player.bullet.bullets,
    (bomb, bullet) => {
      this.sdamaged.play();
      bomb.health--;
      bullet.destroy();
    },
    null,
    this
  );
  this.physics.add.collider(
    this.player.sprite,
    this.bomb.bombs,
    (player, bomb) => {
      this.player.hurt(1);
    },
    null,
    this
  );
  this.physics.add.collider(this.star.stars, this.platforms);
  this.physics.add.overlap(
    this.player.sprite,
    this.star.stars,
    StarCollect,
    null,
    this
  );
  this.physics.add.overlap(
    this.player.bullet.bullets,
    this.platforms,
    (bullet, platform) => {
      bullet.destroy();
    },
    null,
    this
  );
  this.physics.add.overlap(
    this.slime.slimes,
    this.player.bullet.bullets,
    (slime, bullet) => {
      this.sdamaged.play();
      slime.health--;
      slime.angry = true;
      bullet.destroy();
    },
    null,
    this
  );
  this.physics.add.collider(
    this.player.sprite,
    this.slime.slimes,
    (slime, player) => {
      const relativeX = slime.body.x - player.body.x;
      const relativeY = slime.body.y - player.body.y;
      const length = Math.sqrt(relativeX * relativeX + relativeY * relativeY);
      console.log(relativeX / length + "  " + relativeY / length);
      this.player.sprite.setVelocityX((relativeX / length) * 500);
      this.player.sprite.setVelocityY((relativeY / length) * 500);
      this.player.hurt(1);
    },
    null,
    this
  );
  this.physics.add.collider(this.slime.slimes, this.slime.slimes);
}
function StarCollect(player, star) {
  this.scoin.play();
  star.disableBody(true, true);
  fight.score += 10;
  this.scoreText.setText("Score: " + fight.score);
  this.slime.CreateSlime();
  if (this.star.stars.countActive(true) === 0) {
    this.star.CreateStar();
    this.bomb.BombCreate();
  }
}
function update() {
  let distance = Phaser.Math.Distance.Between(
    this.blackhole_end.sprite.body.x,
    this.blackhole_end.sprite.body.y,
    this.player.sprite.body.x,
    this.player.sprite.body.y
  );
  
  if (this.blackhole_end.isAlive) {
    this.sblackhole.setVolume(1 /( distance/ 150) );
  } else {
    this.sblackhole.setVolume(0);
  }

  if (fight.score >= this.mission.request) {
    this.blackhole_end.isAlive = true;
  }
  this.blackhole_end.Update();
  this.bomb.Update();
  this.slime.Update();
  this.star.Update();
  this.player.Update(this.platforms);
  CamerasMove.call(this);
  UpdatePlayerHealthBar.call(this);
}
function UpdatePlayerHealthBar() {
  this.healthBar.setSize(
    (50 + this.player.RoleInfo.max_health * 5) *
      (this.player.health / this.player.RoleInfo.max_health),
    25
  );
  GmaeEnd.call(this);
}
function CamerasMove() {
  this.cameras.main.scrollY = this.player.sprite.body.y - 300;
  this.cameras.main.scrollX = this.player.sprite.body.x - 400;
  this.pointer_point.velocity_X =
    (this.pointer.x - this.pointer_point.x) / 20.0;
  this.pointer_point.velocity_Y =
    (this.pointer.y - this.pointer_point.y) / 20.0;

  this.pointer_point.x += this.pointer_point.velocity_X;
  this.pointer_point.y += this.pointer_point.velocity_Y;

  this.cameras.main.scrollX = Math.floor(
    this.player.sprite.body.x - 400.0 + (this.pointer_point.x - 400.0) / 2
  );
  this.cameras.main.scrollY = Math.floor(
    this.player.sprite.body.y - 300.0 + (this.pointer_point.y - 300.0) / 2
  );

  this.miniMapCamera.scrollX =
    this.player.sprite.body.x - this.miniMapCamera.width / 2;
  this.miniMapCamera.scrollY =
    this.player.sprite.body.y - this.miniMapCamera.height / 2;
}
function GmaeEnd() {
  if (this.player.health <= 0) {
    this.sblackhole.stop();
    this.bgm.stop();
    this.scene.start("end", { pass: false, reward: this.mission.reward });
    this.delayedhitBomb_ = null;
    this.delayedJump_ = null;
    this.sprint_ = null;
  }
}
export default fight;
