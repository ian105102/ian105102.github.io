
const faceMesh = new FaceMesh({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
}});
let detections_face = [];
faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
function gotFaces(results) {
  detections_face = results;
  // console.log(detections_face);
}
faceMesh.onResults(gotFaces);






const pose = new Pose({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
}});

let detections_pose = [];
pose.setOptions({
  modelComplexity: 0,  // 0: 快速模式 (適用於檢測局部)
  smoothLandmarks: true,
  enableSegmentation: false,  // 不啟用分割 (更快)
  smoothSegmentation: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
function gotPose(results) {
  detections_pose = results.poseLandmarks;;
  console.log(results);
}
pose.onResults(gotPose);

