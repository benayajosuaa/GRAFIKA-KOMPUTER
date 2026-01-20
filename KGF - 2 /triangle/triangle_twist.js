var gl;
var points = [];

var divisions = 40;  
var twist = 3.0;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) alert("WebGL not available");

    var A = vec2(0.0, 0.8);
    var B = vec2(-0.8, -0.8);
    var C = vec2(0.8, -0.8);

    tessellateTriangle(A, B, C);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

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

// === TWIST BIASA, AMAN ===
function twistPoint(p) {
    var r = Math.sqrt(p[0]*p[0] + p[1]*p[1]);
    var angle = twist * r;

    return vec2(
        p[0]*Math.cos(angle) - p[1]*Math.sin(angle),
        p[0]*Math.sin(angle) + p[1]*Math.cos(angle)
    );
}

// === TESSSELLATION SEGITIGA UTUH ===
function tessellateTriangle(A, B, C) {
    for (var i = 0; i < divisions; i++) {
        for (var j = 0; j < divisions - i; j++) {

            var a1 = i / divisions;
            var b1 = j / divisions;
            var c1 = 1 - a1 - b1;

            var a2 = (i + 1) / divisions;
            var b2 = j / divisions;
            var c2 = 1 - a2 - b2;

            var a3 = i / divisions;
            var b3 = (j + 1) / divisions;
            var c3 = 1 - a3 - b3;

            var p1 = bary(A, B, C, a1, b1, c1);
            var p2 = bary(A, B, C, a2, b2, c2);
            var p3 = bary(A, B, C, a3, b3, c3);

            points.push(
                twistPoint(p1),
                twistPoint(p2),
                twistPoint(p3)
            );

            if (j + i < divisions - 1) {
                var a4 = (i + 1) / divisions;
                var b4 = (j + 1) / divisions;
                var c4 = 1 - a4 - b4;

                var p4 = bary(A, B, C, a4, b4, c4);

                points.push(
                    twistPoint(p2),
                    twistPoint(p4),
                    twistPoint(p3)
                );
            }
        }
    }
}

function bary(A, B, C, a, b, c) {
    return vec2(
        a*A[0] + b*B[0] + c*C[0],
        a*A[1] + b*B[1] + c*C[1]
    );
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
}
