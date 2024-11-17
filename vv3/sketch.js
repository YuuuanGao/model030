// 引入 Matter.js 必要组件
const { Engine, World, Bodies, Constraint, Vector } = Matter;
let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let handPose;
let video;
let hands = [];
let points = [];
let font;
let engine;
let springs = []; // 存储每个点的位置和初始位置
let ballSize = 10; // 默认小球大小
let currentState = 1; // 新增状态变量，1为状态1，2为状态2

// 定义视频与画布的缩放因子
const scaleX = 1200 / 1920;
const scaleY = 820 / 1080;
let backgroundColor = null; // 背景颜色控制变量，初始为透明
let backgroundImage = null; // 背景图片控制变量，初始为无
let nk='A'
// 图标位置和大小
let iconPositions = [
  { x: 30, y: 200 }, // 保留第二个图标
  { x: 30, y: 300 }  // 保留第三个图标
];
let iconSize = 40; // 图标大小
let   lpic=[]
let bc=0
let zb
let zx
let zy
let   vb
function preload() {
  handPose = ml5.handPose();
  font = loadFont('Arial Bold.ttf'); 


  for(let i =0;i<4;i++){


    lpic[i]=loadImage("./images/"+i+".png")
  }
  
 
}

function setup() {
  createCanvas(1200, 820); // 调整画布大小到1200x820
  video = createCapture(VIDEO);
  video.size(1920, 1080); // 设置为摄像头的实际分辨率
  video.hide();
  zx=displayWidth
  zy=displayHeight

  let urlString = window.location.href;
  let url = new URL(urlString);
  params = new URLSearchParams(url.search);
  
  // 通过参数名获取参数值
  let paramValue = params.get('key');

 // console.log(zm[8])
  if(paramValue)nk= letters[parseInt(paramValue)]

  iconPositions = [
     // 保留第二个图标
    { x: 15, y: 15+1*0.05*zx },  // 保留第三个图标
    { x: 15, y: 15 }
  ];


  // 15,15+i*0.05*zx,0.05*zx,0.05*zx
   iconSize = 0.05*zx; // 图标大小
  video.elt.style.objectFit = 'cover';
  video.elt.style.width = '100%'; 
  video.elt.style.height = 'auto'; 
  video.elt.style.position = 'absolute';
  video.elt.style.top = '0';
  video.elt.style.left = '0';

  handPose.detectStart(video, gotHands);

  engine = Engine.create();

  // 调整字母 "A" 的大小参数
  updateAnchors(2); // 默认初始锚点数量

  // 创建背景切换按钮
  let colorButton = createButton('切换背景颜色');
  colorButton.position(width / 2 - 100, height - 40); // 按钮在画面底部左侧
  colorButton.mousePressed(toggleBackgroundColor); // 按钮点击事件

  // 创建上传背景图片按钮
  let uploadButton = createFileInput(handleFile);
  uploadButton.position(width / 2 + 20, height - 40); // 按钮在画面底部右侧
  uploadButton.attribute('accept', 'image/*'); // 限制上传文件为图片类型




  checkIconTouch(20, 20);
}

// 背景颜色切换函数
function toggleBackgroundColor() {
  backgroundColor = backgroundColor === null ? color(255) : null; // 切换背景为白色或透明
}

// 处理上传的文件
function handleFile(file) {
  if (file.type === 'image') {
    backgroundImage = loadImage(file.data, () => {
      console.log(file.data);
    });
  } else {
    console.log("请上传图片文件");
  }
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

  drawIcons(); // 绘制图标

  // 不镜像字母和关键点
  let keypoint8, keypoint4; // 声明关键点变量

  if (hands.length > 0) {
    let hand = hands[0];
    keypoint8 = hand.keypoints[8]; // 获取关键点8
    keypoint4 = hand.keypoints[4]; // 获取关键点4
  }

  push(); // 开始正常坐标系下的绘制

  // 状态1
  if (currentState === 1) {
    stroke(0); 
    strokeWeight(2); 
    fill(0);
    beginShape();
    for (let shape of springs) {
      for (let { pt, anchor } of shape) {
        if (pt) {
          if (!keypoint8 || dist(pt.x, pt.y, width - keypoint8.x * scaleX, keypoint8.y * scaleY) >= 15) {
            pt.x = lerp(pt.x, anchor.x, 0.05); 
            pt.y = lerp(pt.y, anchor.y, 0.05); 
          } else {
            pt.x = width - keypoint8.x * scaleX;
            pt.y = keypoint8.y * scaleY;
          }
          vertex(pt.x, pt.y);
        }
      }
    }
    endShape(CLOSE); 

    push()
    
    noFill();
    stroke(255, 0, 255); 
    strokeWeight(2); 
    const state1BallSize = 10; 
    for (let shape of springs) {
      for (let { pt } of shape) {
        if (pt) { 
          circle(pt.x, pt.y,10); 
        }
      }
    }

    noStroke()
  pop()
  
  }

  // 状态2
  else if (currentState === 2) {
   
    stroke(255, 0, 255); 
    strokeWeight(20);

    for (let shape of springs) {
      for (let i = 0; i < shape.length; i++) {
        let pt = shape[i].pt;
        let nextPt = shape[(i + 1) % shape.length].pt; 
        if (pt && nextPt) { 
          line(pt.x, pt.y, nextPt.x, nextPt.y);
        }
      }
    }

    noFill();
    stroke(0); 
    strokeWeight(3); 
    for (let shape of springs) {
      for (let { pt } of shape) {
        if (pt) { 
          circle(pt.x, pt.y, ballSize); 
        }
      }
    }
  }
  pop(); 


  push()
  // 绘制手部关键点的绿色小球（镜像关键点x坐标）
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(width - keypoint.x * scaleX, keypoint.y * scaleY, 10); 
    }
  }

  pop()

  // 在关键点4和8之间绘制线段
  if (keypoint4 && keypoint8) {
    stroke(139, 69, 19); 
    strokeWeight(5);
    let keypoint4X = width - keypoint4.x * scaleX;
    let keypoint8X = width - keypoint8.x * scaleX;
    let extendedLength = 100; 

    if (dist(keypoint4.x, keypoint4.y, keypoint8.x, keypoint8.y) < 30) {
      let angle8 = atan2(keypoint8.y - keypoint4.y, keypoint8X - keypoint4X) - radians(15);
      let angle4 = atan2(keypoint4.y - keypoint8.y, keypoint4X - keypoint8X) + radians(15);
      
      line(
        keypoint8X, 
        keypoint8.y * scaleY, 
        keypoint8X + cos(angle8) * extendedLength, 
        keypoint8.y * scaleY + sin(angle8) * extendedLength
      );
      line(
        keypoint4X, 
        keypoint4.y * scaleY, 
        keypoint4X + cos(angle4) * extendedLength, 
        keypoint4.y * scaleY + sin(angle4) * extendedLength
      );

     
    } else {
      line(
        keypoint8X - 50, 
        keypoint8.y * scaleY, 
        keypoint8X + 50, 
        keypoint8.y * scaleY
      ); 
      line(
        keypoint4X - 50, 
        keypoint4.y * scaleY, 
        keypoint4X + 50, 
        keypoint4.y * scaleY
      );

     
    }
  }

  // 检测关键点8是否触碰图标
  if (keypoint8) {
    checkIconTouch(width - keypoint8.x * scaleX, keypoint8.y * scaleY);
  }

  // 锚点跟随关键点8的逻辑
  if (keypoint4 && keypoint8 && dist(keypoint4.x, keypoint4.y, keypoint8.x, keypoint8.y) < 30) {
    for (let shape of springs) {
      for (let { pt, anchor } of shape) {
        if (pt && anchor) { 
          let d = dist(width - keypoint8.x * scaleX, keypoint8.y * scaleY, pt.x, pt.y);
          if (d < 15) {
            pt.x = lerp(pt.x, width - keypoint8.x * scaleX, 0.1);
            pt.y = lerp(pt.y, keypoint8.y * scaleY, 0.1);
          } else {
            pt.x = lerp(pt.x, anchor.x, 0.05);
            pt.y = lerp(pt.y, anchor.y, 0.05);
          }
        }
      }
    }
  }
}

// 其他辅助函数
function drawIcons() {
  push()
  for(let i=0;i<2;i++){

    image(lpic[i==bc?i+2:i],15,15+i*0.05*zx,0.05*zx,0.05*zx)
  }
  



  pop()

}

function checkIconTouch(x, y) {
  for (let i = 0; i < iconPositions.length; i++) {
    let icon = iconPositions[i];
    if (x > icon.x && x < icon.x + iconSize && y > icon.y && y < icon.y + iconSize) {
      bc=i==0?1:0
      updateAnchors(0.08 + 0.02 * i); 
      ballSize = 5 - (i * 5); 
      currentState = (i === 0) ? 2 : 1; 
      break;
    }
  }
}

function updateAnchors(sampleFactor) {
  springs = [];
  
  sampleFactor = max(sampleFactor, 0.05);

  let rawPoints = font.textToPoints(nk, width / 2 - 200-width*70/1920, height / 2 + 150, 600, {
    sampleFactor: sampleFactor,
    simplifyThreshold: 0
  });

  points = clusterPoints(rawPoints, 20);

  for (let shape of points) {
    let shapeSprings = [];
    for (let i = 0; i < shape.length; i++) {
      let pt = shape[i];
      let nextPt = shape[(i + 1) % shape.length];
      
      if (pt && nextPt) {
        shapeSprings.push({ pt: { x: pt.x, y: pt.y }, anchor: { x: pt.x, y: pt.y } });

        let distBetweenPoints = dist(pt.x, pt.y, nextPt.x, nextPt.y);
        if (distBetweenPoints > 50) { 
          let numExtraPoints = floor(distBetweenPoints / 10); 
          for (let j = 1; j <= numExtraPoints; j++) {
            let interpolatedX = lerp(pt.x, nextPt.x, j / (numExtraPoints + 1));
            let interpolatedY = lerp(pt.y, nextPt.y, j / (numExtraPoints + 1));
            shapeSprings.push({ pt: { x: interpolatedX, y: interpolatedY }, anchor: { x: interpolatedX, y: interpolatedY } });
          }
        }
      }
    }
    springs.push(shapeSprings);
  }
}
function  saveSvg(){

  saveCanvas('030C.jpg');

}
function clusterPoints(rawPoints, threshold) {
  let clusters = [];
  let currentCluster = [];

  for (let i = 0; i < rawPoints.length; i++) {
    let pt = rawPoints[i];
    if (pt && pt.x !== undefined && pt.y !== undefined) { 
      if (currentCluster.length === 0 || dist(pt.x, pt.y, currentCluster[currentCluster.length - 1].x, currentCluster[currentCluster.length - 1].y) <= threshold) {
        currentCluster.push(pt);
      } else {
        clusters.push(currentCluster);
        currentCluster = [pt];
      }
    }
  }

  if (currentCluster.length > 0) {
    clusters.push(currentCluster);
  }

  return clusters;
}

function gotHands(results) {
  hands = results;
}