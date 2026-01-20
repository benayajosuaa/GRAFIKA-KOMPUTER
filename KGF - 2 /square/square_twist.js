var gl;
var points = [];
var divisions = 30;
var twist = 4.0;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) alert("WebGL not available");

    generateSquare();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    render();
};

function twistPoint(p) {
    var r = Math.sqrt(p[0]*p[0] + p[1]*p[1]);
    var angle = twist * r;
    return vec2(
        p[0]*Math.cos(angle) - p[1]*Math.sin(angle),
        p[0]*Math.sin(angle) + p[1]*Math.cos(angle)
    );
}

function generateSquare() {
    var step = 2.0 / divisions;

    for (var i = 0; i < divisions; i++) {
        for (var j = 0; j < divisions; j++) {
            var x = -1 + i * step;
            var y = -1 + j * step;

            var p1 = twistPoint(vec2(x, y));
            var p2 = twistPoint(vec2(x + step, y));
            var p3 = twistPoint(vec2(x + step, y + step));
            var p4 = twistPoint(vec2(x, y + step));

            points.push(p1, p2, p3);
            points.push(p1, p3, p4);
        }
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
}
