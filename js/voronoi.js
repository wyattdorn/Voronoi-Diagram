//Written by Wyatt Dorn


//The width and height of the canvas used in the game
const canvasWidth = 800;
const canvasHeight = 800;

//The number of seeds/cells in the diagram
let numSeeds = 35;

//Size of each "pixel" in each cell
let pixelSize = 10;

//Default values for drawint eh seed locations to the canvas
let seedSize = 5;
let seedColor = "black";

//Height of UI region
let uiHeight = 100;

//The (x,y) coordinates of each seed, and the color of their associated cell
let seedLocations = [];
let seedColors = [];

//List of buttons and their values
let buttonList = [];

//Variables for the canvas and canvas context used in game
let canvas, ctx;

function init(){

  canvas = document.getElementById('canvas');
  canvas.style.left = "0px";
  canvas.style.top = "0px";
  canvas.style.position = "absolute";
  canvas.height = canvasHeight + uiHeight;
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

//////////////////////////////////////////////////////////////////////////////
//  Draw the UI to the screen
//////////////////////////////////////////////////////////////////////////////
function drawUI(){

  ctx.save();

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

  //Itterate through each button, drawing them to screen
  for(let x = 0; x < buttonList.length; x++){

    ctx.fillStyle = "black";
    ctx.fillRect(buttonList[x].xPos, buttonList[x].yPos, buttonList[x].width, buttonList[x].height);

    ctx.fillStyle = "#aaa";
    ctx.font = buttonList[x].fontSize + "px Courier";
    ctx.fillText(buttonList[x].text, buttonList[x].xPos + 8, buttonList[x].yPos + (0.9 * buttonList[x].fontSize));

  }

  ctx.restore();

}//end drawUI()

//////////////////////////////////////////////////////////////////////////////
//  Generate and return a random location within the canvas
//////////////////////////////////////////////////////////////////////////////
function generateSeedLocation(){
  return [Math.floor(Math.random() * canvasWidth), Math.floor(Math.random() * canvasHeight)];
}//end generateSeedLocation()

//////////////////////////////////////////////////////////////////////////////
//  Generate and return a random rgb color value
//////////////////////////////////////////////////////////////////////////////
function generateSeedColor(){
  return "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
}//end generateSeedColor()


//////////////////////////////////////////////////////////////////////////////
//  Generate the list of seeds and colors for each associated cell
//////////////////////////////////////////////////////////////////////////////
function generateSeeds(){

  for(let x = 0; x < numSeeds; x++){
    seedLocations.push(generateSeedLocation());
    seedColors.push(generateSeedColor());
  }

}//generateSeeds()

//////////////////////////////////////////////////////////////////////////////
//  Itterate through each pixel (defined by pixelSize), and determine which seed
// is closest, then colors that pixel accordingly.
//////////////////////////////////////////////////////////////////////////////
function getClosestPoint(){

  ctx.save();

  //Itterarte through each "pixel" on the canvas
  for(let x = 0; x < canvasWidth/pixelSize; x++){
    for(let y = 0; y < canvasHeight/pixelSize; y++){

      //Set default values to chech against
      let minDistance = canvasWidth;
      let closestSeed = 0;

      // Itterate through each seed, determine the distance, and save whichever
      // seed is closest to the "pixel".
      for(let z = 0; z < numSeeds; z++){
        let distance = Math.sqrt( Math.pow((x * pixelSize + (pixelSize/2) - seedLocations[z][0]),2) + Math.pow((y * pixelSize + (pixelSize/2) - seedLocations[z][1]),2) );
        if(distance < minDistance){
          minDistance = distance;
          closestSeed = z;
        }
      }
      //Draw the "pixel" to the canvas according to the color of the closest seed
      ctx.fillStyle = seedColors[closestSeed];
      ctx.fillRect(x*pixelSize, y*pixelSize, pixelSize, pixelSize);
    }
  }
  ctx.restore();

}//end getClosestPoint()

//////////////////////////////////////////////////////////////////////////////
//  Draws the location of each seed to the screen
//////////////////////////////////////////////////////////////////////////////
function drawSeeds(){

  ctx.save();

  //Itterate through each seed, drawing a circle at the location of each
  for(let x = 0; x < numSeeds; x++){
    ctx.fillStyle = seedColor;
    ctx.beginPath();
    ctx.arc(seedLocations[x][0], seedLocations[x][1], seedSize, 0, 2 * Math.PI);
    ctx.fill();
  }

  ctx.restore();

}//end drawSeeds()

//////////////////////////////////////////////////////////////////////////////
//  Redraws the screen
//////////////////////////////////////////////////////////////////////////////
function update(){

  ctx.save();

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight + uiHeight);

  getClosestPoint();
  drawSeeds();
  drawUI();

  ctx.restore();

}//end update()

//////////////////////////////////////////////////////////////////////////////
//  Runs when the mouse is clicked on the canvas, checks for button hits
//////////////////////////////////////////////////////////////////////////////
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
        clickPosition.y = e.clientY - 8;
    }

  //If the click wasn't in the UI area, exit function
  if(clickPosition.y < canvasHeight){ return;}

  //Itterate through each button and, if one was clicked, perfrom the associated function
  for(let x = 0; x < buttonList.length; x++){
    let btn = buttonList[x];
    if(clickPosition.x > btn.xPos && clickPosition.x < btn.xPos + btn.width && clickPosition.y > btn.yPos && clickPosition.y < btn.yPos + btn.height){
      console.log(btn.name);
      btn.function();
    }
  }

}//end logMouseDown()
