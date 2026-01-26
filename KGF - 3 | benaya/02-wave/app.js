let canvas = document.getElementById("gl-canvas");
let gl = canvas.getContext("webgl");

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.0, 0.0, 0.0, 1.0);

let program = initShaders(gl, "vs", "fs");
gl.useProgram(program);

// =====================
// BUAT TITIK GELOMBANG
// =====================
let points = [];
for (let x = -1.0; x <= 1.0; x += 0.02) {
  points.push(vec2(x, 0.0));
}

// =====================
// BUFFER
// =====================
let buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

// =====================
// ATTRIBUTE
// =====================
let vPosition = gl.getAttribLocation(program, "vPosition");
gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vPosition);

// =====================
// UNIFORM TIME
// =====================
let timeLoc = gl.getUniformLocation(program, "time");

// =====================
// ANIMASI
// =====================
let time = 0;

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  time += 0.05;
  gl.uniform1f(timeLoc, time);
  gl.drawArrays(gl.LINE_STRIP, 0, points.length);
  requestAnimationFrame(render);
}

render(); // 🔥 INI WAJIB
