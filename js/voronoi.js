// Written by: Wyatt Dorn
// 4/14/21


//The width and height of the canvas used in the game
const canvasWidth = 800;
const canvasHeight = 800;

//The number of seeds/cells in the diagram
let numSeeds = 35;

//Size of each "pixel" in each cell
let pixelSize = 10;

let pixelList = [];

let showBorders = false;

//Default values for drawint eh seed locations to the canvas
let seedSize = 5;
let seedColor = "black";

//Height of bottom UI region
let uiHeight = 100;

//Width of UI sidebar region
let sidebarWidth = 100;

let colorPallette = null;

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
  canvas.width = canvasWidth + sidebarWidth;

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
//  Draw the UI to the screen
//////////////////////////////////////////////////////////////////////////////
function drawUI(){

  ctx.save();

  ctx.fillStyle = "#888"
  ctx.fillRect(canvasWidth, 0, sidebarWidth, canvasHeight);

  ctx.fillStyle = "black"
  ctx.font = "20px Courier";
  ctx.fillText("Pixel size:",  218, canvasHeight + 22);
  ctx.fillText("# of cells:",  378, canvasHeight + 22);
  ctx.fillText("Borders:",  805, 535);
  ctx.fillText("Seeds:",  815, 670);

  ctx.font = "50px Courier";
  let offset = 0;
  if(pixelSize.toString().length == 1){ offset = 15;}
  ctx.fillText(pixelSize, 255 + offset, canvasHeight + 70);
  offset = 0;
  if(numSeeds.toString().length == 1){ offset = 15;}
  ctx.fillText(numSeeds, 415 + offset, canvasHeight + 70);

  //Itterate through each button, drawing them to screen
  for(let x = 0; x < buttonList.length; x++){

    ctx.fillStyle = buttonList[x].buttonColor;
    ctx.fillRect(buttonList[x].xPos, buttonList[x].yPos, buttonList[x].width, buttonList[x].height);

    ctx.fillStyle = buttonList[x].fontColor;
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
  if(colorPallette == null){
    return "rgb(" + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + "," + Math.floor(Math.random() * 255) + ")";
  }
  return "rgb(" + (Math.floor(Math.random() * 205 + 50) * colorPallette[0]) + "," + (Math.floor(Math.random() * 205 + 50) * colorPallette[1]) + "," + (Math.floor(Math.random() * 205 + 50) * colorPallette[2]) + ")";
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
    pixelList[x] = [];
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

      pixelList[x][y] = closestSeed;

      //Draw the "pixel" to the canvas according to the color of the closest seed
      ctx.fillStyle = seedColors[closestSeed];
      ctx.fillRect(x*pixelSize, y*pixelSize, pixelSize, pixelSize);
    }
  }
  ctx.restore();

}//end getClosestPoint()

//////////////////////////////////////////////////////////////////////////////
//
//////////////////////////////////////////////////////////////////////////////
function drawBorders(){

  console.log("test");

  ctx.save();

  //Define relative coordinates of all neighboring pixels
  let neighbors = [[-1, -1], [0, -1], [1, -1],
                    [-1, 0],          [1, 0],
                    [-1, 1], [0, 1],  [1,1]];

  ctx.fillStyle = "black";

  //Itterarte through each "pixel" on the canvas
  for(let x = 0; x < canvasWidth/pixelSize; x++){
    for(let y = 0; y < canvasHeight/pixelSize; y++){

      // Check each neighbor. If their value is different from the current pixel,
      // fill the current pixel in with black
      for(let z = 0; z < neighbors.length; z++){
        if(x + neighbors[z][0] < 0 || x + neighbors[z][0] > canvasWidth/pixelSize -1 || y + neighbors[z][1] < 0 || y + neighbors[z][1] > canvasHeight/pixelSize -1 ){continue;}
        if(pixelList[x][y] != pixelList[x + neighbors[z][0]][y + neighbors[z][1]]){
          ctx.fillRect(x*pixelSize, y*pixelSize, pixelSize, pixelSize);
          continue;
        }
      }
    }
  }
  ctx.restore();

}//end getBorders()

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
  ctx.fillRect(0, 0, canvasWidth  + sidebarWidth, canvasHeight + uiHeight);

  getClosestPoint();
  drawSeeds();
  drawUI();

  if(showBorders){ drawBorders();}

  ctx.restore();

}//end update()

//////////////////////////////////////////////////////////////////////////////
//  Define the values for all buttons used in this program
//////////////////////////////////////////////////////////////////////////////
function generateButtons(){

  buttonList.push( {
    name: "Decrease pixel size.",
    text: "-",
    fontSize: 40,
    fontColor: "#aaa",
    buttonColor: "black",
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
    fontColor: "#aaa",
    buttonColor: "black",
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
    fontColor: "#aaa",
    buttonColor: "black",
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
    fontColor: "#aaa",
    buttonColor: "black",
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
    fontColor: "#aaa",
    buttonColor: "black",
    xPos: 10,
    yPos: canvasHeight + 30,
    width: 190,
    height: 50,
    function: function a(){
      colorPallette = null;
      seedLocations = [];
      seedColors = [];
      generateSeeds();
      update();
    }
  });

  buttonList.push( {
    name: "Scramble colors.",
    text: "Scramble colors",
    fontSize: 38,
    fontColor: "#aaa",
    buttonColor: "black",
    xPos: 530,
    yPos: canvasHeight + 30,
    width: 360,
    height: 50,
    function: function a(){
      colorPallette = null;
      seedColors = [];
      generateSeeds();
      update();
    }
  });

  buttonList.push( {
    name: "Red",
    text: "red",
    fontSize: 30,
    buttonColor: "red",
    fontColor: "black",
    xPos: 808,
    yPos: 10,
    width: 84,
    height: 50,
    function: function a(){
      seedColors = [];
      colorPallette = [1,0,0];
      for(let x = 0; x < numSeeds; x++){
        seedColors.push(generateSeedColor());
      }
      update();
    }
  });

  buttonList.push( {
    name: "Green",
    text: "grn",
    fontSize: 30,
    buttonColor: "green",
    fontColor: "black",
    xPos: 808,
    yPos: 75,
    width: 84,
    height: 50,
    function: function a(){
      seedColors = [];
      colorPallette = [0,1,0];
      for(let x = 0; x < numSeeds; x++){
        seedColors.push(generateSeedColor());
      }
      update();
    }
  });

  buttonList.push( {
    name: "Blue",
    text: "blue",
    buttonColor: "blue",
    fontColor: "black",
    fontSize: 30,
    xPos: 808,
    yPos: 140,
    width: 84,
    height: 50,
    function: function a(){
      seedColors = [];
      colorPallette = [0,0,1];
      for(let x = 0; x < numSeeds; x++){
        seedColors.push(generateSeedColor());
      }
      update();
    }
  });

  buttonList.push( {
    name: "purple",
    text: "purp",
    fontSize: 30,
    buttonColor: "purple",
    fontColor: "black",
    xPos: 808,
    yPos: 205,
    width: 84,
    height: 50,
    function: function a(){
      seedColors = [];
      colorPallette = [1,0.1,1];
      for(let x = 0; x < numSeeds; x++){
        let tmpColor = Math.floor(Math.random() * 170 + 35);
        seedColors.push("rgb(" + tmpColor + "," + 20 + "," + (tmpColor + 10) + ")");
      }
      update();
    }
  });

  buttonList.push( {
    name: "Teal",
    text: "teal",
    fontSize: 30,
    buttonColor: "teal",
    fontColor: "black",
    xPos: 808,
    yPos: 270,
    width: 84,
    height: 50,
    function: function a(){
      seedColors = [];
      colorPallette = [0.1,1,1];
      for(let x = 0; x < numSeeds; x++){
        let tmpColor = Math.floor(Math.random() * 170 + 85);
        seedColors.push("rgb( 0," + tmpColor + "," + tmpColor + ")");
      }
      update();
    }
  });

  buttonList.push( {
    name: "Yellow",
    text: "yelo",
    fontSize: 30,
    buttonColor: "yellow",
    fontColor: "black",
    xPos: 808,
    yPos: 335,
    width: 84,
    height: 50,
    function: function a(){
      seedColors = [];
      colorPallette = [1,1,0.1];
      for(let x = 0; x < numSeeds; x++){
        let tmpColor = Math.floor(Math.random() * 170 + 85);
        seedColors.push("rgb(" + tmpColor + "," + tmpColor + ", 40)");
      }
      update();
    }
  });

  buttonList.push( {
    name: "Brown",
    text: "brwn",
    fontSize: 30,
    buttonColor: "brown",
    fontColor: "black",
    xPos: 808,
    yPos: 400,
    width: 84,
    height: 50,
    function: function a(){
      seedColors = [];
      colorPallette = [1,0.5,0.1];
      for(let x = 0; x < numSeeds; x++){
        let tmpColor = Math.random();
        seedColors.push("rgb(" + (200 * tmpColor) + "," + (100 * tmpColor) +  "," + (20 * tmpColor) + ")");
      }
      update();
    }
  });

  buttonList.push( {
    name: "White",
    text: "whit",
    fontSize: 30,
    buttonColor: "white",
    fontColor: "black",
    xPos: 808,
    yPos: 460,
    width: 84,
    height: 50,
    function: function a(){
      seedColors = [];
      colorPallette = [0.9,0.9,0.9];
      for(let x = 0; x < numSeeds; x++){
        let tmpColor = Math.random();
        seedColors.push("rgb(" + (55 * tmpColor + 200) + "," + (55 * tmpColor + 200) +  "," + (55 * tmpColor + 200) + ")");
      }
      update();
    }
  });

  buttonList.push( {
    name: "Show borders",
    text: "show",
    fontSize: 30,
    buttonColor: "black",
    fontColor: "#aaa",
    xPos: 808,
    yPos: 540,
    width: 84,
    height: 50,
    function: function a(){
      buttonList.filter(function(button){
        if(button.name=="Hide borders"){
          button.buttonColor="black";
          button.fontColor = "#aaa";
        }
      });
      this.buttonColor="#ccc";
      this.fontColor = "#888";
      showBorders = true;
      update();
    }
  });

  buttonList.push( {
    name: "Hide borders",
    text: "hide",
    fontSize: 30,
    buttonColor: "#ccc",
    fontColor: "#888",
    xPos: 808,
    yPos: 600,
    width: 84,
    height: 50,
    function: function a(){
      buttonList.filter(function(button){
        if(button.name=="Show borders"){
          button.buttonColor="black";
          button.fontColor = "#aaa";
        }
      });
      this.buttonColor="#ccc";
      this.fontColor = "#888";
      showBorders = false;
      update();
    }
  });

  buttonList.push( {
    name: "Show seeds",
    text: "show",
    fontSize: 30,
    buttonColor: "#ccc",
    fontColor: "#888",
    xPos: 808,
    yPos: 680,
    width: 84,
    height: 50,
    function: function a(){
      buttonList.filter(function(button){
        if(button.name=="Hide seeds"){
          button.buttonColor="black";
          button.fontColor = "#aaa";
        }
      });
      this.buttonColor="#ccc";
      this.fontColor = "#888";
      seedSize = 5;
      update();
    }
  });

  buttonList.push( {
    name: "Hide seeds",
    text: "hide",
    fontSize: 30,
    buttonColor: "black",
    fontColor: "#aaa",
    xPos: 808,
    yPos: 740,
    width: 84,
    height: 50,
    function: function a(){
      buttonList.filter(function(button){
        if(button.name=="Show seeds"){
          button.buttonColor="black";
          button.fontColor = "#aaa";
        }
      });
      this.buttonColor="#ccc";
      this.fontColor = "#888";
      seedSize = 0;
      update();
    }
  });

}//end generateButtons();

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

  //Itterate through each button and, if one was clicked, perfrom the associated function
  for(let x = 0; x < buttonList.length; x++){
    let btn = buttonList[x];
    if(clickPosition.x > btn.xPos && clickPosition.x < btn.xPos + btn.width && clickPosition.y > btn.yPos && clickPosition.y < btn.yPos + btn.height){
      console.log(btn.name);
      btn.function();
    }
  }

}//end logMouseDown()
