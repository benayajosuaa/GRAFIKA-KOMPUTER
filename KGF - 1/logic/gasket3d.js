let points=[];

function mid(a,b){
    return [(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2];
}

function tri(a,b,c){
    points.push(...a,...b,...c);
}

function tetra(a,b,c,d){
    tri(a,b,c);
    tri(a,c,d);
    tri(a,b,d);
    tri(b,c,d);
}

function divide(a,b,c,d,n){
    if(n==0) tetra(a,b,c,d);
    else{
        let ab=mid(a,b), ac=mid(a,c), ad=mid(a,d);
        let bc=mid(b,c), bd=mid(b,d), cd=mid(c,d);
        n--;
        divide(a,ab,ac,ad,n);
        divide(ab,b,bc,bd,n);
        divide(ac,bc,c,cd,n);
        divide(ad,bd,cd,d,n);
    }
}

export function getGasket3D(n=4){
    points=[];
    divide([0,0,0.5],[-0.5,-0.5,-0.5],[0.5,-0.5,-0.5],[0,0.5,-0.5],n);
    return points;
}
