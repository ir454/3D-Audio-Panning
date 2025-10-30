let osc, panner;
let circleX, circleY;
let circleSize = 30;
let squareSize = 300;

function setup() {
  createCanvas(400, 400);
  ellipseMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(14);

  // Initialize circle in the center
  circleX = width / 2;
  circleY = height / 2;

  // Create oscillator
  osc = new p5.Oscillator('sine');
  osc.start();
  osc.amp(0);

  // Create native Web Audio PannerNode
  let audioCtx = getAudioContext();
  panner = audioCtx.createPanner();
  panner.panningModel = 'HRTF';
  panner.distanceModel = 'inverse';
  panner.refDistance = 1;
  panner.maxDistance = 10000;
  panner.rolloffFactor = 1;

  // Initial position (x, y, z)
  panner.positionX.value = 0;
  panner.positionY.value = 0;
  panner.positionZ.value = -1;

  // Connect p5 osc to Web Audio PannerNode
  osc.disconnect();
  osc.connect(panner);
  panner.connect(audioCtx.destination);
}

function draw() {
  background(220);

  // Draw square
  stroke(0);
  noFill();
  let squareX = width / 2 - squareSize / 2;
  let squareY = height / 2 - squareSize / 2;
  rect(squareX, squareY, squareSize, squareSize);

  // Text
  fill(0);
  noStroke();
  text("Click to enable sound\nMove the circle to pan in 3D", width / 2, 20);

  // Constrain circle
  circleX = constrain(mouseX, squareX + circleSize / 2, squareX + squareSize - circleSize / 2);
  circleY = constrain(mouseY, squareY + circleSize / 2, squareY + squareSize - circleSize / 2);

  // Draw circle
  fill(100, 200, 250);
  ellipse(circleX, circleY, circleSize);

  // Map circle position to panner coordinates
  let x = map(circleX, squareX, squareX + squareSize, -1, 1);
  let y = map(circleY, squareY, squareY + squareSize, 1, -1);
  let z = -0.5; // constant depth

  // Update panner position
  if (panner) {
    panner.positionX.value = x;
    panner.positionY.value = y;
    panner.positionZ.value = z;
  }
}

function mousePressed() {
  // Ensure audio context is running before playing
  userStartAudio().then(() => {
    osc.amp(0.3, 0.05); // fade in
  });
}

function mouseReleased() {
  osc.amp(0, 0.1); // fade out
}
