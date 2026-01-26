let canvas = document.getElementById("gl-canvas");
let gl = canvas.getContext("webgl");

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.0, 0.0, 0.0, 1.0);

let program = initShaders(gl, "vs", "fs");
gl.useProgram(program);

// =====================
// VERTEX (JUMLAH HARUS SAMA)
// =====================
let triangle = [
  vec2(-0.5, -0.5),
  vec2( 0.0,  0.5),
  vec2( 0.5, -0.5),
  vec2(-0.5, -0.5) // DUPLIKAT BIAR JADI 4
];

let square = [
  vec2(-0.5, -0.5),
  vec2(-0.5,  0.5),
  vec2( 0.5,  0.5),
  vec2( 0.5, -0.5)
];

// =====================
// BUFFER TRIANGLE
// =====================
let buffer1 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
gl.bufferData(gl.ARRAY_BUFFER, flatten(triangle), gl.STATIC_DRAW);

let vPos1 = gl.getAttribLocation(program, "vPos1");
gl.vertexAttribPointer(vPos1, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vPos1);

// =====================
// BUFFER SQUARE
// =====================
let buffer2 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
gl.bufferData(gl.ARRAY_BUFFER, flatten(square), gl.STATIC_DRAW);

let vPos2 = gl.getAttribLocation(program, "vPos2");
gl.vertexAttribPointer(vPos2, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vPos2);

// =====================
// UNIFORM
// =====================
let tLoc = gl.getUniformLocation(program, "t");
let t = 0;

// =====================
// ANIMASI
// =====================
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  t += 0.01;
  gl.uniform1f(tLoc, (Math.sin(t) + 1.0) / 2.0);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  requestAnimationFrame(render);
}

render();
