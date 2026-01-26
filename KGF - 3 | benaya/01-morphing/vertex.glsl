attribute vec4 vPos1;
attribute vec4 vPos2;
uniform float t;

void main() {
    gl_Position = mix(vPos1, vPos2, t);
}
