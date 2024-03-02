import main from "./fight.js";
function create() {
  let title = "";
  let reward_text = "";
  if (this.pass) {
    title = "MISSION PASSED";
    reward_text = `你獲得了: ${this.reward}`;
    this.game.RoleInfo.money += this.reward;
  } else {
    title = "MISSION FAILED";
    reward_text = `你沒有獲得任何獎勵`;
  }
  const gameover = this.add
    .text(800 / 2, 100, title, {
      color: "#ff0",
      fontFamily: "Tahoma",
      fontSize: 45,
      resolution: 2,
    })
    .setOrigin(0.5, 0.5);

  this.restart = this.add
    .text(800 / 2, 400, "restart", {
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
        this.scene.start("menu");
      },
      this
    )
    .on("pointerover", () => {
      this.restart.alpha = 0.5;
    })
    .on("pointerout", () => {
      this.restart.alpha = 1;
    });
  this.add
    .text(800 / 2, 200, `SCORE: ${main.score}`, {
      color: "#fff",
      fontFamily: "Tahoma",
      fontSize: 40,
      resolution: 2,
    })
    .setOrigin(0.5, 0.5);
  this.add
    .text(800 / 2, 300, reward_text, {
      color: "#fff",
      fontFamily: "Tahoma",
      fontSize: 40,
      resolution: 2,
    })
    .setOrigin(0.5, 0.5);
  this.tweens.add({
    targets: gameover,
    y: { from: 0, to: 100 },
    ease: "Bounce.easeOut",
    duration: 1000,
    repeat: 0,
    yoyo: false,
  });
}
const end = {
  key: "end",
  init: function (data) {
    this.reward = data.reward;
    this.pass = data.pass;
  },
  preload: function () {},
  create: create,
  update: function () {},
};
export default end;
