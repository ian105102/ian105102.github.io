let slime = function (game, platforms, player) {
  this.game = game;
  this.platforms = platforms;
  this.player = player;
  this.maxhealth = 2;

  this.healthbarsize = 5 + this.maxhealth * 5;
  this.slimes = this.game.physics.add.group();
  console.log("slime_created");
};
slime.prototype.Update = function () {
  this.slimes.getChildren().forEach((slime) => {

    slime.healthBarBackground.x =
      slime.body.x + (slime.body.width / 2 - this.healthbarsize / 2);
    slime.healthBarBackground.y = slime.body.top - 20;
    slime.healthBar.x =
      slime.body.x + (slime.body.width / 2 - this.healthbarsize / 2);
    slime.healthBar.y = slime.body.top - 20;

    slime.healthBar.setSize(
      this.healthbarsize * (slime.health / slime.maxhealth),5
    );
    if (slime.health <= 0) {
      slime.healthBar.destroy();
      slime.healthBarBackground.destroy();
      slime.destroy();
    }
  });

  this.slimes.children.each((slime) => {

    let platform_t = null;
    this.platforms.children.each((p) => {
      if (
        slime.body.bottom === p.body.top &&
        slime.body.right >= p.body.left &&
        slime.body.left <= p.body.right
      ) {
        platform_t = p;
      }
    });
    if (platform_t !== null) {
      if (
        slime.body.right >= platform_t.body.right ||
        slime.body.touching.right
      ) {
        slime.direction = -1;
      } else if (
        slime.body.left <= platform_t.body.left ||
        slime.body.touching.left
      ) {
        slime.direction = 1;
      }
    }
    if (slime.body.velocity.x < 0) {
      slime.setFlipX(true); // 左右翻轉
    } else if (slime.body.velocity.x > 0) {
      slime.setFlipX(false);
    }

    let check = false;
    let currentTime = this.game.time.now;
    let deltaTime = currentTime - slime.lastTime;

    if (
      Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        slime.x,
        slime.y
      ) < 700 &&
      deltaTime >= 200
    ) {
      this.slimes.getChildren().forEach((otherslime) => {
        if (
          Phaser.Math.Distance.Between(
            slime.body.x,
            slime.body.y,
            otherslime.body.x,
            otherslime.body.y
          ) < 150 &&
          otherslime != slime
        ) {
          if (otherslime.angry) {
            slime.angry = true;
          }
        }
      });
      slime.lastTime = currentTime;
      check = checkObstacleBetweenObjects.call(
        this,
        slime,
        this.player,
        this.platforms
      );
      if (slime.angry) {
        if (
          check == true ||
          Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            slime.x,
            slime.y
          ) > 600
        ) {
          slime.angry = false;
        }
      } else if (
        Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          slime.x,
          slime.y
        ) < 500
      ) {
        if (
          (this.player.x > slime.x && slime.direction == 1) ||
          (this.player.x < slime.x && slime.direction == -1)
        ) {
          slime.angry = true;
        }
        if (
          Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            slime.x,
            slime.y
          ) < 150
        ) {
          slime.angry = true;
        }
        if (check == true) {
          slime.angry = false;
        }
      }
    }

    if (slime.angry && slime.body.touching.down) {
      if (this.player.body.bottom < slime.body.bottom - 80) {
        slime.setVelocityY(-550);
      }
    }
    if (
      platform_t !== null &&
      (slime.body.right > platform_t.body.right ||
        slime.body.left < platform_t.body.left) &&
      slime.angry &&
      slime.body.touching.down
    ) {
      if (this.player.body.bottom <= slime.body.bottom) {
        slime.setVelocityY(-550);
      }
    }

    if (slime.angry) {
      slime.setTint(0xff0000);
      if (slime.body.x < this.player.x) {
        slime.direction = 1;
        slime.setVelocityX(
          slime.speed * 5.2 + (this.player.body.x - slime.body.x) / 2
        );
      } else {
        slime.direction = -1;
        slime.setVelocityX(
          -slime.speed * 5.2 + (this.player.body.x - slime.body.x) / 2
        );
      }
    } else {
      slime.clearTint();
      slime.setVelocityX(slime.speed * slime.direction);
    }
  });
};
slime.prototype.CreateSlime = function () {
  if (this.slimes.getLength() > 20) {
    return;
  }
  let platform;
  do {
    platform =
      this.platforms.getChildren()[
        Phaser.Math.Between(0, this.platforms.getChildren().length - 1)
      ];
  } while (
    platform.body.top - 100 < this.player.body.top &&
    platform.body.top >= this.player.body.top &&
    platform.body.left - 400 < this.player.body.left &&
    platform.body.right + 400 > this.player.body.right
  );

  let slime = this.slimes.create(
    Phaser.Math.Between(platform.body.left, platform.body.right),
    platform.y - platform.displayHeight / 2 - 50 / 2,
    "head"
  );

  slime.setOrigin(0.5, 0.5);
  slime.setGravityY(1300);
  slime.speed = 50;
  slime.angry = false;
  slime.lastTime = 0;
  slime.direction = 1;

  slime.health = this.maxhealth;
  slime.maxhealth = this.maxhealth;
  slime.healthBarBackground = this.game.add.rectangle(
    slime.body.x + (slime.body.width / 2 - this.healthbarsize / 2),
    slime.body.y - 20,
    this.healthbarsize,
    5,
    0xff0000
  );
  slime.healthBarBackground.setOrigin(0, 0.5);
  slime.healthBar = this.game.add.rectangle(
    slime.body.x + (slime.body.width / 2 - this.healthbarsize / 2),
    slime.body.y - 20,
    this.healthbarsize,
    5,
    0x00ff00
  );
  slime.healthBar.setOrigin(0, 0.5);
  slime.setBounce(0);
};

export default slime;
function checkObstacleBetweenObjects(object1, object2, obstacles) {
  // 發射一條射線，從 object1 到 object2
  let ray = new Phaser.Geom.Line(
    object1.body.x + object1.body.width / 2,
    object1.body.y + object1.body.height / 2,
    object2.body.x + object2.body.width / 2,
    object2.body.y + object2.body.height / 2
  );
  let intersection = false;
  obstacles.getChildren().forEach((obstacle) => {
    if (Phaser.Geom.Intersects.LineToRectangle(ray, obstacle.getBounds())) {
      intersection = true;
    }
  });
  return intersection;
}
