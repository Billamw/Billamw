
// declaration of window size
const aspect    = 1;
const height    = 600;
const width     = parseInt(height * aspect);

// declaration of mapped window size
const xMin      = parseInt(-4 * aspect);
const xMax      = parseInt( 4 * aspect);
const yMin      = -3;
const yMax      = 5;

// updaded variables in draw()
let t0          = 0;
let T           = 1;

let b1          = t0 + T/2;
let a2          = t0 - T/2;

// constant variables
const t02       = 0;
const T2        = 1;

const a1        = t02 - T2/2;
const b2        = t02 + T2/2; 

let st          = rectImpuls;
let ht          = rectImpuls;

function setup() {
  createCanvas(width, height);

  slidert0 = createSlider(xMin, xMax, -3, 0.05);
  // slidert0.style('width', '300px')
  sliderT = createSlider(.5, 2, 1, .5);
  
  stroke(0);
}

function draw() {

  background(255);
  noFill();

  t0 = slidert0.value();
  T = sliderT.value();
  b1 = t0 + T/2;
  a2 = t0 - T/2;
  
  drawst(st, t02, T2);
  drawht(ht, t0, T);
  
  // making Convolution red and thick
  stroke(255,0,0);
  strokeWeight(2);

  drawConvolution(st, ht);

  strokeWeight(1);
  stroke(0);

  text('a1', map(a1, xMin, xMax, 0, width), 390);
  text('b1', map(b1, xMin, xMax, 0, width), 370);
  text('a2', map(a2, xMin, xMax, 0, width), 370);
  text('b2', map(b2, xMin, xMax, 0, width), 390);

}
let isCos = false; // used in function convolustion
function setSt() {
  slidert0.value(-3);  // restarts the convolution
  var selectedOption = document.querySelector("select:last-of-type").value;
  if (selectedOption === "rect") {
    st = rectImpuls;
    isCos = false;
  } else if (selectedOption === "triangular") {
    st = triangularImpuls;
    isCos = false;
  } else if (selectedOption === "parabola") {
    st = paralbolaImpuls;
    isCos = false;
  } else if (selectedOption === "cosinus") {
    st = cosinusFunction;
    isCos = true;
  }
}

let isDirac = false; // used in drawHt()
function setHt() { 
  slidert0.value(-3); // restarts the convolution
  var selectedOption = document.querySelector("select:first-of-type").value;
  if (selectedOption === "rect") {
    isDirac = false;
    ht = rectImpuls;
  } else if (selectedOption === "triangular") {
    isDirac = false;
    ht = triangularImpuls;
  } else if (selectedOption === "parabola") {
    isDirac = false;
    ht = paralbolaImpuls;
  } else if (selectedOption === "dirac") {
    isDirac = true;
    ht = diracImpules;
  }
}

function rectImpuls(T, t) {
  if(abs(t)<=T/2){
    return 1/T;
  }
  return 0;
}

function triangularImpuls(T, t) {
  if(abs(t) <= T) {
    return (1/T*(1-abs(t)/T));
  }
  else {
    return 0;
  }
}

function paralbolaImpuls(T, t) {
  if(abs(t)<=T*0.5){
    return T*(t-T*.5)*(t-T*.5);
  }
  return 0;
}

function cosinusFunction(T, t) {
  if(abs(t)<=2) {
    return Math.sin(2*3.1415*(t));
  }
  return 0;
}

let sigma = 0.005;

function diracImpuls(T, t) {

  if(0 < t && t<= sigma) {
    return 1/sigma;
  }
  return 0;
}

function diracImpules(T, t) {
  return diracImpuls(T, t) + 0.5 * diracImpuls(T, t-T);
}
// Not in use
// function randomImpuls(T, t) {
//   //return rectImpuls(1, t) + rectImpuls(.5, t-1);
//   if(t>-T/2 && t<T/2) {
//     return t+.5;
//   }
//   return 0;
// }

function drawst(impuls, t0, T) {
  beginShape();
  for (let x = xMin; x <= xMax; x += 0.01) {
    let y = impuls(T,(x-t0));
    vertex(map(x, xMin, xMax, 0, width), map(y, yMin, yMax, height, 0));
  }
  endShape();
}

function drawht(impuls, t0, T) {
  beginShape();
  for (let x = xMin; x <= xMax; x += 0.01) {
    // mirroring the graph around the y achsis
    let y = impuls(T,(-x+t0));
    if(isDirac) {
      y *= sigma;
    }
    vertex(map(x, xMin, xMax, 0, width), map(y, yMin, yMax, height, 0));
  }
  endShape();
}

function drawConvolution(st, ht) {
  let y = 0;
  beginShape();
  for (let x = xMin; x <= t0; x += 0.01) {
    y = convolution(st, ht, x);
    vertex(map(x, xMin, xMax, 0, width), map(y, yMin, yMax, height, 0));
  }
  endShape();
}

function convolution(st, ht, t) {
  // let a = a1-T/2;
  // let b = b2+T/2;
  // // checking, if the function is periodic
  // if(st(T, 0.5) - st(T, 0.5+2*3.1415)< 0.0001){
  //   a = -2;
  //   b =  2;
  // }
  let a = -2;
  let b =  2;
  let tau1, tau2, y1, y2;

  let dtau = 0.01;
  if(isDirac) {
    dtau = sigma
  } else {
    dtau = 0.01;
  }
  let result = 0;

  tau1 = a;
  tau2 = a + dtau;

  // making sub rectangles for approximatin overlapping area
  for (let i = a; i < b; i+= dtau) {

    // continous convolution
    y1 = st(T2, tau1) * ht(T, (t-tau1));
    y2 = st(T2, tau2) * ht(T, (t-tau2));

    // calculating the area of a sub rectangle
    result += dtau * (y1 + y2) / 2;
    tau1 = tau2;
    tau2 += dtau;
  }

  return result;
}