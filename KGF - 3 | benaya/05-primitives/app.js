let canvas = document.getElementById("gl-canvas");
let gl = canvas.getContext("webgl");

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.0, 0.0, 0.0, 1.0);

// ================= SHADER =================
let program = initShaders(gl, "vs", "fs");
gl.useProgram(program);

// ================= VERTICES =================
let points = [
  vec2(-0.9,  0.6),
  vec2(-0.6,  0.6),
  vec2(-0.3,  0.6),

  vec2(-0.9,  0.2),
  vec2(-0.6,  0.2),
  vec2(-0.3,  0.2),

  vec2(-0.9, -0.3),
  vec2(-0.6, -0.3),
  vec2(-0.3, -0.3),

  vec2(-0.9, -0.8),
  vec2(-0.6, -0.8),
  vec2(-0.3, -0.8),
];

// ================= BUFFER =================
let buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

let vPosition = gl.getAttribLocation(program, "vPosition");
gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vPosition);

// ================= DRAW =================
gl.clear(gl.COLOR_BUFFER_BIT);

// POINTS
gl.drawArrays(gl.POINTS, 0, 3);

// LINES
gl.drawArrays(gl.LINES, 3, 4);

// TRIANGLES
gl.drawArrays(gl.TRIANGLES, 7, 3);

// TRIANGLE_FAN
gl.drawArrays(gl.TRIANGLE_FAN, 10, 4);
