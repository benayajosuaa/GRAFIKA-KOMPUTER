function vec2(x, y) {
    return [x, y];
}

function vec3(x, y, z) {
    return [x, y, z];
}

function vec4(x, y, z, w) {
    return [x, y, z, w];
}

function mix(u, v, s) {
    return [
        (1 - s) * u[0] + s * v[0],
        (1 - s) * u[1] + s * v[1]
    ];
}

function flatten(v) {
    var n = v.length;
    var floats = [];

    for (var i = 0; i < n; i++) {
        floats = floats.concat(v[i]);
    }
    return new Float32Array(floats);
}
