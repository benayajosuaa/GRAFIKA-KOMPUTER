export function getCircle(n = 100) {
    let v = [];
    for (let i=0;i<n;i++){
        let a1 = i*2*Math.PI/n;
        let a2 = (i+1)*2*Math.PI/n;

        v.push(0,0,0);
        v.push(Math.cos(a1)*0.5, Math.sin(a1)*0.5, 0);
        v.push(Math.cos(a2)*0.5, Math.sin(a2)*0.5, 0);
    }
    return v;
}
