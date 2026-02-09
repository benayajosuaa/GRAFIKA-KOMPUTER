// ========= CANVAS =========
const glCanvas = document.getElementById("glcanvas");
const gl = glCanvas.getContext("webgl");
const overlay = document.getElementById("overlay");
const ctx = overlay.getContext("2d");

gl.viewport(0, 0, 600, 600);

// ========= SHADER =========
const vs = `
attribute vec2 aPosition;
void main(){
  gl_Position = vec4(aPosition,0.0,1.0);
  gl_PointSize = 6.0;
}`;
const fs = `
precision mediump float;
uniform vec4 uColor;
void main(){ gl_FragColor = uColor; }`;

function shader(type, src){
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

const program = gl.createProgram();
gl.attachShader(program, shader(gl.VERTEX_SHADER, vs));
gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fs));
gl.linkProgram(program);
gl.useProgram(program);

// ========= UTIL =========
function clip(x,y){ return [x/5, y/5]; }

function draw(points, color, mode){
  const data=[];
  points.forEach(p=>{
    const c=clip(p[0],p[1]);
    data.push(c[0],c[1]);
  });

  const buf=gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);

  const aPos=gl.getAttribLocation(program,"aPosition");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos,2,gl.FLOAT,false,0,0);

  gl.uniform4fv(gl.getUniformLocation(program,"uColor"),color);
  gl.drawArrays(mode,0,points.length);
}

// ========= DATA =========
const original = [
  [-4,-2],
  [-3,-4],
  [-2,-2]
];

let mode = 1;

// ========= TRANSFORM =========
function transform(p){
  let x = p[0], y = p[1];

  if(mode === 1){
    // cermin sumbu-X
    return [x, -y];
  }

  if(mode === 2){
    // rotasi 90° CCW terhadap P(-1,1)
    const px=-1, py=1;
    const tx=x-px, ty=y-py;
    return [px - ty, py + tx];
  }

  if(mode === 3){
    // skala 2x
    return [x*2, y*2];
  }
}

function redraw(){
  gl.clearColor(0,0,0,1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // original (biru)
  draw(original,[0,0.6,1,1],gl.LINE_LOOP);
  draw(original,[0,0.6,1,1],gl.POINTS);

  // transformed (merah)
  const t = original.map(transform);
  draw(t,[1,0.2,0.2,1],gl.LINE_LOOP);
  draw(t,[1,0.2,0.2,1],gl.POINTS);
}

// ========= AXIS =========
const c=300, s=60;
ctx.strokeStyle="#aaa";
ctx.fillStyle="#aaa";
ctx.font="12px Arial";

// X axis
ctx.beginPath(); ctx.moveTo(0,c); ctx.lineTo(600,c); ctx.stroke();
// Y axis
ctx.beginPath(); ctx.moveTo(c,0); ctx.lineTo(c,600); ctx.stroke();

for(let i=-5;i<=5;i++){
  const x=c+i*s;
  const y=c-i*s;
  ctx.beginPath(); ctx.moveTo(x,c-4); ctx.lineTo(x,c+4); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(c-4,y); ctx.lineTo(c+4,y); ctx.stroke();
  if(i!==0){
    ctx.fillText(i,x-4,c+18);
    ctx.fillText(i,c+8,y+4);
  }
}

// ========= BUTTON =========
window.setMode = (m)=>{
  mode = m;
  redraw();
};

redraw();
