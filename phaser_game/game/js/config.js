import fight from "./scene/fight.js";
import end from "./scene/end.js";
import start from "./scene/index.js";
import Pause from "./scene/pause.js";
import menu from "./scene/menu.js";
import mission from "./scene/mission.js";
import store from "./scene/store.js";
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug:false,
    },
  },
  scene: [start,store, menu ,fight, end, Pause,mission],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

let game = new Phaser.Game(config);
export default game;
