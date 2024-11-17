let handPose;
let video;
let hands = [];
let brushPositions1 = [];
let brushPositions2 = [];
let isDrawing1 = false;
let isDrawing2 = false;
let wasTouching1 = false;
let wasTouching2 = false;
let circleDiameter = 60;
let brush2Spacing = 20; // 控制笔刷2的小方块间距
let brush2DrawSpacing = 10; // 控制笔刷2的绘制间距
let currentBrush1 = 'circle'; // 左手的笔刷类型
let currentBrush2 = 'circle'; // 右手的笔刷类型
let brushIconSize = 40; // 图标尺寸
let handAssigned = false; // 标记是否已分配左右手
let lastBrush2Position = null; // 保存上一次笔刷2的绘制位置

// 定义每个笔刷的状态
let brush1 = { strokeWeight: 40, size: 55 }; // 笔刷1
let brush2 = { strokeWeight: 1.5, size: 10 };  // 笔刷2
let brush3 = { strokeWeight: 3, size: 10 };  // 笔刷3，改为自定义图形
let brush4 = { strokeWeight: 1, size: 15 };  // 笔刷4
let brush5 = { strokeWeight: 2, size: 15 };  // 笔刷5，三角形
let brush6 = { strokeWeight: 2, size: 20 };  // 笔刷6，黄色圆形

let ccv=[]

let   lpic=[]
let bc=0
let zb
let zx
let zy
let   vb
function preload() {
  handPose = ml5.handPose();
  for(let i =0;i<27;i++){


    lpic[i]=loadImage("./images/"+i+".png")
  }
  for(let i =0;i<6;i++){


    ccv[i]=loadImage("./images/c"+(i+1)+".png")
  }
  
  zb=loadImage("./images/bt.png")
}

function setup() {
  createCanvas(1200, 820);

  zx=displayWidth
  zy=displayHeight
  video = createCapture(VIDEO);
  video.size(1200, 820);
  video.hide();
  handPose.detectStart(video, gotHands);
  // background(255)
}
function  saveSvg(){

  saveCanvas('030A.jpg');



  
}


function  changeBg(data){

vb=loadImage(data)

}
function draw() {


  if(sessionStorage.getItem('bg')=="white"){

    background(255)
  }


  else if(sessionStorage.getItem('bg')=="oirg"){

    push();
    translate(width, 0);
    scale(-1, 1);
  
  
  
    image(video, 0, 0, width, height);
    pop();
  }
  else{
 
    if(vb)image(vb, 0, 0, width, height);

  }


  drawBrushIcons();

  let fingerPositions = [];
  let drawIndicators = [];
  let keypointsToDisplay = [];

  if (!handAssigned && hands.length > 0) {
    assignHands();
  }

  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    let isRightHand = i === 0;
    let isDrawing = isRightHand ? isDrawing1 : isDrawing2;
    let brushPositions = isRightHand ? brushPositions1 : brushPositions2;
    let wasTouching = isRightHand ? wasTouching1 : wasTouching2;
    let currentBrush = isRightHand ? currentBrush1 : currentBrush2;

    if (hand.keypoints.length > 8) {
      let keypoint8 = hand.keypoints[8];
      let fingerX = width - keypoint8.x;
      let fingerY = keypoint8.y;
      let keypoint4 = hand.keypoints[4];
      let thumbX = width - keypoint4.x;
      let thumbY = keypoint4.y;

      fingerPositions.push({ x: fingerX, y: fingerY });
      drawIndicators.push({ isDrawing: isDrawing, brushType: currentBrush });

      if (isRightHand) {
        currentBrush1 = checkBrushSelection(fingerX, fingerY, currentBrush1);
      } else {
        currentBrush2 = checkBrushSelection(fingerX, fingerY, currentBrush2);
      }

      let dx = fingerX - thumbX;
      let dy = fingerY - thumbY;
      let distance = sqrt(dx * dx + dy * dy);
      let touchThreshold = 30;
      let touching = distance < touchThreshold;

      if (touching && !wasTouching) {
        if (isRightHand) {
          isDrawing1 = !isDrawing1;
          if (isDrawing1) brushPositions1.push({ isEnd: true });
        } else {
          isDrawing2 = !isDrawing2;
          if (isDrawing2) brushPositions2.push({ isEnd: true });
        }
      }

      if (isRightHand) wasTouching1 = touching;
      else wasTouching2 = touching;

      if ((isRightHand && isDrawing1) || (!isRightHand && isDrawing2)) {
        if (brushPositions.length === 0 || brushPositions[brushPositions.length - 1].isEnd) {
          brushPositions.push({ 
            x: fingerX, 
            y: fingerY, 
            brushType: currentBrush, 
            shapeType: randomShapeType(),
            size: random(10, 30)           
          });
        } else {
          let lastPos = brushPositions[brushPositions.length - 1];
          let dx = fingerX - lastPos.x;
          let dy = fingerY - lastPos.y;
          let distance = sqrt(dx * dx + dy * dy);
          let angle = atan2(dy, dx);
          let currentPos = { x: lastPos.x, y: lastPos.y, brushType: currentBrush, shapeType: randomShapeType(), size: random(10, 30) };

          while (distance >= circleDiameter) {
            currentPos.x += circleDiameter * cos(angle);
            currentPos.y += circleDiameter * sin(angle);
            brushPositions.push({ 
              x: currentPos.x, 
              y: currentPos.y, 
              brushType: currentBrush, 
              shapeType: randomShapeType(), 
              size: random(10, 30) 
            });
            dx = fingerX - currentPos.x;
            dy = fingerY - currentPos.y;
            distance = sqrt(dx * dx + dy * dy);
          }
        }
      } else {
        brushPositions.push({ x: fingerX, y: fingerY, isEnd: true });
      }
    }

    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      let x = width - keypoint.x;
      let y = keypoint.y;
      keypointsToDisplay.push({ x: x, y: y, label: isRightHand ? "R" : "L" });
    }
  }

  strokeWeight(50);
  noFill();

  stroke(0, 0, 255);
  drawBrushPath(brushPositions1);

  stroke(255, 0, 0);
  drawBrushPath(brushPositions2);

  for (let i = 0; i < fingerPositions.length; i++) {
    let pos = fingerPositions[i];
    let indicator = drawIndicators[i];
    drawBrushIndicator(pos.x, pos.y, indicator.isDrawing, indicator.brushType);
  }

  // 绘制手的关键点
  noStroke(); // 确保手的关键点没有边框
  drawKeypointLabels(keypointsToDisplay);
}

function assignHands() {
  hands.sort((a, b) => a.keypoints[0].x - b.keypoints[0].x);
  handAssigned = true;
}

function drawBrushIcons() {
 
  push()
  for(let i=0;i<6;i++){

    image(lpic[i==bc?i+12:i+6],15,15+i*0.05*zx,0.05*zx,0.05*zx)
  }
  



  pop()
}

function checkBrushSelection(fingerX, fingerY, currentBrush) {
  if (dist(fingerX, fingerY, 15+0.05*zx/2, 15+0*0.05*zx+0.05*zx/2) < 0.05*zx / 2) {
    return 'circle';
  }
  if (dist(fingerX, fingerY, 15+0.05*zx/2, 15+1*0.05*zx+0.05*zx/2) < 0.05*zx / 2) {
    return 'square';
  }
  if (dist(fingerX, fingerY, 15+0.05*zx/2, 15+2*0.05*zx+0.05*zx/2) < 0.05*zx / 2) {
    return 'star';
  }
  if (dist(fingerX, fingerY, 15+0.05*zx/2, 15+3*0.05*zx+0.05*zx/2) < 0.05*zx / 2) {
    return 'random';
  }
  if (dist(fingerX, fingerY, 15+0.05*zx/2, 15+4*0.05*zx+0.05*zx/2) < 0.05*zx / 2) {
    return 'rectangle';
  }
  if (dist(fingerX, fingerY, 15+0.05*zx/2, 15+5*0.05*zx+0.05*zx/2) < 0.05*zx / 2) {
    return 'face';
  }
  return currentBrush;
}

function drawBrushPath(brushPositions) {
  noFill();
  for (let pos of brushPositions) {
    if (!pos.isEnd) {
      noStroke();
      if (pos.brushType === 'circle') {
        strokeCap(ROUND)
        stroke(66, 0, 196);
        noFill();
        strokeWeight(brush1.strokeWeight);
        circle(pos.x, pos.y, circleDiameter);
        

      } else if (pos.brushType === 'square') {
        stroke(195, 64, 247);
        fill(21, 110, 42)
        strokeWeight(brush2.strokeWeight);

        if (!lastBrush2Position || dist(pos.x, pos.y, lastBrush2Position.x, lastBrush2Position.y) >= brush2DrawSpacing) {
          let offset = brush2Spacing / 0.8;
          rect(pos.x - offset, pos.y, brush2Spacing, brush2Spacing);
          rect(pos.x + offset, pos.y, brush2Spacing, brush2Spacing);

          lastBrush2Position = { x: pos.x, y: pos.y };
        }
      } else if (pos.brushType === 'star') {
        stroke(110, 62, 0)
        strokeWeight(3);
        noFill(0);
        drawCustomBrush3(pos.x, pos.y); // 使用自定义图形作为笔刷3
        
      } else if (pos.brushType === 'random') {
        stroke(0, 255, 0);
        strokeWeight(2);
        
        drawRandomShape(pos.x, pos.y, pos.shapeType);
      } else if (pos.brushType === 'rectangle') {
        stroke(0, 255, 255);
        strokeWeight(brush5.strokeWeight);
        drawRectangle(pos.x, pos.y);
      } else if (pos.brushType === 'face') {
        noStroke();
        drawFace(pos.x, pos.y);
      } else if (pos.brushType === 'yellowCircle') {
        stroke(255, 255, 0);
        strokeWeight(brush6.strokeWeight);
        circle(pos.x, pos.y, brush6.size);
      }
    }
  }
}

// 自定义图形作为笔刷3
function drawCustomBrush3(x, y) {
  let numDiamonds = 10;       // 菱形的数量
  let diamondWidth = 4;     // 菱形的宽度
  let diamondHeight = 46;    // 菱形的高度
  let angleOffset = TWO_PI / numDiamonds;  // 每个菱形旋转角度

  push();
  translate(x, y);
  for (let i = 0; i < numDiamonds; i++) {
    push();
    rotate(i * angleOffset);
    drawRoundedDiamond(0, -diamondHeight / 2, diamondWidth, diamondHeight);
    pop();
  }
  pop();
}

function drawRoundedDiamond(x, y, w, h) {
  beginShape();
  vertex(x, y + h / 2 - w / 2);
  bezierVertex(x, y + h / 2, x + w / 2, y + h / 2, x + w / 2, y + h / 2 - w / 2);
  vertex(x + w / 2, y - h / 2 + w / 2);
  bezierVertex(x + w / 2, y - h / 2, x, y - h / 2, x, y - h / 2 + w / 2);
  vertex(x - w / 2, y + h / 2 - w / 2);
  bezierVertex(x - w / 2, y + h / 2, x, y + h / 2, x, y + h / 2 - w / 2);
  endShape(CLOSE);
}

function randomShapeType() {
  return int(random(0, 5));
}

function drawRandomShape(x, y, shapeType) {
  noFill();
  let currentBrush;
  switch (shapeType) {
    case 0:
      currentBrush = brush2;
      stroke(43, 124, 255);
      break;
    case 1:
      currentBrush = brush2;
      stroke(250, 225, 0);
      break;
    case 2:
      currentBrush = brush2;
      stroke(43, 124, 255);
      break;
    case 3:
      currentBrush = brush2;
      stroke(0, 255, 0);
      break;
    case 4:
      currentBrush = brush2;
      stroke(250, 225, 0);
      break;
    default:
      console.error("Invalid shapeType:", shapeType);
      return;
  }

  strokeWeight(currentBrush.strokeWeight);
  let size = 120;

  switch (shapeType) {
    case 0:
      circle(x, y, size);
      break;
    case 1:
      rectMode(CENTER);
      rect(x, y, size, size);
      break;
    case 2:
      triangle(x, y - size / 2, x - size / 2, y + size / 2, x + size / 2, y + size / 2);
      break;
    case 3:
      rectMode(CENTER);
      rect(x, y, size, size / 2);
      break;
    case 4:
      ellipse(x, y, size, size / 2);
      break;
  }
}

function drawBrushIndicator(x, y, isDrawing, brushType) {


  push()
  imageMode (CENTER)
  // fill(200, isDrawing ? 255 : 127);
  tint(255,isDrawing ? 255 :120);
  noStroke();
  if (brushType === 'circle') {
    // circle(x, y, 20);
    image(ccv[0],x,y,60,60)
  } else if (brushType === 'square') {
    // rectMode(CENTER);
    // rect(x, y, 20, 20);
    image(ccv[1],x,y,60,18)
  } else if (brushType === 'star') {
    // drawCustomBrush3(x, y); // 显示自定义图形作为笔刷3的图标
    image(ccv[2],x,y,60,60)
  } else if (brushType === 'random') {
    // circle(x, y, 20);
    image(ccv[3],x,y,60,60)
  } else if (brushType === 'rectangle') {
    // drawRectangle(x, y);
    image(ccv[4],x,y,60,10)
  } else if (brushType === 'face') {
    // drawFace(x, y);
    image(ccv[5],x,y,60,60)
  }

  pop()
}

function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius1;
    let sy = y + sin(a) * radius1;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius2;
    sy = y + sin(a + halfAngle) * radius2;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function drawKeypointLabels(keypoints) {
  textAlign(CENTER, CENTER);
  textSize(14);
  fill(0);
  for (let kp of keypoints) {
    text(kp.label, kp.x, kp.y);
  }
}

function gotHands(results) {
  hands = results;
}

// 新增绘制三角形的函数
function drawTriangle(x, y, size) {
  noFill();
  triangle(x, y - size / 2, x - size / 2, y + size / 2, x + size / 2, y + size / 2);
}

// 笔刷5新增绘制长方形的函数
function drawRectangle(x, y) {
  fill(250, 129, 0);
  noStroke();
  rect(x, y, 100, 20); // 长方形位置和大小
  fill(0); // 黑色
  rect(x - 20, y, 4, 20); // 左侧黑线
  rect(x + 20, y, 4, 20); // 右侧黑线
}

// 笔刷6新增绘制脸部的函数
function drawFace(x, y) {
  // 画脸部背景
  fill(255, 255, 0);
  noStroke(); // 确保不使用边框
  ellipse(x, y, 100, 100); // 缩小脸部大小为100x100
  
  // 画眼睛
  fill(0);
  ellipse(x - 15, y - 20, 10, 10); // 左眼
  ellipse(x + 15, y - 20, 10, 10); // 右眼
  
  // 画嘴巴（标准半圆弧，方角末端）
  stroke(0); // 设置边框颜色
  strokeWeight(5); // 设置边框宽度
  strokeCap(PROJECT); // 设置方角末端
  noFill(); // 确保嘴巴没有填充
  arc(x, y, 80, 80, 0, PI); // 缩小嘴巴的大小和位置
}