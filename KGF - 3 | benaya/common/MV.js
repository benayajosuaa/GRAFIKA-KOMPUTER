function vec2(x, y) {
  return [x, y];
}

function vec3(x, y, z) {
  return [x, y, z];
}

function vec4(x, y, z, w) {
  return [x, y, z, w];
}

function mix(a, b, s) {
  return a.map((v, i) => (1 - s) * v + s * b[i]);
}

function flatten(v) {
  return new Float32Array(v.flat());
}
