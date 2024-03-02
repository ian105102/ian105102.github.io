function create() {
  let background = this.add.rectangle(
    0,
    0,
    this.cameras.main.width,
    this.cameras.main.height,
    0x000000
  );
  background.setOrigin(0);
  background.setAlpha(0.7);
  let resumeButton = this.add.text(400, 300 - 30, "Resume", {
    fill: "#ffffff",
  });
  resumeButton.setOrigin(0.5);
  resumeButton.setInteractive();
  // 點擊按鈕時恢復場景並關閉暫停介面
  resumeButton.on(
    "pointerdown",
    function () {
      this.scene.resume(this.key);
      this.scene.stop();
    },
    this
  );
  this.input.keyboard.on(
    "keydown-ESC",
    function () {
      this.scene.resume(this.key);
      this.scene.stop();
    },
    this
  );
}
const Pause = {
  key: "Pause",
  init: function (data) {
    this.key = data.key;
  },
  preload: function () {},
  create: create,
  update: function () {},
};
export default Pause;
