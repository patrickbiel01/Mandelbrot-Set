
/* -------------------------
  Complex Numbers Operations:
    Represent comlpex numbers as an array of length 2:
      [Re, Im] = Re + Im*i
  ----------------------- */
function add(c1, c2) {
  let result = [];
  result.push(c1[0] + c2[0]);
  result.push(c1[1] + c2[1]);

  return result;
}

function subtract(c1, c2) {
  let result = [];
  result.push(c1[0] - c2[0]);
  result.push(c1[1] - c2[1]);

  return result;
}

function multiply(c1, c2) {
  let result = [];
  result.push(c1[0]*c2[0] - c1[1]*c2[1]);
  result.push(c1[0]*c2[1] + c1[1]*c2[0]);

  return result;
}
function Re(c) {
  return c[0];
}
function Im(c) {
  return c[1];
}
function magnitude(c) {
  return Math.sqrt( Math.pow( Re(c), 2 ) + Math.pow( Im(c), 2 ) );
}




/* Variables & Constants for Generation */
const ITER_LIMIT = 100;

const WIDTH = 375;
const HEIGHT = 375;
const NUM_ROW = HEIGHT;
const NUM_COL = WIDTH;

let x_min = -2;
let x_max = 1;
let y_max = 2;
let y_min = -2;



/* Mandelbrot Divergence Check */
function mandelbrot_check(c) {
  let z = [0, 0];
  let n = 0;


  for (; magnitude(z) < 4 &&  n < ITER_LIMIT; n++) {
    z = add( multiply(z, z), c );
  }

  return n;
}





/*  --------------------------
  Drawing Helper Functions
  ------------------------------ */

function drawMandelbrotSet() {

  loadPixels();
  for (let i = 0; i < NUM_COL; i++) {
    for (let j = 0; j < NUM_ROW; j++) {

      let real = (x_max - x_min) * (i / NUM_COL) + x_min;
      let im = (y_max - y_min)*(j / NUM_ROW) + y_min;

      let numIter = mandelbrot_check([real, im]);

      var bright = map(numIter, 0, ITER_LIMIT, 0, 1);
      bright = map(Math.sqrt(bright), 0, 1, 0, 255);

      if (numIter == ITER_LIMIT) {
        bright = 0;
      }

      let pix = (i + j * width) * 4;
      //A Pixel is assigned r,g,b,a vals
      pixels[pix + 0] = Math.sqrt(bright)/10;
      pixels[pix + 1] = bright;
      pixels[pix + 2] = Math.sqrt(bright)/2;
      pixels[pix + 3] = 255;
    }
  }
  updatePixels();
}

function drawAxis() {
  stroke(255);
  //y-axis
  let xPos = WIDTH*(-1*x_min/(x_max-x_min));
  line(xPos, 0, xPos, HEIGHT-1);
  //x-axis
  let yPos = HEIGHT*( -1*y_min/ (y_max - y_min) );
  line(0, yPos, WIDTH-1, yPos);
}





/* p5 LIFECYCLE Functions */

function setup() {

  //Insert Canvas
  let canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent("canvasContainer");

  pixelDensity(1);
}

function draw() {

  /* Draw Pattern */
  drawMandelbrotSet();

  /* Draw Axis */
  drawAxis();

  noLoop();
}



let clickedX = 0;
let clickedY = 0;
function mouseClicked() {

  //Draw a little cross hair on point clicked on canvas
  let inBounds = mouseX <= WIDTH && mouseY <= HEIGHT;
  if (!inBounds) {
    return;
  }

  drawMandelbrotSet();
  drawAxis();

  stroke(255, 255, 255);
  circle(mouseX, mouseY, 5);

  //Record complex number clicked
  clickedX = (x_max - x_min) * (mouseX / NUM_COL) + x_min;
  clickedY = (y_max - y_min) * (mouseY / NUM_ROW) + y_min;
}




/* Button Zoom Functionality:
    - Treat clicked num as new center
    - Narrow range by factor of 1/2 / Expand range by factor of 2
 */
function zoomIn() {
  //Shift origin to clicked point
  x_min += clickedX;
  x_max += clickedX;
  y_min += clickedY;
  y_max += clickedY;

  //Scale ranges by 1/2
  x_min *= 1/2;
  x_max *= 1/2;
  y_min *= 1/2;
  y_max *= 1/2;

  drawMandelbrotSet();
  drawAxis();
}

function zoomOut() {

  //Scale ranges by 2
  x_min *= 2;
  x_max *= 2;
  y_min *= 2;
  y_max *= 2;

  //Shift origin to clicked point
  x_min -= clickedX;
  x_max -= clickedX;
  y_min -= clickedY;
  y_max -= clickedY;

  drawMandelbrotSet();
  drawAxis();
}
