/* these are optional special variables which will change the system */
var systemBackgroundColor = "#090a24";
var systemLineColor = "#000090";
var systemBoxColor = "#00c800";

/* internal constants */

const red  = "#c40834";
const yellow = "#ebbb38";
const cyan = "#2bd9d3";
const blue = "#131fcf";
const white = "#ffffff";

const letterWidth = 60;
const letterHeight = 120;
const numLines = 10;
const sublines = 6;
const alpha = 175;
const shiftmult = 0.7;

/*
 * Draw the letter given the letterData
 *
 * Letters should always be drawn with the
 * following bounding box guideline:
 * from (0,0) to (100, 200)
 */
function drawLetter(letterData) {
  drawingContext.shadowColor = color(0,255,0);

  noiseSeed(25);
  
  strokeCap(SQUARE);

  push();
  translate((100-letterWidth)/2, (200-letterHeight)/2);

  push();
  translate(-20, 6);
  drawLetterForm(blue, letterData);
  pop();

  push();
  translate(20, -3);
  drawLetterForm(red, letterData);
  pop();

  push();
  translate(10, -5);
  drawLetterForm(yellow, letterData);
  pop();

  push();
  translate(-10, 8);
  drawLetterForm(cyan, letterData);
  pop();

  drawLetterForm(white, letterData);

  pop();

}


function drawLetterForm(fillColour, letterData) {
  let c = color(fillColour);
  c.setAlpha(alpha);

  let prevLineCoords;
  let prevContourCoords;

  let glitchOffset = letterData['percent'];
  if(glitchOffset == undefined) glitchOffset = 0;

  glitchOffset = abs(glitchOffset);

  for(let i = 0; i < numLines; i++) {
    let glitchBool = false;

    push();
    if(glitchOffset > 30 && glitchOffset < 50 && i%2 == 0 && letterData['percent'] < 0) {
      c.setAlpha(255);
      let bigGlitch = 1 - ((i+4)%4);
      let scaleGlitch = 1 - ((i+4)%3);
      scale(1 + scaleGlitch*0.4, 1 + scaleGlitch*0.4);
      translate(bigGlitch*(letterWidth/10)-(letterWidth/10),0);
      glitchBool = true
    }

    let num = i+1;

    let lineCoords = getCoords(num, 'l', letterWidth, letterHeight, letterData);
    let contourCoords = getCoords(num, 'c', letterWidth, letterHeight, letterData);

    if(prevLineCoords == undefined) {
      prevLineCoords = lineCoords;
      prevContourCoords = contourCoords;
    }

    strokeWeight(letterHeight/numLines/sublines);
    stroke(c);

    for(let j = 0; j < sublines; j++) {
      if(j == 0 && glitchBool) {
        drawingContext.shadowBlur = 40;
      } else {
        drawingContext.shadowBlur = 0;
      }

      console.log(glitchOffset);

      let noiseVal = noise((i*sublines+j)*0.8, glitchOffset*0.05);
      let shift = map(pow(noiseVal, 6), 0, 1, 0, letterWidth/1.2) * shiftmult;
      let direction = j%2==0 ? 1 : -1

      push();
      translate(shift*direction, 0);

      let lerpAmount = map(j, 0, sublines, 0, 1);
      let y = map(j, 0, sublines, 0, letterHeight/numLines);
    
      let currentLine = p5.Vector.lerp(prevLineCoords, lineCoords, lerpAmount);
      let currentContour = p5.Vector.lerp(prevContourCoords, contourCoords, lerpAmount);
      line(currentLine.x, y, max(currentContour.x, currentLine.x), y);
      line(min(currentContour.y, currentLine.y), y, max(currentContour.y, currentLine.y), y);

      pop();
    }

    prevLineCoords = lineCoords;
    prevContourCoords = contourCoords;

    pop();

    translate(0, letterHeight/numLines);

  }
}

function getCoords(lineNum, prefix, letterWidth, letterHeight, letterData) {
  let currentLine = letterData[prefix + lineNum.toString()];
  let lineWidth = floor(currentLine);
  let lineCenter = currentLine - lineWidth;

  let centerx = letterWidth*lineCenter;
  let x1 = centerx-(lineWidth/200)*letterWidth;
  let x2 = centerx+(lineWidth/200)*letterWidth;

  return new p5.Vector(x1, x2);
}

function interpolate_letter(percent, oldObj, newObj) {
  let new_letter = {};

  for(let i = 1; i < 11; i++) {
    let line = "l" + i.toString();
    let contour = "c" + i.toString();
    
    let newWidth = floor(map(percent, 0, 100, w(oldObj[line]), w(newObj[line])));
    let newCenter = map(percent, 0, 100, c(oldObj[line]), c(newObj[line]));
    let val = newWidth + newCenter;
    new_letter[line] = val;

    newWidth = floor(map(percent, 0, 100, w(oldObj[contour]), w(newObj[contour])));
    newCenter = map(percent, 0, 100, c(oldObj[contour]), c(newObj[contour]));
    val = newWidth + newCenter;
    new_letter[contour] = val;

    new_letter['percent'] = map(percent, 0, 100, -50, 50);
  }

  return new_letter;
}

function w(val) {
  return floor(val);
}

function c(val) {
  return val - floor(val);
}

var swapWords = [
  "GLITCHED",
  "VIBRANCY",
  "UPSCALED"
]
