import { getTriangle } from "./logic/segitiga.js";
import { getSquare } from "./logic/kotak.js";
import { getCircle } from "./logic/circle.js";
import { getGasket } from "./logic/gasket.js";
import { getGasket3D } from "./logic/gasket3d.js";

const canvas = document.getElementById("glcanvas");
const gl = canvas.getContext("webgl");
gl.enable(gl.DEPTH_TEST);

// shader loader
async function load(url){ return await (await fetch(url)).text(); }

const vs = await load("vertex.glsl");
const fs = await load("fragment.glsl");

function compile(type,src){
    const s=gl.createShader(type);
    gl.shaderSource(s,src);
    gl.compileShader(s);
    return s;
}

const prog=gl.createProgram();
gl.attachShader(prog,compile(gl.VERTEX_SHADER,vs));
gl.attachShader(prog,compile(gl.FRAGMENT_SHADER,fs));
gl.linkProgram(prog);
gl.useProgram(prog);

// choose shape
let vertices = getTriangle(); // ganti: getTriangle(), getSquare(), getCircle(), getGasket()

// buffer
const buf=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,buf);
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);

const aPos=gl.getAttribLocation(prog,"aPosition");
gl.vertexAttribPointer(aPos,3,gl.FLOAT,false,0,0);
gl.enableVertexAttribArray(aPos);

const uMatrix=gl.getUniformLocation(prog,"uMatrix");

// mouse rotation
let rx=0, ry=0, drag=false, lx, ly;
canvas.onmousedown=e=>{drag=true;lx=e.clientX;ly=e.clientY;}
canvas.onmouseup=()=>drag=false;
canvas.onmousemove=e=>{
 if(!drag) return;
 ry+=(e.clientX-lx)*0.01;
 rx+=(e.clientY-ly)*0.01;
 lx=e.clientX; ly=e.clientY;
};

function rotX(a){return [1,0,0,0,0,Math.cos(a),-Math.sin(a),0,0,Math.sin(a),Math.cos(a),0,0,0,0,1];}
function rotY(a){return [Math.cos(a),0,Math.sin(a),0,0,1,0,0,-Math.sin(a),0,Math.cos(a),0,0,0,0,1];}

function mul(a,b){
 let r=[];
 for(let i=0;i<4;i++)for(let j=0;j<4;j++)
  r[i*4+j]=a[i*4]*b[j]+a[i*4+1]*b[j+4]+a[i*4+2]*b[j+8]+a[i*4+3]*b[j+12];
 return r;
}

function render(){
 gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 gl.uniformMatrix4fv(uMatrix,false,new Float32Array(mul(rotY(ry),rotX(rx))));
 gl.drawArrays(gl.TRIANGLES,0,vertices.length/3);
 requestAnimationFrame(render);
}

render();
