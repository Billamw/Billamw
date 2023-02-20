let xMin = -4;
let xMax = 4;
let yMin = -3;
let yMax = 5;

let t0 = 0;
let t02 = 0;
let T = 1;
let T2 = 1;

let a1 = t02 - T2/2;
let b1 = t0 + T/2;
let a2 = t0 - T/2;
let b2 = t02 + T2/2; 

let functionInput;

let impuls1 = rectImpuls;
let impuls2 = randomFunction;


function setup() {
  createCanvas(600, 600);

  slidert0 = createSlider(xMin, xMax, -2, 0.05);
  slidert0.style('width', '300px')
  inputT = createInput('1');
  inputT.size(20);

  stroke(0);
  noFill();
}

function draw() {
  background(255);

  t0 = slidert0.value();
  b1 = t0 + T/2;
  a2 = t0 - T/2;

  T = inputT.value();


  drawImpuls(impuls1, t0, T);
  drawImpuls(impuls2, t02, T2);

  stroke(255,0,0);
  strokeWeight(2);

  drawConvolution(impuls1, impuls2);

  strokeWeight(1);
  stroke(0);

  // text('a1', map(a1, xMin, xMax, 0, width), 390);
  // text('b1', map(b1, xMin, xMax, 0, width), 370);
  // text('a2', map(a2, xMin, xMax, 0, width), 370);
  // text('b2', map(b2, xMin, xMax, 0, width), 390);

}


function rectImpuls(t) {
  if(abs(t)<=1/2){
    return 1;
  }
  return 0;
}

function triangularImpuls(t) {
  if(abs(t) <= 1) {
    return 1-abs(t);
  }
  return 0;
}

function randomFunction(t) {
  return rectImpuls(t) + .5*triangularImpuls(2*t) + paralbolaFunction(t-1);
  //return convolution(rectImpuls, rectImpuls, t);
}

function paralbolaFunction(t) {
  if(abs(t)<=0.5){
    return (t-.5)*(t-.5);
  }
  return 0;
}

function drawImpuls(impuls, t0, T) {
  beginShape();
  for (let x = xMin; x <= xMax; x += 0.01) {
    let y = impuls((x-t0)/T);
    vertex(map(x, xMin, xMax, 0, width), map(y, yMin, yMax, height, 0));
  }
  endShape();
}

function drawConvolution(impuls1, impuls2) {
  let y = 0;
  beginShape();
  for (let t = xMin; t <= t0; t += 0.01) {
    y = convolution(impuls1, impuls2, t);
    vertex(map(t, xMin, xMax, 0, width), map(y, yMin, yMax, height, 0));
  }
  endShape();
}

function convolution(impuls1, impuls2, t) {
  let tau1, tau2, y1, y2;
  let dtau = 0.01;
  let result = 0;

  tau1 = a1-T/2;
  tau2 = a1-T/2 + dtau;

  // making sub rectangles for approximatin overlapping area
  for (let i = a1-T/2; i <b2+T/2; i+= dtau) {

    // continous convolution
    y1 = impuls1(tau1/T) * impuls2((t-tau1)/T2);
    y2 = impuls1(tau2/T) * impuls2((t-tau2)/T2);

    // calculating the area of a sub rectangle
    result += dtau * (y1 + y2) / 2;
    tau1 = tau2;
    tau2 = tau1 + dtau;
  }

  return result;
}