"use strict";

// ================= VECTORS =================
function vec2(x, y) {
    return [x, y];
}

function vec3(x, y, z) {
    return [x, y, z];
}

function vec4(x, y, z, w) {
    return [x, y, z, w];
}

// ================= FLATTEN =================
function flatten(v) {
    if (Array.isArray(v[0])) {
        let n = v.length * v[0].length;
        let result = new Float32Array(n);
        let idx = 0;
        for (let i = 0; i < v.length; i++) {
            for (let j = 0; j < v[i].length; j++) {
                result[idx++] = v[i][j];
            }
        }
        return result;
    }
    return new Float32Array(v);
}

// ================= MATRIX =================
function mat4() {
    return [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ];
}

// ================= BASIC MATH =================
function add(a, b) {
    return a.map((x, i) => x + b[i]);
}

function subtract(a, b) {
    return a.map((x, i) => x - b[i]);
}

function dot(a, b) {
    return a.reduce((sum, x, i) => sum + x * b[i], 0);
}

function cross(a, b) {
    return [
        a[1]*b[2] - a[2]*b[1],
        a[2]*b[0] - a[0]*b[2],
        a[0]*b[1] - a[1]*b[0]
    ];
}

function normalize(v) {
    let len = Math.sqrt(dot(v, v));
    return v.map(x => x / len);
}
