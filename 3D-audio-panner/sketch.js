let osc, panner;
let circleX, circleY;
let circleSize = 30;
let squareSize = 300;

function setup() {
  createCanvas(400, 400);
  ellipseMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(14);

  circleX = width / 2;
  circleY = height / 2;

  osc = new p5.Oscillator('sine');
  osc.start();
  osc.amp(0);

  panner = getAudioContext().createPanner();
  panner.panningModel = 'HRTF';
  panner.distanceModel = 'inverse';
  panner.refDistance = 1;
  panner.maxDistance = 10000;
  panner.rolloffFactor = 1;
  panner.setPosition(0, 0, -1);

  osc.disconnect();
  osc.connect(panner);
  panner.connect(getAudioContext().destination);
}

function draw() {
  background(220);

  stroke(0);
  noFill();
  let squareX = width/2 - squareSize/2;
  let squareY = height/2 - squareSize/2;
  rect(squareX, squareY, squareSize, squareSize);

  fill(0);
  noStroke();
  text("Click to play sound\nMove the circle to pan in 3D", width/2, 20);

  circleX = constrain(mouseX, squareX + circleSize/2, squareX + squareSize - circleSize/2);
  circleY = constrain(mouseY, squareY + circleSize/2, squareY + squareSize - circleSize/2);

  fill(100, 200, 250);
  noStroke();
  ellipse(circleX, circleY, circleSize);

  let x = map(circleX, squareX, squareX + squareSize, -1, 1);
  let y = map(circleY, squareY, squareY + squareSize, 1, -1);
  let z = -0.5;

  panner.setPosition(x, y, z);
}

function mousePressed() {
  osc.amp(0.3, 0.05);
}

function mouseReleased() {
  osc.amp(0, 0.1);
}
