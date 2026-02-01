export function getSquare(){
    return [
        // logicnya = segitiga + segitiga 
        //          = segitiga ditambahkan namun dengan rotasi yang berbeda

        // segitiga 1
        -0.5, -0.5, 0,
        0.5, -0.5, 0,
        0.5,  0.5, 0,

        // segitiga 2
        -0.5, -0.5, 0,
        0.5,  0.5, 0,
        -0.5,  0.5, 0
    ]
}