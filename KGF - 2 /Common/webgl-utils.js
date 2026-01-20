var WebGLUtils = {

    setupWebGL: function(canvas) {
        var gl = null;
        try {
            gl = canvas.getContext("webgl") ||
                 canvas.getContext("experimental-webgl");
        } catch (e) {}

        if (!gl) {
            alert("WebGL isn't available");
        }
        return gl;
    }
};
