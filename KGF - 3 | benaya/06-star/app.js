let canvas = document.getElementById("gl-canvas");
let gl = canvas.getContext("webgl");

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.0, 0.0, 0.0, 1.0);

// ================= SHADER =================
let program = initShaders(gl, "vs", "fs");
gl.useProgram(program);

// ================= STAR VERTICES =================
let star = [];
let colors = [];

for (let i = 0; i < 10; i++) {
  let radius = (i % 2 === 0) ? 0.6 : 0.3;
  let angle = i * Math.PI / 5;

  let x = radius * Math.cos(angle);
  let y = radius * Math.sin(angle);

  star.push(vec2(x, y));

  // warna gradasi (berdasarkan posisi sudut)
  colors.push(vec4(
    (Math.cos(angle) + 1) / 2,
    (Math.sin(angle) + 1) / 2,
    1.0 - i / 10,
    1.0
  ));
}

// ================= POSITION BUFFER =================
let vBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(star), gl.STATIC_DRAW);

let vPosition = gl.getAttribLocation(program, "vPosition");
gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vPosition);

// ================= COLOR BUFFER =================
let cBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

let vColor = gl.getAttribLocation(program, "vColor");
gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vColor);

// ================= DRAW =================
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.LINE_LOOP, 0, star.length);
