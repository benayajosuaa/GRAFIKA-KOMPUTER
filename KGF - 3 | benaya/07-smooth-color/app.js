let canvas = document.getElementById("gl-canvas");
let gl = canvas.getContext("webgl");

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.0, 0.0, 0.0, 1.0);

let program = initShaders(gl, "vs", "fs");
gl.useProgram(program);

// ===== VERTEX POSITIONS =====
let vertices = [
  vec2(-0.6, -0.6),
  vec2(-0.6,  0.6),
  vec2( 0.6,  0.6),
  vec2( 0.6, -0.6)
];

// ===== COLORS =====
let colors = [
  vec4(1, 0, 0, 1),
  vec4(0, 1, 0, 1),
  vec4(0, 0, 1, 1),
  vec4(1, 1, 0, 1)
];

// ===== POSITION BUFFER =====
let vBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

let vPosition = gl.getAttribLocation(program, "vPosition");
gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vPosition);

// ===== COLOR BUFFER =====
let cBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

let vColor = gl.getAttribLocation(program, "vColor");
gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vColor);

// ===== DRAW =====
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
