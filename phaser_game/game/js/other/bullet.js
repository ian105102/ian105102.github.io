let bullet = function (game, platforms) {
  this.game = game;
  this.platforms = platforms;

  this.bullets = this.game.physics.add.group();
  console.log("bullet_created");
};
bullet.prototype.fireBullet = function (start, target) {
  let sprite = this.bullets.create(start.x, start.y, "bullet");
  sprite.body.setSize(5, 5);
  let deltaX =
    target.x - 400 - (start.x - this.game.cameras.main.worldView.centerX);
  let deltaY =
    target.y - 300 - (start.y - this.game.cameras.main.worldView.centerY);
  let length = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  let velocity = new Phaser.Math.Vector2(
    1500 * (deltaX / length),
    1500 * (deltaY / length)
  )
    .normalize()
    .scale(1000);
  if (velocity.x !== 0 || velocity.y !== 0) {
    let angleInRadians = Math.atan2(velocity.y, velocity.x);
    sprite.setRotation(angleInRadians);
  }
  start.x -= velocity.x / 50;
  start.y -= velocity.y / 50;
  sprite.setVelocity(velocity.x, velocity.y);
  sprite.setImmovable(true);
};
export default bullet;
