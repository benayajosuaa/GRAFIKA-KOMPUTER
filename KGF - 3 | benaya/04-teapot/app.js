// ================== INIT ==================
const canvas = document.getElementById("glcanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  alert("WebGL tidak tersedia");
}

// ================== SHADERS ==================
const vsSource = `
attribute vec3 aPosition;
uniform mat4 uMVP;
void main() {
  gl_Position = uMVP * vec4(aPosition, 1.0);
}
`;

const fsSource = `
precision mediump float;
void main() {
  gl_FragColor = vec4(0.85, 0.85, 0.85, 1.0);
}
`;

function compileShader(type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh));
    return null;
  }
  return sh;
}

const vs = compileShader(gl.VERTEX_SHADER, vsSource);
const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);

const program = gl.createProgram();
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.error(gl.getProgramInfoLog(program));
}

gl.useProgram(program);

// ================== GL SETUP ==================
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0, 0, 0, 1);
gl.enable(gl.DEPTH_TEST);
gl.disable(gl.CULL_FACE);

// ================== OBJ LOADER ==================
async function loadOBJ(url) {
  const text = await fetch(url).then(r => r.text());

  const positions = [];
  const vertices = [];

  text.split("\n").forEach(line => {
    line = line.trim();

    if (line.startsWith("v ")) {
      const [, x, y, z] = line.split(/\s+/);
      positions.push([+x, +y, +z]);
    }

    if (line.startsWith("f ")) {
      const [, ...f] = line.split(/\s+/);
      for (let i = 1; i < f.length - 1; i++) {
        const a = parseInt(f[0]) - 1;
        const b = parseInt(f[i]) - 1;
        const c = parseInt(f[i + 1]) - 1;
        vertices.push(
          ...positions[a],
          ...positions[b],
          ...positions[c]
        );
      }
    }
  });

  return new Float32Array(vertices);
}

// ================== MATRIX ==================
function makeMVP() {
  const fov = Math.PI / 4;
  const aspect = canvas.width / canvas.height;
  const near = 0.1;
  const far = 100.0;

  const f = 1.0 / Math.tan(fov / 2);

  // Projection
  const P = new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) / (near - far), -1,
    0, 0, (2 * far * near) / (near - far), 0
  ]);

  // Model + View (scale + translate Z)
  const M = new Float32Array([
    0.25, 0,    0,    0,
    0,    0.25, 0,    0,
    0,    0,    0.25, 0,
    0,   -1.0, -6.0,  1
  ]);

  // MVP = P * M
  const MVP = new Float32Array(16);
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      MVP[i*4+j] =
        P[i*4+0] * M[0*4+j] +
        P[i*4+1] * M[1*4+j] +
        P[i*4+2] * M[2*4+j] +
        P[i*4+3] * M[3*4+j];
    }
  }

  return MVP;
}

// ================== LOAD & DRAW ==================
loadOBJ("teapot.obj").then(data => {
  console.log("FLOAT COUNT:", data.length);

  if (data.length === 0) {
    alert("OBJ kosong / tidak terbaca");
    return;
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  const aPosition = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

  const uMVP = gl.getUniformLocation(program, "uMVP");

  const MVP = makeMVP();
  gl.uniformMatrix4fv(uMVP, false, MVP);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, data.length / 3);
});
