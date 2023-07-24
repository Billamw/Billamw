// declaration of window size
const aspect    = 1;
const height    = 600;
const width     = parseInt(height * aspect);

const xMin = -13;
const xMax = 13;
const yMin = -7;
const yMax = 32;

let signal1 = [1, 1, 1, 1];
let signal2 = [1, 1, 1, 1];

// let signal2 = [8,16,32,4,8,4,16,16];
// let signal1 = [1/16,1/4,3/8,1/4,1/16];

let t0 = 0;
let t02 = 0-signal2.length/2;


function setup() {
  createCanvas(width, height);

  slidert0 = createSlider(xMin+1, xMax-signal1.length, -(signal1.length + signal2.length/2 + 1), 1);
  slidert0.style('width', '300px')

  stroke(0);
  noFill();
}

function draw() {
  background(255);
  
  t0 = slidert0.value();
  drawxt(signal1, t0);
  drawht(signal2, t02);
  drawConvolution(signal1, signal2, t02);

}

function setSt() {
  slidert0.value(-13);  // restarts the convolution
  var selectedOption = document.querySelector("select:last-of-type").value;
  if (selectedOption === "rect") {
    console.log("lol");
    signal1 = [1, 1, 1, 1];
  } else if (selectedOption === "triangular") {
    signal1 = [0, .5, 1, .5, 0];
  } else if (selectedOption === "parabola") {
    signal1 = [0, 0.25, 1, 4];
  } else if (selectedOption === "cosinus") {
    signal1 = [0, 1, 0, -1, 0, 1];
  }
}

function setHt() {
  slidert0.value(-13);  // restarts the convolution
  var selectedOption = document.querySelector("select:first-of-type").value;
  if (selectedOption === "rect") {
    signal2 = [1, 1, 1, 1];
  } else if (selectedOption === "triangular") {
    signal2 = [0, .5, 1, .5, 0];
  } else if (selectedOption === "parabola") {
    signal2 = [0, 0.25, 1, 4];
  } else if (selectedOption === "dirac") {
    signal2 = [100];
  }
}

function drawxt(signal, t) {
  let y, x_pos;
  for (let x = 0; x < signal.length; x++) {
    // if(signal[x] == 0) {
    //   continue;
    // }
    x_pos = map(x+t, xMin, xMax, 0, width);
    y = map(signal[x], yMin, yMax, height, 0)
    strokeWeight(5);
    point(x_pos,y);
    strokeWeight(2);
    line(x_pos, map(0, yMin, yMax, height, 0), x_pos, y);
  }
}

function drawht(signal, t) {
    let y, x_pos;
    for (let x = 0; x < signal.length; x++) {
      // if(signal[signal.length-1-x] == 0) {
      //   continue;
      // }
      x_pos = map(x+t, xMin, xMax, 0, width);
      y = map(signal[signal.length-1-x], yMin, yMax, height, 0)
      strokeWeight(5);
      point(x_pos,y);
      strokeWeight(2);
      line(x_pos, map(0, yMin, yMax, height, 0), x_pos, y);
    }
}

function drawConvolution(signal1, signal2, t)  {
  stroke('red');
  let y, x_pos;
  let tmp = (signal1.length + signal2.length) / 2;
  for (let x = 0; x < slidert0.value() + tmp; x++) {
    x_pos = map(x+t, xMin, xMax, 0, width);
    y = map(eConvolution(signal1, signal2)[x], yMin, yMax, height, 0)
    strokeWeight(5);
    point(x_pos,y);
    strokeWeight(2);
    line(x_pos, map(0, yMin, yMax, height, 0), x_pos, y);
  }
  stroke('black')
}

function eConvolution(x, h, t) {
  const N = x.length;
  const M = h.length;
  const y = new Array(N + M - 1).fill(0);

  for (let n = - (1 + t02 + t0); n < N + M - 1; n++) {
    for (let k = 0; k < N; k++) {
      if (n - k < 0 || n - k >= M) continue;
      y[y.length-1-n] += x[k] * h[n - k];
    }
  }


  // for (let k = 0; k < N; k++) {
  //   if (t - k < 0 || t - k >= M) continue;
  //   y[t] += x[k] * h[t - k];
  // }

  return y;
}




