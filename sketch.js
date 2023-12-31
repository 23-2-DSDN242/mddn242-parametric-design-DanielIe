const canvasWidth = 960;
const canvasHeight = 500;

const letterWidth = 150;
const letterHeight = 200;
const numLines = 10;
const sublines = 8;
const alpha = 200;
const shiftmult = 1;

/*
 * my three variable per letter are:
 *
   size: radius of the second circle (in pixels)
   offsetx: x offset (in pixels) of the second circle
            relative to the first one
   offsety: y offset (in pixels) of the second circle
            relative to the first one
 *
 */

const letterA = {
  "l1": 35.5,
  "l2": 45.5,
  "l3": 55.5,
  "l4": 65.5,
  "l5": 75.5,
  "l6": 85.5,
  "l7": 95.5,
  "l8": 100.5,
  "l9": 100.5,
  "l10": 100.5,
  "c1": 0.5,
  "c2": 0.5,
  "c3": 0.5,
  "c4": 15.5,
  "c5": 20.5,
  "c6": 25.5,
  "c7": 0.5,
  "c8": 0.5,
  "c9": 0.5,
  "c10": 35.5
}

const letterB = {
  "l1": 90.485,
  "l2": 100.5,
  "l3": 100.5,
  "l4": 100.5,
  "l5": 65.325,
  "l6": 100.5,
  "l7": 100.5,
  "l8": 100.5,
  "l9": 100.5,
  "l10": 90.45,
  "c1": 0.5,
  "c2": 20.5,
  "c3": 25.5,
  "c4": 0.5,
  "c5": 0.5,
  "c6": 0.5,
  "c7": 20.5,
  "c8": 25.5,
  "c9": 0.5,
  "c10": 0.5
}

const letterC = {
  "l1": 90.485,
  "l2": 100.5,
  "l3": 100.5,
  "l4": 100.5,
  "l5": 100.5,
  "l6": 100.5,
  "l7": 100.5,
  "l8": 100.5,
  "l9": 100.5,
  "l10": 90.45,
  "c1": 0.5,
  "c2": 0.5,
  "c3": 15.5,
  "c4": 60.7,
  "c5": 60.7,
  "c6": 60.7,
  "c7": 20.5,
  "c8": 0.5,
  "c9": 0.5,
  "c10": 0.5
}

const backgroundColor  = "#000000";

const red  = "#c40834";
const yellow = "#ebbb38";
const cyan = "#2bd9d3";
const blue = "#131fcf";
const white = "#ffffff";

function setup () {
  // create the drawing canvas, save the canvas element
  main_canvas = createCanvas(canvasWidth, canvasHeight);
  main_canvas.parent('canvasContainer');

  // color/stroke setup

  // with no animation, redrawing the screen is not necessary
  noLoop();
}

function draw () {
  // clear screen
  background(backgroundColor);

  // compute the center of the canvas
  let center_x = canvasWidth / 2;
  let center_y = canvasHeight / 2;

  // draw the letters A, B, C from saved data
  drawLetter(center_x - 250, center_y, letterA);
  drawLetter(center_x      , center_y, letterB);
  drawLetter(center_x + 250, center_y, letterC);
}


// Draw a letter
function drawLetter(posx, posy, letterData) {
  
  strokeCap(SQUARE);

  // Translate to center of letter
  push();
  translate(posx-letterWidth/2, posy);

  // Draw blue layer
  push();
  translate(-20, 0);
  drawLetterForm(blue, letterData);
  pop();

  // Draw red layer
  push();
  translate(20, 0);
  drawLetterForm(red, letterData);
  pop();

  // Draw yellow layer
  push();
  translate(10, 0);
  drawLetterForm(yellow, letterData);
  pop();

  // Draw cyan layer
  push();
  translate(-10, 0);
  drawLetterForm(cyan, letterData);
  pop();

  
  // Draw white layer
  drawLetterForm(white, letterData);

  pop();

}

// Draw the form of a letter in the specified colour
function drawLetterForm(fillColour, letterData) {
  let c = color(fillColour);

  // Store previously drawn line/contour coords
  let prevLineCoords;
  let prevContourCoords;

  // Draw all 10 lines
  for(let i = 0; i < numLines; i++) {
    let num = i+1;

    let lineCoords = getCoords(num, 'l', letterWidth, letterHeight, letterData);
    let contourCoords = getCoords(num, 'c', letterWidth, letterHeight, letterData);

    if(prevLineCoords == undefined) {
      prevLineCoords = lineCoords;
      prevContourCoords = contourCoords;
    }

    strokeWeight(letterHeight/numLines/sublines);
    stroke(c);

    // Draw sublines for each line
    for(let j = 0; j < 4; j++) {

      // Get amount to interpolate between last line and current line
      let lerpAmount = map(j, 0, sublines, 0, 1);
      let y = map(j, 0, sublines, 0, letterHeight/numLines);
    
      // Interpolate
      let currentLine = p5.Vector.lerp(prevLineCoords, lineCoords, lerpAmount);
      let currentContour = p5.Vector.lerp(prevContourCoords, contourCoords, lerpAmount);

      // Draw line
      line(currentLine.x, y, currentContour.x, y);
      line(currentContour.y, y, currentLine.y, y);

    }
    
    // Update previous coords
    prevLineCoords = lineCoords;
    prevContourCoords = contourCoords;

    translate(0, letterHeight/numLines);

  }
}


// Return the coordinates of where a line should start and end
function getCoords(lineNum, prefix, letterWidth, letterHeight, letterData) {
  let currentLine = letterData[prefix + lineNum.toString()];
  let lineWidth = floor(currentLine);
  let lineCenter = currentLine - lineWidth;

  let centerx = letterWidth*lineCenter;
  let x1 = centerx-(lineWidth/200)*letterWidth;
  let x2 = centerx+(lineWidth/200)*letterWidth;

  return new p5.Vector(x1, x2);
}


function keyTyped() {
  if (key == '!') {
    saveBlocksImages();
  }
  else if (key == '@') {
    saveBlocksImages(true);
  }
}
