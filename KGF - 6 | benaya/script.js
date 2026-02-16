const canvas=document.getElementById("glcanvas");
const gl=canvas.getContext("webgl");

gl.viewport(0,0,canvas.width,canvas.height);
gl.disable(gl.DEPTH_TEST);

// must be global for inline onclick handlers in index.html
window.mode=0;

/* ===== Shader ===== */
const vs=`
attribute vec3 pos;
uniform float mode;
uniform float aspect;

vec3 rotY(vec3 p,float a){
 float c=cos(a),s=sin(a);
 return vec3(c*p.x+s*p.z,p.y,-s*p.x+c*p.z);
}

vec3 rotX(vec3 p,float a){
 float c=cos(a),s=sin(a);
 return vec3(p.x,c*p.y-s*p.z,s*p.y+c*p.z);
}

void main(){
 vec3 p=pos;

 // Project to 2D (Excel formulas), then scale into clip space.
 float x2d;
 float y2d;
 float s;

 if(mode==0.0){         // isometric (Excel: sudut 30)
   // x' = x - z
   // y' = 2y + x + z
   x2d = p.x - p.z;
   y2d = 2.0*p.y + p.x + p.z;
   s = 4.5;
 }
 else if(mode==1.0){    // dimetric (Excel: sudut 7 & 42, z foreshortening 0.5)
   float a = radians(7.0);
   float b = radians(42.0);
   float k = 0.5;
   // x' = x*cos(a) + z*k*cos(b)
   // y' = y - x*sin(a) + z*k*sin(b)
   x2d = p.x*cos(a) + p.z*k*cos(b);
   y2d = p.y - p.x*sin(a) + p.z*k*sin(b);
   s = 2.2;
 }
 else if(mode==2.0){    // one point perspective (Excel: d=4)
   float d = 4.0;
   float denom = p.z + d;
   x2d = p.x * d / denom;
   y2d = p.y * d / denom;
   s = 2.0;
 }
 else{                  // two point perspective (Excel: rotY -30, then d=5)
   p = rotY(p, radians(-30.0));
   float d = 5.0;
   float denom = p.z + d;
   x2d = p.x * d / denom;
   y2d = p.y * d / denom;
   s = 2.0;
 }

 gl_Position = vec4((x2d/s)/aspect, (y2d/s), 0.0, 1.0);
}
`;

const fs=`
precision mediump float;
uniform vec4 color;
void main(){ gl_FragColor=color; }
`;

function sh(src,t){
 let s=gl.createShader(t);
 gl.shaderSource(s,src);
 gl.compileShader(s);
 return s;
}

let prog=gl.createProgram();
gl.attachShader(prog,sh(vs,gl.VERTEX_SHADER));
gl.attachShader(prog,sh(fs,gl.FRAGMENT_SHADER));
gl.linkProgram(prog);
gl.useProgram(prog);

let posLoc=gl.getAttribLocation(prog,"pos");
let modeLoc=gl.getUniformLocation(prog,"mode");
let aspectLoc=gl.getUniformLocation(prog,"aspect");
let colLoc=gl.getUniformLocation(prog,"color");

/* ===== Cube ===== */
// wireframe edges (like Excel chart)
const cube=new Float32Array([
  // bottom face
  -1,-1,-1,  1,-1,-1,
   1,-1,-1,  1,-1, 1,
   1,-1, 1, -1,-1, 1,
  -1,-1, 1, -1,-1,-1,
  // top face
  -1, 1,-1,  1, 1,-1,
   1, 1,-1,  1, 1, 1,
   1, 1, 1, -1, 1, 1,
  -1, 1, 1, -1, 1,-1,
  // vertical edges
  -1,-1,-1, -1, 1,-1,
   1,-1,-1,  1, 1,-1,
   1,-1, 1,  1, 1, 1,
  -1,-1, 1, -1, 1, 1
]);

let cubeBuf=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,cubeBuf);
gl.bufferData(gl.ARRAY_BUFFER,cube,gl.STATIC_DRAW);

/* ===== Grid ===== */
// (grid removed to match Excel output)

/* ===== Draw ===== */
function draw(){
 gl.clearColor(0,0,0,1);
 gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

 gl.uniform1f(modeLoc,window.mode);
 gl.uniform1f(aspectLoc,canvas.width/canvas.height);

 /* cube */
 gl.bindBuffer(gl.ARRAY_BUFFER,cubeBuf);
 gl.vertexAttribPointer(posLoc,3,gl.FLOAT,false,0,0);
 gl.enableVertexAttribArray(posLoc);
 gl.uniform4f(colLoc,0.2,0.9,1,1);
 gl.drawArrays(gl.LINES,0,cube.length/3);

 requestAnimationFrame(draw);
}

draw();
