let blackhole = function (game, player) {
  this.zoom = 1;
  this.game = game;
  this.player = player;
  this.isAlive = false;
  this.sprite = this.game.physics.add
    .sprite(-550, 400, "blackhole")
    .setScale(3, 3)
    .refreshBody();
  this.sprite.setSize(10, 35);
  this.sprite.setOrigin(0.5, 0.5);

  this.blackOverlay = this.game.add.graphics();
  this.blackOverlay.fillStyle(0x000000, 1); // 黑色填充
  this.blackOverlay.fillRect(
    0,
    0,
    this.game.cameras.main.width,
    this.game.cameras.main.height
  );
  this.blackOverlay.setAlpha(0);

  console.log("blackhole_created");
};
blackhole.prototype.Update = function () {
  if (!this.isAlive) {
    this.sprite.disableBody(true, true);
    return;
  } else {
    this.sprite.body.enable = true;
    this.sprite.setVisible(true);
  }
  let cameraX = this.game.cameras.main.scrollX;
  let cameraY = this.game.cameras.main.scrollY;
  this.blackOverlay.setPosition(cameraX, cameraY);

  let distance = Phaser.Math.Distance.Between(
    this.player.sprite.body.x,
    this.player.sprite.body.y,
    this.sprite.body.x,
    this.sprite.body.y
  );

  if (distance < 300) {
    this.blackOverlay.alpha +=
      (1 / ((distance * distance) / 4000) - this.blackOverlay.alpha) / 10;

    this.zoom += (1 + 1500 / (distance * distance) - this.zoom) / 10;
    let angleToObject = Phaser.Math.Angle.Between(
      this.player.sprite.body.x,
      this.player.sprite.body.y,
      this.sprite.body.x,
      this.sprite.body.y
    );
    let speed = 50; // 玩家移動速度
    this.player.sprite.setVelocityX(
      this.player.sprite.body.velocity.x +
        (Math.cos(angleToObject) * speed) / (distance / 50)
    );
    this.player.sprite.setVelocityY(
      this.player.sprite.body.velocity.y +
        (Math.sin(angleToObject) * speed * 1.5) / (distance / 50)
    );
  } else {
    this.blackOverlay.alpha += (0 - this.blackOverlay.alpha) / 20;
    this.zoom += (1 - this.zoom) / 1000;
  }
  this.game.cameras.main.setZoom(this.zoom);
};
export default blackhole;
