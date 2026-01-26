let canvas = document.getElementById("gl-canvas");
let gl = canvas.getContext("webgl");

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.0, 0.0, 0.0, 1.0);

// ================= ENABLE DEPTH =================
gl.enable(gl.DEPTH_TEST);

let program = initShaders(gl, "vs", "fs");
gl.useProgram(program);

let points = [];
let NumTimesToSubdivide = 4;

// ================= INITIAL TETRAHEDRON =================
let vertices = [
  vec3( 0.0,  0.0, -1.0),
  vec3( 0.0,  0.9428,  0.3333),
  vec3(-0.8165, -0.4714, 0.3333),
  vec3( 0.8165, -0.4714, 0.3333)
];

// ================= PUSH TRIANGLE =================
function triangle(a, b, c) {
  points.push(a, b, c);
}

// ================= PUSH TETRA =================
function tetra(a, b, c, d) {
  triangle(a, c, b);
  triangle(a, c, d);
  triangle(a, b, d);
  triangle(b, c, d);
}

// ================= SUBDIVISION =================
function divideTetra(a, b, c, d, count) {
  if (count === 0) {
    tetra(a, b, c, d);
  } else {
    let ab = mix(a, b, 0.5);
    let ac = mix(a, c, 0.5);
    let ad = mix(a, d, 0.5);
    let bc = mix(b, c, 0.5);
    let bd = mix(b, d, 0.5);
    let cd = mix(c, d, 0.5);
    count--;

    divideTetra(a, ab, ac, ad, count);
    divideTetra(ab, b, bc, bd, count);
    divideTetra(ac, bc, c, cd, count);
    divideTetra(ad, bd, cd, d, count);
  }
}

// ================= BUILD GASKET =================
divideTetra(vertices[0], vertices[1], vertices[2], vertices[3], NumTimesToSubdivide);

// ================= BUFFER =================
let buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

let vPosition = gl.getAttribLocation(program, "vPosition");
gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vPosition);

// ================= RENDER =================
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, points.length);
}

render();
