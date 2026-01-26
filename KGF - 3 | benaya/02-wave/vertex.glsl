attribute vec4 vPosition;
uniform float time;

void main() {
    float y = vPosition.y + 0.1 * sin(10.0*vPosition.x + time);
    gl_Position = vec4(vPosition.x, y, 0.0, 1.0);
}

