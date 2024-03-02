let bomb = function (game, platforms, player) {
  this.game = game;
  this.platforms = platforms;
  this.player = player;

  this.invincibleTime_ = null;
  this.maxhealth = 8;
  this.healthbarsize = 100+this.maxhealth*5;
  this.bombs = this.game.physics.add.group();
  console.log("bomb_created");
};
bomb.prototype.Update = function () {
  this.bombs.children.each((bomb) => {
    bomb.setGravity(0, 0);
    let angle = Phaser.Math.Angle.Between(
      bomb.body.x,
      bomb.body.y,
      this.player.body.x,
      this.player.body.y
    );
    let velocity = new Phaser.Math.Vector2();
    velocity.setToPolar(angle, 200); // 設置速度
    bomb.setVelocity(
      bomb.body.velocity.x + velocity.x / 40,
      bomb.body.velocity.y + velocity.y / 40
    );

    if (
      bomb.body.x < -2500 ||
      bomb.body.x > 2500 ||
      bomb.body.y < -2500 ||
      bomb.body.y > 2500
    ) {
      bomb.destroy();
      bomb.healthBar.destroy();
      bomb.healthBarBackground.destroy();
    }
  }, this);

  this.bombs.getChildren().forEach((bomb) => {
    bomb.healthBarBackground.x = bomb.body.x + (bomb.body.width / 2 -this.healthbarsize / 2);
    bomb.healthBarBackground.y = bomb.body.top - 20;
    bomb.healthBar.x = bomb.body.x + (bomb.body.width / 2 -this.healthbarsize / 2);
    bomb.healthBar.y = bomb.body.top - 20;

    bomb.healthBar.setSize(this.healthbarsize * (bomb.health / bomb.max_health), 10);
    if (bomb.health <= 0) {
      bomb.healthBar.destroy();
      bomb.healthBarBackground.destroy();
      bomb.destroy();
    }
  });
  this.BombsAngle();
};
bomb.prototype.BombsAngle = function () {
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
};
bomb.prototype.BombCreate = function () {
  let x =
    this.player.x < 400
      ? Phaser.Math.Between(400, 800)
      : Phaser.Math.Between(0, 400);
  let bomb = this.bombs.create(x, -350, "bomb").setScale(2, 2).refreshBody();
  bomb.health =  this.maxhealth; // 設置炸彈的生命值
  bomb.max_health =  this.maxhealth;
  bomb.healthBarBackground = this.game.add.rectangle(
    bomb.x + (bomb.body.width / 2 -this.healthbarsize / 2),
    bomb.y - 20,
    this.healthbarsize,
    10,
    0xff0000
  );
  bomb.healthBarBackground.setOrigin(0, 0.5);
  bomb.healthBar = this.game.add.rectangle(
    bomb.x + (bomb.body.width / 2 -this.healthbarsize / 2),
    bomb.y - 20,
    this.healthbarsize,
    10,
    0x00ff00
  );
  bomb.healthBar.setOrigin(0, 0.5);
  bomb.maxSpeed = 200;
  bomb.setBounce(0);
};

export default bomb;
