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
   uniform float u_SelectTexture; // Fix mix texture & color w/ interpolation
   void main() {
      float select = u_SelectTexture;
      if(select == 0.0){
        gl_FragColor = u_FragColor;
      } else if(select == 1.0){
        gl_FragColor = texture2D(u_Sampler, v_UV);
      } else {
        gl_FragColor = vec4(v_UV, 1.0, 1.0);
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

let g_Animiation = false;

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

function initTextures(gl, n) {
  var texture = gl.createTexture();   // Create a texture object
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }
  
  var image = new Image();  // Create the image object
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function(){ loadTexture(gl, n, texture, u_Sampler, image); };
  // Tell the browser to load an image
  image.src = 'sky.jpg';

  return true;
}

function loadTexture(gl, n, texture, u_Sampler, image) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler, 0);
  
  gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

function main() {

  setupWebGL();
  connectVariablesToGLSL();

  addUI();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  g_camera = new Camera();
  console.log("in main Camera", g_camera);

  document.onkeydown = keydown;
  initTextures(gl,0);

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

  renderAllShapes();

  tick();

}

function keydown(ev){
    if(ev.keyCode == 87){ // keyboard W
      //console.log("beforeMoveForward", g_camera.eye.elements, g_camera);
      //g_camera.moveForward();
      //console.log("aftMoveForward", g_camera.eye.elements, g_camera);
      g_camera.eye.elements[1] += 0.2;
    }
    if(ev.keyCode ==  65){ // keyboard A
      g_camera.eye.elements[0] += 0.2;
    }
    if(ev.keyCode == 68){ // keyboard D
      g_camera.eye.elements[0] -= 0.2;
    }

    renderAllShapes();
    console.log(ev.keyCode);
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
  if(g_Animiation){
    renderAllShapes();
  }
  requestAnimationFrame(tick);
}

let g_PreviousTime = performance.now();

//var g_camera.eye.elements = [0, 0, 3];
//var g_camera.at.elements = [0, 1, 0];
//var g_camera.up.elements = [0, 1, 0];

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
  body.matrix.scale(0.25, 0.15, 0.15);
  body.render();

  var head = new Cube();
  head.color = [1.0, 1.0, 0.0, 1.0];
  var headCoordinatesMat = new Matrix4(body.matrix);
  head.textureNum = 0.0;
  head.matrix.translate(0.45, 0, 0);
  head.matrix.scale(0.15, 0.15, 0.15);
  head.render();

  var duration = startTime - g_PreviousTime;
  g_PreviousTime = startTime;
  var fps = 1000/duration;

  sendTextToHTML("ms: " + duration.toFixed(2) + " fps: " + fps.toFixed(2));

}

function sendTextToHTML(txt) {
  var output = document.getElementById("fps");
  output.innerHTML = txt;
}
