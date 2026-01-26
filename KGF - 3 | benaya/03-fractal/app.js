let canvas = document.getElementById("gl-canvas");
let gl = canvas.getContext("webgl");

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0, 0, 0, 1);

let program = initShaders(gl, "vs", "fs");
gl.useProgram(program);

// ================= FRACTAL DATA =================
let points = [];

let a = vec2(-1, -1);
let b = vec2(0, 1);
let c = vec2(1, -1);
let p = vec2(0, 0);

for (let i = 0; i < 5000; i++) {
  let r = Math.random();
  if (r < 0.33) p = mix(p, a, 0.5);
  else if (r < 0.66) p = mix(p, b, 0.5);
  else p = mix(p, c, 0.5);
  points.push(p);
}

// ================= BUFFER =================
let buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

let vPosition = gl.getAttribLocation(program, "vPosition");
gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vPosition);

// ================= DRAW =================
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.POINTS, 0, points.length);
