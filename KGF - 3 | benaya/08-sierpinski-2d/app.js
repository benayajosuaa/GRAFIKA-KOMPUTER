let canvas = document.getElementById("gl-canvas");
let gl = canvas.getContext("webgl");

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.0, 0.0, 0.0, 1.0);

let program = initShaders(gl, "vs", "fs");
gl.useProgram(program);

let points = [];
let NumTimesToSubdivide = 5;

// ================= INITIAL TRIANGLE =================
let vertices = [
  vec2(-1.0, -1.0),
  vec2( 0.0,  1.0),
  vec2( 1.0, -1.0)
];

// ================= FRACTAL FUNCTION =================
function divideTriangle(a, b, c, count) {
  if (count === 0) {
    points.push(a, b, c);
  } else {
    let ab = mix(a, b, 0.5);
    let ac = mix(a, c, 0.5);
    let bc = mix(b, c, 0.5);
    count--;

    divideTriangle(a, ab, ac, count);
    divideTriangle(c, ac, bc, count);
    divideTriangle(b, bc, ab, count);
  }
}

// ================= BUILD GASKET =================
divideTriangle(vertices[0], vertices[1], vertices[2], NumTimesToSubdivide);

// ================= BUFFER =================
let buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

let vPosition = gl.getAttribLocation(program, "vPosition");
gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vPosition);

// ================= RENDER =================
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, points.length);
