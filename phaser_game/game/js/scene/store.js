function create() {
 
  let background = this.add.rectangle(
    800/2,
    600/2,
    this.cameras.main.width,
    this.cameras.main.height,
    0x000000
  );
  this.add
    .text(100, 50, "Store", {
      color: "#fff",
      fontFamily: "Tahoma",
      fontSize: 60,
      resolution: 2,
    })
    .setOrigin(0.5, 0.5);
  this.money_text = this.add
    .text(600, 50, "money: " + this.game.RoleInfo.money, {
      color: "#fff",
      fontFamily: "Tahoma",
      fontSize: 40,
      resolution: 2,
    })
    .setOrigin(0.5, 0.5);
  this.max_health_text = this.add
    .text(800 / 2, 250, "最大血量:" + this.game.RoleInfo.max_health, {
      color: "#fff",
      fontFamily: "Tahoma",
      fontSize: 40,
      resolution: 2,
    })
    .setOrigin(0.5, 0.5);

  this.upgrade = this.add
    .text(800 / 2, 350, "升級血量", {
      color: "#fff",
      fontFamily: "Tahoma",
      fontSize: 40,
      resolution: 2,
    })
    .setOrigin(0.5, 0.5)
    .setInteractive({ useHandCursor: true })
    .on("pointerup", () => {
      if (this.game.RoleInfo.money >= 100) {
        this.game.RoleInfo.money -= 100;
        this.game.RoleInfo.max_health += 1;
      }
    })
    .on("pointerover", () => {
      this.upgrade.alpha = 0.5;
    })
    .on("pointerout", () => {
      this.upgrade.alpha = 1;
    });

  this.restart = this.add
    .text(800 / 2, 500, "restart", {
      color: "#fff",
      fontFamily: "Tahoma",
      fontSize: 40,
      resolution: 2,
    })
    .setOrigin(0.5, 0.5)
    .setInteractive({ useHandCursor: true })
    .on(
      "pointerup",
      () => {
        this.scene.resume("menu",{scene:"store"});
        this.scene.stop();
      },
      this
    )
    .on("pointerover", () => {
      this.restart.alpha = 0.5;
    })
    .on("pointerout", () => {
      this.restart.alpha = 1;
    });
   
}
function update() {
  if (this.game.RoleInfo.money < 100) {
    this.upgrade.setColor("#ff0000");
  } else {
    this.upgrade.setColor("#ffffff");
  }
  this.money_text.text = "money: " + this.game.RoleInfo.money;
  this.max_health_text.text = "最大血量:" + this.game.RoleInfo.max_health;
}
const store = {
  key: "store",
  preload: function () {},
  create: create,
  update: update,
};
export default store;
