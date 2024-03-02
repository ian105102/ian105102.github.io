import missionset from "../mission/mission.js";
function create() {
  let background = this.add.rectangle(
    0,
    0,
    this.cameras.main.width,
    this.cameras.main.height,
    0x000000
  );
  let mission = this.add.text(400, 100 - 30, "Mission", {
    color: "#fff",
    fontFamily: "Tahoma",
    resolution: 2,
    fontSize: "50px",
  });
  mission.setOrigin(0.5);
  background.setOrigin(0);
  background.setAlpha(0.7);

  missionset.forEach((mission) => {
    let mission_string =
      mission.name +
      "  需要分數:" +
      mission.request +
      "  酬報:" +
      mission.reward;
    let missionText = this.add.text(
      400,
      150 + 80 * mission.id,
      mission_string,
      {
        color: "#fff",
        fontFamily: "Tahoma",
        resolution: 2,
        fontSize: "25px",
      }
    );
    missionText.setOrigin(0.5);
    missionText.setInteractive({ useHandCursor: true });
    missionText
      .on(
        "pointerdown",
        function () {
          this.scene.resume(this.key, { mission: mission, scene: "mission" });
          this.scene.stop();
        },
        this
      )
      .on("pointerover", () => {
        missionText.alpha = 0.5;
      })
      .on("pointerout", () => {
        missionText.alpha = 1;
      });
  });

  let resumeButton = this.add.text(400, 550 - 30, "back", {
    color: "#fff",
    fontFamily: "Tahoma",
    resolution: 2,
    fontSize: "30px",
  });
  resumeButton.setOrigin(0.5);
  resumeButton.setInteractive({ useHandCursor: true });
  resumeButton
    .on("pointerdown", () => {
      this.scene.resume(this.key);
      this.scene.stop();
    })
    .on("pointerover", () => {
      resumeButton.alpha = 0.5;
    })
    .on("pointerout", () => {
      resumeButton.alpha = 1;
    });

  this.input.keyboard.on(
    "keydown-ESC",
    function () {
      this.scene.resume(this.key);
      this.scene.stop();
    },
    this
  );
}
const mission = {
  key: "mission",
  init: function (data) {
    this.key = data.key;
  },
  preload: function () {},
  create: create,
  update: function () {},
};
export default mission;
