let   lpic=[]


let page=0;
let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let  Aclicked=-1
let gridSize;
let gap;
let mk=["A","B","C","D","C","D"]
let bc=0;
let letterBoxes = [];
let zb

let klm=["./vv1/index.html?", "./vv2/index.html?key=", "./vv3/index.html?key="]
let a
let b
let  c


// 设置session数据
sessionStorage.setItem('bg', 'oirg');

function preload(){

for(let i =0;i<27;i++){


  lpic[i]=loadImage("./images/"+i+".png")
}

zb=loadImage("./images/bt.png")
a=loadImage("./images/a.png")
b=loadImage("./images/b.png")
c=loadImage("./images/c.png")

}


function setup() {
  createCanvas(windowWidth,windowHeight)

  gridSize=width*39.5/1920
  gap=width*46.5/1920
  let index = 0;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 6; j++) {
    
      letterBoxes.push(new LetterBox(width*(1500/1920)+width*50/1920+width*49/1920*j,100+70+width*46.5/1920*i, letters[index],index));
      index++;
    }
  }
  let uploadButton = createFileInput(handleFile);
  uploadButton.position(1070 ,850); // 按钮在画面底部右侧
  
  uploadButton.size(40,40)
  // uploadButton = 0
  uploadButton.attribute('accept', 'image/*'); // 限制上传文件为图片类型
  let zk=["28A","28B","28C"]
  let newSrc = klm[page];
  document.getElementById(zk[page]).src = newSrc;
  document.getElementById(zk[page]).style.display = "block";
}

function draw() {
  background(240);
  textSize(38)
  fill (0)
  text ("Model 030 TouchCanvas",40,50)
  push()
  noStroke();
  
  
 if(page==0) image(a,width*0.781,height*0.084,0.18*width,0.18*width*1.99)
  if(page==1)image(b,width*0.781,height*0.084,0.18*width,0.18*width*2.41)
  if(page==2)image(c,width*0.781,height*0.084,0.18*width,0.18*width*2.41)
  pop()
  
  push()

  image(lpic[0==page?3:0],(50/1920)*width,80,0.119*width,0.119*width)
  image(lpic[1==page?4:1],(50/1920)*width,80+0.119*width+5,0.119*width,0.119*width)
  image(lpic[2==page?5:2],(50/1920)*width,80+0.119*width*2+10,0.119*width,0.119*width)

  pop()



 

if(page>0){

for(let i=0;i<3;i++){




  for(let j=0;j<6;j++){

    push()
    textAlign(CENTER,CENTER)
    fill(199)
     ellipse(width*(1500/1920)+width*50/1920+width*49/1920*j,100+70+width*46.5/1920*i,width*39.5/1920,width*39.5/1920)
     fill(0)
     textSize(20)
     text(mk[j],width*(1500/1920)+width*50/1920+width*49/1920*j, 100+70+width*45.5/1920*i)

   pop()
  }




}



for (let box of letterBoxes) {
  if(box.letter)box.display();

}

}

  // bottom10.745

  stroke(203,153,255)
  fill(204)
  rect(width*(300/1920),height*0.886,0.625*width+1,70)
  fill(244,84,77 ,100+100*sin (frameCount/5)  )
  stroke(210,210,255)
  ellipse(width*(300/1920)+50,height*0.886+65+50,30,30)



  push()


  pop()

  image(zb,width*(900/1920)-5,height*0.886,0.625*width*0.5,0.079*width*0.5)
  
}

// 处理上传的文件
function handleFile(file) {
  if (file.type === 'image') {
    backgroundImage = loadImage(file.data, () => {


      sessionStorage.setItem('bg', file.data);


       let zk=["28A","28B","28C"]
    document.getElementById(zk[page]).contentWindow.changeBg(file.data)
      // console.log(file.data);
    });
  } else {
    console.log("请上传图片文件");
  }
}
function mouseClicked(){

 
console.log(mouseX,mouseY)


  if(dist(mouseX,mouseY,1286 ,867)<50){
   //save
    let zk=["28A","28B","28C"]
    document.getElementById(zk[page]).contentWindow.saveSvg()
  
   }
  if(dist(mouseX,mouseY,1004 ,867)<9){
   //white
   sessionStorage.setItem('bg', 'white');
  
   }
  if(dist(mouseX,mouseY,1042 ,867)<9){
   //oirg
   sessionStorage.setItem('bg', 'oirg');
  
   }
  if(dist(mouseX,mouseY,1080 ,867)<9){
   //bgimage
   sessionStorage.setItem('bg', 'oirg');
  
   }
  if(dist(mouseX,mouseY,1172 ,867)<50){
   //clear
     let zk=["28A","28B","28C"]
    let newSrc = klm[page];
    document.getElementById(zk[page]).src = newSrc;
    document.getElementById(zk[1]).style.display = "none";
    document.getElementById(zk[2]).style.display = "none";
    document.getElementById(zk[0]).style.display = "none";
    document.getElementById(zk[page]).style.display = "block";
  
   }

  if(pointInRectangle(width*(900/1920)-5,height*0.8+90,0.625*width*0.5,0.0625*width*0.5)){
   //save

    // let zk=["28A","28B","28C"]
    // document.getElementById(zk[page]).contentWindow.saveSvg()

  //  clear

    // let zk=["28A","28B","28C"]
    // let newSrc = klm[page];
    // document.getElementById(zk[page]).src = newSrc;
    // document.getElementById(zk[1]).style.display = "none";
    // document.getElementById(zk[2]).style.display = "none";
    // document.getElementById(zk[0]).style.display = "none";
    // document.getElementById(zk[page]).style.display = "block";
   
  }
  if(pointInRectangle((50/1920)*width,80,0.119*width,0.119*width)){

    page=0;
    Aclicked=-1


    let zk=["28A","28B","28C"]
    let newSrc = klm[page];
    document.getElementById(zk[page]).src = newSrc;
    document.getElementById(zk[page]).style.display = "block";
    document.getElementById(zk[1]).style.display = "none";
    document.getElementById(zk[2]).style.display = "none";
    sessionStorage.setItem('bg', 'oirg');
  }
  if(pointInRectangle((50/1920)*width,80+0.119*width+5,0.119*width,0.119*width)){

    page=1;
    Aclicked=-1
    let zk=["28A","28B","28C"]
    let newSrc = klm[page];
    document.getElementById(zk[page]).src = newSrc;
    document.getElementById(zk[page]).style.display = "block";
    document.getElementById(zk[0]).style.display = "none";
    document.getElementById(zk[2]).style.display = "none";
    sessionStorage.setItem('bg', 'oirg');
  }
  if(pointInRectangle((50/1920)*width,80+0.119*width*2+10,0.119*width,0.119*width)){

    page=2;
    Aclicked=-1

    let zk=["28A","28B","28C"]
    let newSrc = klm[page];
    document.getElementById(zk[page]).src = newSrc;
    document.getElementById(zk[page]).style.display = "block";
    document.getElementById(zk[0]).style.display = "none";
    document.getElementById(zk[1]).style.display = "none";
    sessionStorage.setItem('bg', 'oirg');
  }
if(page>0){

  for (let box of letterBoxes) {
    box.checkClicked();
  }


}











}



function pointInRectangle(rx, ry, rw, rh) {
  if (mouseX >= rx && mouseX <= rx + rw && mouseY >= ry-0) {
    return true;
  } else {
    return false;
  }
}

class LetterBox {
  constructor(x, y, letter,index) {
    this.x = x;
    this.y = y;
    this.letter = letter;
    this.clicked = index;
  }

  display() {

    push()
    stroke(0);
   
    if (this.clicked==Aclicked) {
      fill(0);
      ellipse(this.x , this.y , gridSize, gridSize);
      fill(255);
    } else {
      fill(255);
      ellipse(this.x , this.y , gridSize, gridSize);
      fill(0);
    }
    textAlign(CENTER, CENTER);
    textSize(20);
    noStroke()
    text(this.letter, this.x, this.y);
    pop ()
  }

  checkClicked() {
    if (dist (mouseX,mouseY,this.x , this.y)<gridSize/2) {
          Aclicked= this.clicked 


          let newSrc = klm[page]+this.clicked;
          let zk=["28A","28B","28C"]
      document.getElementById(zk[page]).src = newSrc;
      document.getElementById(zk[0]).style.display = "none";
      document.getElementById(zk[1]).style.display = "none";
      document.getElementById(zk[2]).style.display = "none";
      document.getElementById(zk[page]).style.display = "block";
    }
  }
}
