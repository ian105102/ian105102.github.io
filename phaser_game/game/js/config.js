import main from "./Player.js";
import end from "./end.js";
import start from "./index.js";
import Pause from "./Pause.js";
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
    },
  },
  // scene: [start, main , end],
  scene: [start, main, end, Pause],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

let game = new Phaser.Game(config);
export default game;
