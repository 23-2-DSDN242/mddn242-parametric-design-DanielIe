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

  // Specify noise seed for glitchyness
  noiseSeed(25);
  
  strokeCap(SQUARE);

  // Translate to center of letter
  push();
  translate((100-letterWidth)/2, (200-letterHeight)/2);

  // Draw blue layer
  push();
  translate(-20, 6);
  drawLetterForm(blue, letterData);
  pop();

  // Draw red layer
  push();
  translate(20, -3);
  drawLetterForm(red, letterData);
  pop();

  // Draw yellow layer
  push();
  translate(10, -5);
  drawLetterForm(yellow, letterData);
  pop();

  // Draw cyan layer
  push();
  translate(-10, 8);
  drawLetterForm(cyan, letterData);
  pop();

  // Draw white layer
  drawLetterForm(white, letterData);

  pop();

}

// Draws letterform in specified colour
function drawLetterForm(fillColour, letterData) {
  // Colour for letter
  let c = color(fillColour);
  c.setAlpha(alpha);

  // Store previous lines coords (for subline interpolation)
  let prevLineCoords;
  let prevContourCoords;

  // Get percentage of interpolation between letters
  let glitchOffset = letterData['percent'];
  if(glitchOffset == undefined) glitchOffset = 0;
  glitchOffset = abs(glitchOffset);

  // Iterate over all 10 lines (and corresponding contours)
  for(let i = 0; i < numLines; i++) {
    let glitchBool = false; // Whether the frame should be drawn as glitched

    push();

    // Draw the frame as glitched if interpolation is between 10% and 30%
    if(glitchOffset > 25 && glitchOffset < 55 && i%2 == 0 && letterData['percent'] < 0) {
      c.setAlpha(255);
      let bigGlitch = 1 - ((i+4)%4);
      let scaleGlitch = 1 - ((i+4)%3);
      scale(1 + scaleGlitch*0.4, 1 + scaleGlitch*0.4);
      translate(bigGlitch*(letterWidth/10)-(letterWidth/10),0);
      glitchBool = true
    }

    // Suffix of required parameter name
    let num = i+1;

    // Transform parameter value into line coords / contour coords
    let lineCoords = getCoords(num, 'l', letterWidth, letterHeight, letterData); // Line
    let contourCoords = getCoords(num, 'c', letterWidth, letterHeight, letterData); // Contour (cut out)

    // Set previous coords to current ones if drawing first line (no previous line)
    if(prevLineCoords == undefined) {
      prevLineCoords = lineCoords;
      prevContourCoords = contourCoords;
    }

    // Set weight and colour
    strokeWeight(letterHeight/numLines/sublines);
    stroke(c);

    // Draw all sub-lines
    for(let j = 0; j < sublines; j++) {
      if(j == 0 && glitchBool) {
        drawingContext.shadowBlur = 40;
      } else {
        drawingContext.shadowBlur = 0;
      }

      // Get noise value for glitch offset
      let noiseVal = noise((i*sublines+j)*0.8, glitchOffset*0.05);
      let shift = map(pow(noiseVal, 6), 0, 1, 0, letterWidth/1.2) * shiftmult;

      // Either negative or positive (alternating)
      let direction = j%2==0 ? 1 : -1

      push();
      // Shift to draw glitched line offset
      translate(shift*direction, 0);

      // Get amount to interpolate by (previous main line to current sub-line)
      let lerpAmount = map(j, 0, sublines, 0, 1);
      let y = map(j, 0, sublines, 0, letterHeight/numLines);
    
      // Interpolate width of line/contour for smooth form
      let currentLine = p5.Vector.lerp(prevLineCoords, lineCoords, lerpAmount);
      let currentContour = p5.Vector.lerp(prevContourCoords, contourCoords, lerpAmount);

      // Draw line
      line(currentLine.x, y, max(currentContour.x, currentLine.x), y);
      line(min(currentContour.y, currentLine.y), y, max(currentContour.y, currentLine.y), y);

      pop();
    }

    // Update previous coords
    prevLineCoords = lineCoords;
    prevContourCoords = contourCoords;

    pop();

    translate(0, letterHeight/numLines);

  }
}

// Transform a letter parameter to line coords
function getCoords(lineNum, prefix, letterWidth, letterHeight, letterData) {
  let currentLine = letterData[prefix + lineNum.toString()];
  let lineWidth = floor(currentLine);
  let lineCenter = currentLine - lineWidth;

  let centerx = letterWidth*lineCenter;
  let x1 = centerx-(lineWidth/200)*letterWidth;
  let x2 = centerx+(lineWidth/200)*letterWidth;

  // Return as a vector
  return new p5.Vector(x1, x2);
}

// Interpolation between old letter and new letter
function interpolate_letter(percent, oldObj, newObj) {
  let new_letter = {};

  // Iterate over all parameters
  for(let i = 1; i < 11; i++) {
    let line = "l" + i.toString();
    let contour = "c" + i.toString();
    
    // Interpolate line parameter (l1,l2,...l10)
    let newWidth = floor(map(percent, 0, 100, w(oldObj[line]), w(newObj[line])));
    let newCenter = map(percent, 0, 100, c(oldObj[line]), c(newObj[line]));
    let val = newWidth + newCenter;
    new_letter[line] = val;

    // Interpolate contour parameter (c1,c2,...c10)
    newWidth = floor(map(percent, 0, 100, w(oldObj[contour]), w(newObj[contour])));
    newCenter = map(percent, 0, 100, c(oldObj[contour]), c(newObj[contour]));
    val = newWidth + newCenter;
    new_letter[contour] = val;

    // Add value for interpolation amount to be used to 'glitch' the letter
    new_letter['percent'] = map(percent, 0, 100, -50, 50);
  }

  return new_letter;
}

// Shortcut for flooring a value
function w(val) {
  return floor(val);
}

// Shortcut for getting the decimal value of a number
function c(val) {
  return val - floor(val);
}

// Words for exhibition
var swapWords = [
  "GLITCHED",
  "VIBRANCY",
  "UPSCALED"
]
