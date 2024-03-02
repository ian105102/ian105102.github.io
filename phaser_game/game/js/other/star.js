let star = function (game, platforms) {
  this.game = game;
  this.platforms = platforms;
  this.stars = this.game.physics.add.group();
  console.log("star_created");
};
star.prototype.CreateStar = function () {
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
        platform.body.top - 25,
        "star"
      );
    }
  });
  this.stars.children.iterate(function (child) {
    child.originalY = child.y;
  });
};
star.prototype.Update = function () {
  this.stars.children.iterate((child) => {
    let amplitude = 5; // 振幅，可以調整星星漂浮的幅度
    let speed = 0.005; // 速度，可以調整星星漂浮的速度

    child.y =
      child.originalY + Math.sin(this.game.time.now * speed) * amplitude;
  });
};
export default star;
