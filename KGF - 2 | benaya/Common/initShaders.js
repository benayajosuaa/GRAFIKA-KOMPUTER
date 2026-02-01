function initShaders(gl, vertexShaderId, fragmentShaderId) {

    function loadShader(id) {
        var shaderScript = document.getElementById(id);
        var shaderSource = shaderScript.text;

        var shader;
        if (shaderScript.type === "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else if (shaderScript.type === "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        }

        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    var vertexShader = loadShader(vertexShaderId);
    var fragmentShader = loadShader(fragmentShaderId);

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        alert("Shader program failed to link");
        return null;
    }

    return program;
}
