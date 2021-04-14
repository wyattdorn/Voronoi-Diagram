//Written by Wyatt Dorn


//The width and height of the canvas used in the game
const canvasWidth = 800;
const canvasHeight = 800;

let numSeeds = 35;

let pixelSize = 10;

let seedLocations = [];
let seedColors = [];

let buttonList = [];

//Variables for the canvas and canvas context used in game
let canvas, ctx;

function init(){

  canvas = document.getElementById('canvas');
  canvas.style.left = "0px";
  canvas.style.top = "0px";
  canvas.style.position = "absolute";
  canvas.height = canvasHeight + 100;
  canvas.width = canvasWidth;

  canvas.onmousedown = logMouseDown;

  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
  }
  else{
    return false;
  }

  generateButtons();

  generateSeeds();

  update();


}//end init()

//////////////////////////////////////////////////////////////////////////////
//  Define the values for all buttons used in this program
//////////////////////////////////////////////////////////////////////////////
function generateButtons(){

  buttonList.push( {
    name: "Decrease pixel size.",
    text: "-",
    fontSize: 40,
    xPos: 215,
    yPos: canvasHeight + 30,
    width: 40,
    height: 50,
    function: function a(){
      if(pixelSize==1){return;}
      pixelSize--;
      update();
    }
  });

  buttonList.push( {
    name: "Increase pixel size.",
    text: "+",
    fontSize: 40,
    xPos: 320,
    yPos: canvasHeight + 30,
    width: 40,
    height: 50,
    function: function a(){
      if(pixelSize==99){return;}
      pixelSize++;
      update();
    }
  });

  buttonList.push( {
    name: "Decrease number of seeds.",
    text: "-",
    fontSize: 40,
    xPos: 375,
    yPos: canvasHeight + 30,
    width: 40,
    height: 50,
    function: function a(){
      if(numSeeds==1){return;}
      numSeeds--;
      seedLocations.pop();
      seedColors.pop();
      update();
    }
  });

  buttonList.push( {
    name: "Increase number of seeds.",
    text: "+",
    fontSize: 40,
    xPos: 480,
    yPos: canvasHeight + 30,
    width: 40,
    height: 50,
    function: function a(){
      if(numSeeds==99){return;}
      numSeeds++;
      seedLocations.push(generateSeedLocation());
      seedColors.push(generateSeedColor());
      update();
    }
  });

  buttonList.push( {
    name: "Refresh.",
    text: "Refresh",
    fontSize: 40,
    xPos: 10,
    yPos: canvasHeight + 30,
    width: 190,
    height: 50,
    function: function a(){
      seedLocations = [];
      seedColors = [];
      generateSeeds();
      update();
    }
  });

  buttonList.push( {
    name: "New colors.",
    text: "New colors",
    fontSize: 40,
    xPos: 535,
    yPos: canvasHeight + 30,
    width: 255,
    height: 50,
    function: function a(){
      seedColors = [];
      generateSeeds();
      update();
    }
  });

}//end generateButtons();

function drawUI(){

  ctx.save();

  ctx.fillStyle = "white";
  ctx.fillRect(0, canvasHeight, canvasWidth, 100);

  ctx.fillStyle = "black"

  ctx.font = "20px Courier";
  ctx.fillText("Pixel size:",  218, canvasHeight + 22);
  ctx.fillText("# of cells:",  378, canvasHeight + 22);

  ctx.font = "50px Courier";
  let offset = 0;
  if(pixelSize.toString().length == 1){ offset = 15;}
  ctx.fillText(pixelSize, 255 + offset, canvasHeight + 70);
  offset = 0;
  if(numSeeds.toString().length == 1){ offset = 15;}
  ctx.fillText(numSeeds, 415 + offset, canvasHeight + 70);

  for(let x = 0; x < buttonList.length; x++){

    ctx.fillStyle = "black";
    ctx.fillRect(buttonList[x].xPos, buttonList[x].yPos, buttonList[x].width, buttonList[x].height);

    ctx.fillStyle = "#aaa";
    ctx.font = buttonList[x].fontSize + "px Courier";
    ctx.fillText(buttonList[x].text, buttonList[x].xPos + 8, buttonList[x].yPos + (0.9 * buttonList[x].fontSize));

  }

  ctx.restore();

}//end drawUI()


function generateSeedLocation(){
  return [Math.floor(Math.random() * canvasWidth), Math.floor(Math.random() * canvasHeight)];
}

function generateSeedColor(){
  return "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
}


function generateSeeds(){

  for(let x = 0; x < numSeeds; x++){
    seedLocations.push(generateSeedLocation());
    seedColors.push(generateSeedColor());
  }

}//generateSeeds()


function getClosestPoint(){

  ctx.save();

  for(let x = 0; x < canvasWidth/pixelSize; x++){
    for(let y = 0; y < canvasHeight/pixelSize; y++){

      let minDistance = canvasWidth;
      let closestSeed = 0;

      for(let z = 0; z < numSeeds; z++){
        let distance = Math.sqrt( Math.pow((x * pixelSize + (pixelSize/2) - seedLocations[z][0]),2) + Math.pow((y * pixelSize + (pixelSize/2) - seedLocations[z][1]),2) );
        if(distance < minDistance){
          minDistance = distance;
          closestSeed = z;
        }
      }

      ctx.fillStyle = seedColors[closestSeed];

      ctx.fillRect(x*pixelSize, y*pixelSize, pixelSize, pixelSize);


    }
  }

  ctx.restore();

}//end getClosestPoint()


function drawPoints(){

  ctx.save();

  for(let x = 0; x < numSeeds; x++){
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(seedLocations[x][0], seedLocations[x][1], 5, 0, 2 * Math.PI);
    ctx.fill();
  }

  ctx.restore();

}//end drawPoints()


function update(){

  ctx.save();

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  getClosestPoint();

  drawPoints();

  drawUI();

  ctx.restore();

}//end update()



///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function logMouseDown(e){
  var clickPosition = [];



  //get mouse location at time of click
  e = event || window.event;
  mouseXPos = e.mouseXPos;
  mouseYPos = e.mouseYPos;

  if (mouseXPos === undefined) {
          clickPosition.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - 8;
    }
  if (mouseYPos === undefined) {
        clickPosition.y = e.clientY - 8;// + document.body.scrollLeft + document.documentElement.scrollLeft;
    }

  if(clickPosition.y < canvasHeight){ return;}



  for(let x = 0; x < buttonList.length; x++){
    let btn = buttonList[x];
    if(clickPosition.x > btn.xPos && clickPosition.x < btn.xPos + btn.width && clickPosition.y > btn.yPos && clickPosition.y < btn.yPos + btn.height){
      console.log(btn.name);
      btn.function();
    }
  }


}//end logMouseDown()
