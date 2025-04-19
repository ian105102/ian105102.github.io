





let p_test = new p5(function (p) {

    let testType = 0;

    let video;
    let normalButton = document.querySelector('#normalButton');
    let ConvexHullButton = document.querySelector('#ConvexHullButton');
    let jokerButton = document.querySelector('#jokerButton');
    p.setup = function(){
        let canvas = p.createCanvas(1080, 720);
        canvas.class('p5Canvas');
        p.colorMode(p.HSB);
        p.stroke(255);
        p.strokeWeight(3);
        
        normalButton.addEventListener('click', function() {
            testType = 0;
            console.log("normal");
        }
        );
        ConvexHullButton.addEventListener('click', function() {
            testType = 1;
            console.log("ConvexHull");
        }
        );
        jokerButton.addEventListener('click', function() {
            testType = 3;
            console.log("joker");
        }
        );
        
      
        video = p.createCapture(p.VIDEO);
        video.size(1280, 720);
        video.hide(); 
        camera = new Camera(video.elt, {     
            onFrame: async () => {
                await faceMesh.send({ image: video.elt });
             
            },
            width: 1280,
            height: 720
        });
        camera.start();

    }
    let gridSize = 5;
   
    p.draw = function(){
        p.image(video, 0, 0, p.width, p.height);

        if(testType == 0){
            p.faceMask_edge();
        }
        if(testType == 1){
            p.faceMask_();
        }
        if(testType == 3){
            p.faceMask_joker();
        }
   




    }
 
    p.faceMesh =function faceMesh(){
        p.beginShape(p.POINTS);
        
        for(let j=0; j<detections_face.multiFaceLandmarks[0].length; j++){
          let x = detections_face.multiFaceLandmarks[0][j].x * p.width;
          let y = detections_face.multiFaceLandmarks[0][j].y * p.height;
          p.vertex(x, y);
        }
        p.endShape();
    }   
  
    p.faceMask_joker = function () {
        p.noFill();
        p.stroke(255, 0, 0);
        p.strokeWeight(2);
        if(!detections_face.multiFaceLandmarks) return;
        let faceLandmarks = detections_face.multiFaceLandmarks[0];
        if (!faceLandmarks) return;
        
        let points = faceLandmarks.map(pt => ({ x: pt.x * p.width, y: pt.y * p.height }));
        
        let featureIndexes = {
            leftEye: [33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7],
            rightEye: [362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381, 382],
            mouth: [13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 88, 95, 78, 191, 80, 81, 82],
            lip: [50, 205, 206, 165, 167, 164, 393, 391, 426, 425, 280, 427, 432, 422, 424, 418, 421, 200, 201, 194, 204, 202, 212, 207, 50],
            eyeLeft: [226, 27, 243, 119],
            eyeRight: [463, 257, 446, 348]
        };
     
        let featurePoints = {};
        for (let key in featureIndexes) {
            featurePoints[key] = featureIndexes[key].map(index => points[index]);
        }
        
        let leftEye = points[33], rightEye = points[263], nose = points[1];
        let eyeDistance = Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y);
        let noseSize = eyeDistance * 0.5;
        
        let hull = convexHull(points);
        if (!hull.length) return;
        p.blendMode(p.ADD); // 設定混合模式
        p.fill("rgba(255, 255, 255, 0.27)");
        p.noStroke();
       
      
        p.beginShape();
        hull.forEach(pt => p.vertex(pt.x, pt.y));
        
        ["leftEye", "rightEye", "mouth"].forEach(key => {
            p.beginContour();
            featurePoints[key].slice().reverse().forEach(pt => p.vertex(pt.x, pt.y));
            p.endContour();
        });
        p.endShape(p.CLOSE);
        p.blendMode(p.MULTIPLY); // 設定混合模式
        p.fill("#FF0000");
        p.noStroke();
        p.beginShape();
        featurePoints.lip.forEach(pt => p.vertex(pt.x, pt.y));
        
        p.beginContour();
        featurePoints.mouth.slice().reverse().forEach(pt => p.vertex(pt.x, pt.y));
        p.endContour();
        p.endShape(p.CLOSE);
     
        ["eyeLeft", "eyeRight"].forEach(key => {
            p.fill("rgb(0, 169, 37)");
            p.noStroke();
            p.beginShape();
            featurePoints[key].forEach(pt => p.vertex(pt.x, pt.y));
            p.beginContour();
            featurePoints[key === "eyeLeft" ? "leftEye" : "rightEye"].slice().reverse().forEach(pt => p.vertex(pt.x, pt.y));
            p.endContour();
            p.endShape(p.CLOSE);
        });
        p.blendMode(p.BLEND);
        if (nose) {
            p.fill("#EA0000");
            p.noStroke();
            p.ellipse(nose.x, nose.y, noseSize, noseSize);
        }
    };
 
    
    p.faceMask_ = function () {
        if (!detections_face.multiFaceLandmarks) return;
        let faceLandmarks = detections_face.multiFaceLandmarks[0];
        if (!faceLandmarks) return;
    
        let img = p.createImage(p.width, p.height);
        img.copy(video, 0, 0, video.width, video.height, 0, 0, p.width, p.height);
    
        let maskLayer = p.createGraphics(p.width, p.height);
        maskLayer.fill(0, 200);
        maskLayer.rect(0, 0, p.width, p.height);
    
        let points = [];
        for (let i = 0; i < faceLandmarks.length; i++) {
            let x = faceLandmarks[i].x * p.width;
            let y = faceLandmarks[i].y * p.height;
            points.push({ x, y });
        }
    
        let hull = convexHull(points);
    
        // 遮罩處理
        maskLayer.erase();
        maskLayer.beginShape();
        for (let pt of hull) {
            maskLayer.vertex(pt.x, pt.y);
        }
        maskLayer.endShape(p.CLOSE);
        maskLayer.noErase();
    
        // 繪製紅色邊框
        maskLayer.stroke(255, 0, 0);       // 紅色
        maskLayer.strokeWeight(2);        // 線條寬度
        maskLayer.noFill();               // 不填色
        maskLayer.beginShape();
        for (let pt of hull) {
            maskLayer.vertex(pt.x, pt.y);
        }
        maskLayer.endShape(p.CLOSE);
    
        // 合併畫面
        p.image(img, 0, 0, p.width, p.height);
        p.image(maskLayer, 0, 0, p.width, p.height);
    };
    
    p.faceMask_edge = function () {
        if (!detections_face.multiFaceLandmarks) return;
        let faceLandmarks = detections_face.multiFaceLandmarks[0];
        if (!faceLandmarks) return;
    
        let img = p.createImage(p.width, p.height);
        img.copy(video, 0, 0, video.width, video.height, 0, 0, p.width, p.height);
    
        const FACE_OVAL_INDEXES = [
            10, 338, 297, 332, 284, 251, 389, 356, 454, 323,
            361, 288, 397, 365, 379, 378, 400, 377, 152, 148,
            176, 149, 150, 136, 172, 58, 132, 93, 234, 127,
            162, 21, 54, 103, 67, 109
        ];
    
        let edgeLayer = p.createGraphics(p.width, p.height);
    
        // 黑色全螢幕遮罩
        edgeLayer.fill(0, 200);
        edgeLayer.noStroke();
        edgeLayer.rect(0, 0, p.width, p.height);
    
        // 擷取輪廓點
        let points = FACE_OVAL_INDEXES.map(i => {
            let pt = faceLandmarks[i];
            return { x: pt.x * p.width, y: pt.y * p.height };
        });
        edgeLayer.erase();
        edgeLayer.beginShape();
        for (let pt of points) {
            edgeLayer.vertex(pt.x, pt.y);
        }
        edgeLayer.endShape(p.CLOSE);
        edgeLayer.noErase();
        edgeLayer.stroke(255, 0, 0); // 紅色
        edgeLayer.strokeWeight(2);
        edgeLayer.noFill();
        edgeLayer.beginShape();
        for (let pt of points) {
            edgeLayer.vertex(pt.x, pt.y);
        }
        edgeLayer.endShape(p.CLOSE);
        p.image(img, 0, 0, p.width, p.height);
        p.image(edgeLayer, 0, 0, p.width, p.height);
    };
    

});

