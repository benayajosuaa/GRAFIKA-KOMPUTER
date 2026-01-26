function initShaders(gl, vsId, fsId) {
  let vs = document.getElementById(vsId).text;
  let fs = document.getElementById(fsId).text;

  let vShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vShader, vs);
  gl.compileShader(vShader);

  let fShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fShader, fs);
  gl.compileShader(fShader);

  let program = gl.createProgram();
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);

  return program;
}
