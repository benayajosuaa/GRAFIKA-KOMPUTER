let points = [];

function triangle(a, b, c) {
    points.push(...a, ...b, ...c);
}

function mid(a, b) {
    return [
        (a[0] + b[0]) / 2,
        (a[1] + b[1]) / 2,
        0
    ];
}

function divide(a, b, c, depth) {
    if (depth === 0) {
        triangle(a, b, c);
    } else {
        const ab = mid(a, b);
        const ac = mid(a, c);
        const bc = mid(b, c);
        depth--;

        divide(a, ab, ac, depth);
        divide(c, ac, bc, depth);
        divide(b, bc, ab, depth);
    }
}

export function getGasket(depth = 5) {
    points = [];

    const a = [-0.5, -0.5, 0];
    const b = [ 0.0,  0.5, 0];
    const c = [ 0.5, -0.5, 0];

    divide(a, b, c, depth);
    return points;
}
