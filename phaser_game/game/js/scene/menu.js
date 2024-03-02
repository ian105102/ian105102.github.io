import player from "../other/player.js";
import blackhole from "../other/blackhole.js";
const menu = {
  key: "menu",
  preload: preload,
  create: create,
  update: update,
  score: 0,
};

function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("ground", "assets/platform.png");
  this.load.image("star", "assets/star.png");
  this.load.image("bomb", "assets/bomb.png");
  this.load.image("head", "assets/head.png");
  this.load.image("gun", "assets/gun.png");
  this.load.image("bullet", "assets/bullet.png");
  this.load.image("house", "assets/house.png");
  this.load.image("blackhole", "assets/blackhole.png");
  this.load.image("announcement", "assets/announcement.png");
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
}
function create() {
  this.pointer = this.input.mousePointer;
  this.pointer_point = {
    x: this.pointer.x,
    y: this.pointer.y,
    velocity_X: 0,
    velocity_Y: 0,
  };

  initializeBackground.call(this);
  initializePlatforms.call(this);
  this.house = this.physics.add
    .sprite(1100, 410, "house")
    .setScale(7, 7)
    .refreshBody();
  this.house.setSize(40, 40);
  this.house.body.setOffset(8, 10);
  this.announcement = this.physics.add
    .sprite(650, 550, "announcement")
    .setScale(1.5)
    .refreshBody();
  this.announcement.setInteractive({ useHandCursor: true });
  this.announcement.on("pointerdown", (pointer) => {
    if (pointer.leftButtonDown()) {
      this.scene.pause(this.scene.key);
      this.scene.run("mission", { key: "menu" });
    }
  });
  this.player = new player(this, this.platforms, this.game.RoleInfo);
  this.player.sprite.x = 917;
  this.player.sprite.y = 554;
  this.player.gun.x = 807;
  this.player.gun.y = 554;
  this.blackhole_fight = new blackhole(this, this.player);
  initializeInput.call(this);
  initializeEvent.call(this);
  initializeUIset.call(this);
  console.log("create_success");
}
function initializeInput() {
  this.invincibleTime_ = null;
  this.cursors = this.input.keyboard.createCursorKeys();
  this.input.keyboard.on("keydown-ESC", () => {
    this.scene.pause(this.scene.key);
    this.scene.run("Pause", { key: this.scene.key });
  });
}
function initializePlatforms() {
  this.platforms = this.physics.add.staticGroup();
  this.platforms.create(-550, 580, "ground").setScale(0.5, 5).refreshBody();
  this.platforms.create(-550, 590, "ground").setScale(0.6, 5).refreshBody();
  this.platforms.create(-550, 600, "ground").setScale(0.7, 5).refreshBody();
  this.platforms.create(-550, 610, "ground").setScale(0.8, 5).refreshBody();
  this.platforms.create(-550, 620, "ground").setScale(0.9, 5).refreshBody();
  this.platforms.create(-550, 630, "ground").setScale(1.0, 5).refreshBody();
  this.platforms.create(-550, 640, "ground").setScale(1.1, 5).refreshBody();
  this.platforms.create(-550, 650, "ground").setScale(1.2, 5).refreshBody();
  this.platforms.create(300, 600, "ground").setScale(5, 1).refreshBody();
}
function initializeBackground() {
  this.sky = this.add.image(400, 300, "sky");
  this.sky.setScrollFactor(0);
}
function initializeUIset() {
  this.moneyText = this.add
    .text(16, 16, "money: " + this.game.RoleInfo.money, {
      color: "#ff0",
      fontFamily: "Tahoma",
      fontSize: 40,
      resolution: 2,
    })
    .setScrollFactor(0);
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
}
function initializeEvent() {
  this.events.on("resume", (scene, data) => {
    if (!data) return;
    if (data.scene == "mission") {
      this.mission = data;
      this.blackhole_fight.isAlive = true;
    }
  });
  this.physics.add.collider(
    this.player.sprite,
    this.house,
    () => {
      this.scene.start("store");
    },
    null,
    this
  );
  this.physics.add.collider(
    this.player.sprite,
    this.blackhole_fight.sprite,
    () => {
      this.scene.start("fight", this.mission);
    },
    null,
    this
  );
  this.physics.add.collider(this.player.sprite, this.platforms);
  this.physics.add.overlap(
    this.player.bullet.bullets,
    this.platforms,
    (bullet, platform) => {
      bullet.destroy();
    },
    null,
    this
  );
}

function update() {
  this.blackhole_fight.Update();
  this.player.Update(this.platforms);
  CamerasMove.call(this);
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
}

export default menu;
