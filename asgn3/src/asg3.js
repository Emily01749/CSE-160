// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ProjectionMatrix;
  uniform mat4 u_ViewMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`;

// Fragment shader program
var FSHADER_SOURCE = `
   precision mediump float;
   varying vec2 v_UV;
   uniform vec4 u_FragColor;
   uniform sampler2D u_Sampler;
   uniform sampler2D u_Sampler1;
   uniform sampler2D u_Sampler2;
   uniform float u_SelectTexture;
   void main() {
      float select = u_SelectTexture;
      if(select == 0.0){
        gl_FragColor = u_FragColor;
      } else if(select == 1.0){
        gl_FragColor = texture2D(u_Sampler, v_UV);
      } else if(select == 2.0){
        gl_FragColor = texture2D(u_Sampler1, v_UV);
      } else if(select == 3.0){
        gl_FragColor = texture2D(u_Sampler2, v_UV);
      } else {
        vec4 baseColor = vec4(v_UV, 1.0, 1.0);
        vec4 texColor = texture2D(u_Sampler, v_UV);
        gl_FragColor = (1.0 - select) * baseColor + select * texColor;
      }
   }`;

// Global var
let canvas;
let gl;

let a_Position;
let a_UV;

let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_Sampler;
let u_Sampler1;
let u_Sampler2;

let u_SelectTexture;

let u_ProjectionMatrix;
let u_ViewMatrix;

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  
  gl.enable(gl.DEPTH_TEST);

}

function connectVariablesToGLSL(){

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_SelectTexture = gl.getUniformLocation(gl.program, 'u_SelectTexture');
  if (!u_SelectTexture) {
    console.log('Failed to get the storage location of u_SelectTexture');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if(!u_GlobalRotateMatrix){
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix){
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  if (!u_Sampler) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }
  
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return false;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return false;
  }

  // Get the storage location of u_FragColor
  /*u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }*/

}

let g_globalAngle = 0;

let g_Animiation = true;

let g_camera = undefined;

function addUI(){

  document.getElementById('cameraAngleSlide').addEventListener('mousemove', function() {
    g_globalAngle = this.value;
    renderAllShapes();

  });

  document.getElementById('AnimationOn').onclick = function() {
    {g_Animiation = true};

  };
  document.getElementById('AnimationOff').onclick = function() {
    {g_Animiation = false};

  };
}

function textures(gl) {
  const textures = {};

  textures.sky = loadTexture(gl, "sky.jpg");
  textures.dirt = loadTexture(gl, "coarse_dirt.png");
  textures.bee = loadTexture(gl, "bee.png");

  return textures;
}



function initTextures(gl, n) {
  // Create a texture object
  var texture0 = gl.createTexture(); 
  var texture1 = gl.createTexture();
  var texture2 = gl.createTexture();

  if (!texture0 || !texture1 || !texture2) {
    console.log('Failed to create the texture object');
    return false;
  }

  // Get the storage location of u_Sampler0 and u_Sampler1
  /*var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  var u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler0 || !u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }*/

  // Create the image object
  var image0 = new Image();
  var image1 = new Image();
  var image2 = new Image();
  if (!image0 || !image1 || !image2) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called when image loading is completed
  image0.onload = function(){ loadTexture(gl, n, texture0, u_Sampler, image0, 0); };
  image1.onload = function(){ loadTexture(gl, n, texture1, u_Sampler1, image1, 1); };
  image2.onload = function(){ loadTexture(gl, n, texture2, u_Sampler2, image2, 2); };
  // Tell the browser to load an Image
  image0.src = 'sky.jpg';
  image1.src = 'coarse_dirt.png';
  image2.src = 'bee.png';

  return true;
}
// Specify whether the texture unit is ready to use
var g_texUnit0 = false, g_texUnit1 = false, g_texUnit2 = false;

function loadTexture(gl, n, texture, u_Sampler, image, texUnit) {
  //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);// Flip the image's y-axis
  
  //console.log(image, texUnit);
  // Make the texture unit active
  if (texUnit == 0) {
    gl.activeTexture(gl.TEXTURE0);
    g_texUnit0 = true;
  } 
  else if(texUnit == 1){
    gl.activeTexture(gl.TEXTURE1);
    g_texUnit1 = true;
  }
  else {
    gl.activeTexture(gl.TEXTURE2);
    g_texUnit2 = true;
  }
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);   

  // Set texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the image to texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  
  gl.uniform1i(u_Sampler, texUnit);   // Pass the texure unit to u_Sampler
  
  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);

  //console.log("loadTexture", gl, n, texture, u_Sampler, image, texUnit);

  if (g_texUnit0 && g_texUnit1 && g_texUnit2) {
    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);   // Draw the rectangle
    renderAllShapes();
  }
}

function mouseClick(){
  let lastX = 0;
  let lastY = 0;

  canvas.addEventListener('mousedown', function(ev){
    lastX = ev.ClientX;
    lastY = ev.ClientY;

    renderAllShapes();
  });

  canvas.addEventListener('mousemove', function(ev){
    if(ev.buttons === 1){
      let dx = ev.clientX - lastX;
      let dy = ev.clientY - lastY;

      if(dx > 0){
        console.log("panningRight")
        g_camera.panRight();
      }
      if(dx < 0){
        g_camera.panLeft();
      }

      lastX = ev.clientX;
      lastY = ev.clientY;
    }

    renderAllShapes();

  });
}

let g_walls;

function main() {

  setupWebGL();
  connectVariablesToGLSL();

  addUI();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  g_camera = new Camera();
  console.log("in main Camera", g_camera);

  document.onkeydown = keydown;
  mouseClick();

  initTextures(gl,0);


  g_walls = buildMap();
  //console.log(g_walls);
  // Clear <canvas>
  //gl.clear(gl.COLOR_BUFFER_BIT);

  
  // Register function (event handler) to be called on a mouse press

  /*canvas.onmousedown = function(ev){
    g_undoCount += 1;
    click(ev);
  }
  canvas.onmousemove = function(ev) {
    if(ev.buttons == 1){
      click(ev);
    }
  };*/

  tick();


  renderAllShapes();
}

function keydown(ev){
    if(ev.keyCode == 87){ // keyboard W
      g_camera.moveForward();
      //console.log("player is at ", g_camera.eye.elements, "looking at ", g_camera.at.elements);
      //g_camera.eye.elements[1] += 0.2;
    }
    if(ev.keyCode ==  65){ // keyboard A
      //g_camera.eye.elements[0] -= 0.2;
      g_camera.moveLeft();
    }
    if(ev.keyCode == 83){
      g_camera.moveBackwards();
    }
    if(ev.keyCode == 68){ // keyboard D
      //g_camera.eye.elements[0] += 0.2;
      g_camera.moveRight();
    }
    if(ev.keyCode == 81){ // key Q
      g_camera.panLeft();
    }
    if(ev.keyCode == 69){ // key E
      g_camera.panRight();
    }
    if(ev.keyCode == 80){ // key P (place block)
      placeBlock();
    }
    if(ev.keyCode == 79){ // key O (obliterate block)
      obliterateBlock();
    }
    renderAllShapes();
    console.log(ev.keyCode);
}

function placeBlock(numToAdd = 1){
  let eye_x = g_camera.eye.elements[0]
  let eye_y = g_camera.eye.elements[2]

  let at_x = g_camera.at.elements[0];
  let at_y = g_camera.at.elements[2];

  let direction_x = at_x - eye_x;
  let direction_y = at_y - eye_y;

  // Normalize
  let length = Math.sqrt(direction_x * direction_x + direction_y * direction_y);
  direction_x /= length;
  direction_y /= length;

  let blockToAdd_x = Math.round(eye_x + direction_x * 5);
  let blockToAdd_y = Math.round(eye_y + direction_y * 5);

  //console.log(eye_x, blockToAdd_x);
  if(blockToAdd_x >= 0 && blockToAdd_x < 32){
    g_map[blockToAdd_x][blockToAdd_y] += numToAdd;

    if(g_map[blockToAdd_x][blockToAdd_y] < 0){
      g_map[blockToAdd_x][blockToAdd_y] = 0;
    }
  }
  else{
    console.log("invalid");
  }

  g_walls = buildMap();

  console.log("placing block", g_camera.eye, g_camera.at);
}

function obliterateBlock(){
  placeBlock(-1);

  //g_walls = buildMap();
}

var g_shapesList = [];

/*function click(ev) {

  let [x, y] = convertCoordEventToGL(ev);

  let point;

  if(g_selectedShape == POINT){
    point = new Point();
  }
  else if(g_selectedShape == TRIANGLE){
    point = new Triangle();
  }
  else{
    point = new Circle();

  }

  //let point = new Point();
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.segments = g_circleSegmentNum;
  point.size = g_selectedSize;
  point.undoCount = g_undoCount;
  g_shapesList.push(point);

  renderAllShapes();
}*/

function convertCoordEventToGL(ev){

  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return [x, y];

}

function tick(){
  console.log("tick");
  if(g_Animiation){
    renderAllShapes();
  }
  requestAnimationFrame(tick);
}

//         left
//     ------------
//    |           |
//back|           |
//    |           |
//     ------------
//

let g_map = [
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], 
[ 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], 
[ 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 10, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], 
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], 
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[ 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,],
[ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
];

/*let g_map = [
  [ 1, 0, 0, 1],
  [ 0, 1, 0, 0], 
  [ 0, 0, 1, 0],
  [ 1, 0, 0, 1 ]
];*/

function buildMap(){
  let walls = [];
  for(let x = 0; x < 32; x++){
      for(let z = 0; z < 32; z++){
         //if(g_map[x][z] == 1){
         //     let w = new Cube();
         //     w.matrix.translate(x, 0, z);
         //     w.matrix.scale(0.5, 0.5, 0.5);
         //     walls.push(w); 
         //}

        for(let y = 0; y < g_map[x][z]; y++){
          let w = new Cube();
          w.matrix.translate(x, y, z);
          w.matrix.scale(0.5, 0.5, 0.5);
          walls.push(w); 
        }
      }
   }
   return walls;
}

function drawWalls(walls){
  for(let i = 0; i < walls.length; i++){
    //console.log("waall[i] ", walls[i]);
    walls[i].textureNum = 1.0;
    gl.uniform1i(u_Sampler, 1);
    walls[i].renderfast();
  }
}

let g_PreviousTime = performance.now();

//var g_camera.eye.elements = [0, 0, 3];
//var g_camera.at.elements = [0, 1, 0];
//var g_camera.up.elements = [0, 1, 0];

let g_beeLocation = new Vector3(0, 0, 0);

function renderAllShapes(){

  var startTime = performance.now();

  /*var projMatrix = new Matrix4();
  projMatrix.setPerspective(50, canvas.width/canvas.height, 1, 100);
  //gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMatrix.elements);

  var viewMatrix = new Matrix4();
  viewMatrix.setLookAt(g_camera.eye.elements[0],g_camera.eye.elements[1],g_camera.eye.elements[2],  g_camera.at.elements[0],g_camera.at.elements[1],g_camera.at.elements[2],  g_camera.up.elements[0],g_camera.up.elements[1],g_camera.up.elements[2]); // eye, at, up
  //gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);*/

  g_camera.viewPerspective();

  //console.log(g_camera);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_camera.projectionMatrix.elements);
  gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMatrix.elements);

  //console.log(g_camera.viewMatrix.elements, viewMatrix.elements)

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  
  // body
  var body = new Cube();
  body.color = [0.0, 1.0, 0.0, 1.0];
  var bodyCoordinatesMat = new Matrix4(body.matrix);
  body.textureNum = 1.0;
  gl.uniform1i(u_Sampler, 0);
  body.matrix.scale(0.25, 0.15, 0.15);
  body.render();

  var head = new Cube();
  head.color = [1.0, 1.0, 0.0, 1.0];
  var headCoordinatesMat = new Matrix4(body.matrix);
  head.textureNum = 1.0;
  head.matrix.translate(0.45, 0, 0);
  head.matrix.scale(0.15, 0.15, 0.15);
  gl.uniform1i(u_Sampler, 1);
  head.render();
  
  //return;
  
  var sky = new Cube();
  sky.color = [1.0, 1.0, 1.0, 1.0];
  sky.matrix.scale(1000,1000,1000);
  sky.textureNum = 1.0;
  //gl.uniform1i(u_Sampler, 1);
  //gl.activeTexture(gl.TEXTURE0);
  //gl.bindTexture(gl.TEXTURE_2D, textures.sky);
  gl.uniform1i(u_Sampler, 0);
  sky.render();
  //gl.activeTexture(gl.TEXTURE1);

  //return;
  var floor = new Cube();
  floor.color = [1.0, 1.0, 0.0, 1.0];
  floor.textureNum = 0.0;
  floor.matrix.translate(0, -3, 0);
  floor.matrix.scale(50, 0.1, 50);
  //floor.matrix.translate(-.5, 0, -.5);
  floor.render();

  //return;

  drawWalls(g_walls);

  //return;

  var bee = new Cube();
  bee.color = [1.0, 1.0, 0.0, 1.0];
  bee.textureNum = 3.0;
  bee.matrix.translate(g_beeLocation.elements[0], g_beeLocation.elements[1], g_beeLocation.elements[2]);
  g_beeLocation.elements[1] = 5;
   
  if(g_beeLocation.elements[2] < g_camera.eye.elements[2]){
    g_beeLocation.elements[2] += 0.02;
  }
  else{
    g_beeLocation.elements[2] -= 0.02;
  }

  if(g_beeLocation.elements[0] < g_camera.eye.elements[0]){
    g_beeLocation.elements[0] += 0.02;
  }
  else{
    g_beeLocation.elements[0] -= 0.02;
  }
  //bee.matrix.scale(50, 0.1, 50);
  bee.render();


  var duration = startTime - g_PreviousTime;
  g_PreviousTime = startTime;
  var fps = 1000/duration;

  sendTextToHTML("ms: " + duration.toFixed(2) + " fps: " + fps.toFixed(2) + " eye: " + g_camera.eye.elements[0] + ", " + g_camera.eye.elements[1] + ", " + g_camera.eye.elements[2]);

}

function sendTextToHTML(txt) {
  var output = document.getElementById("fps");
  output.innerHTML = txt;
}
