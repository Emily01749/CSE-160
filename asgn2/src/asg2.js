// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  '  gl_PointSize = 10.0;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

// Global var
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

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

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
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

  // Get the storage location of u_FragColor
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }

}

//const POINT = 0;
//const TRIANGLE = 1;
//const CIRCLE = 2;

//let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
//let g_selectedSize = 5;
//let g_circleSegmentNum = 10;
//let g_selectedShape = POINT;
let g_globalAngle = 0;
let g_headAngle = 0;
let g_Animiation = false;

function addUI(){

  /*document.getElementById('clear').onclick = function(){
    {g_shapesList = []};
    renderAllShapes();
  }
  
  document.getElementById('point').onclick = function(){
    {g_selectedShape = POINT};
  }
  document.getElementById('triangle').onclick = function(){
    {g_selectedShape = TRIANGLE};
  }
  document.getElementById('circle').onclick = function(){
    {g_selectedShape = CIRCLE};
  }

  document.getElementById('redSlide').addEventListener('mouseup', function() {
    g_selectedColor[0] = this.value/100;
  });
  document.getElementById('greenSlide').addEventListener('mouseup', function() {
    g_selectedColor[1] = this.value/100;
  });
  document.getElementById('blueSlide').addEventListener('mouseup', function() {
    g_selectedColor[2] = this.value/100;
  });

  document.getElementById('sizeSlide').addEventListener('mouseup', function() {
    g_selectedSize = this.value;
  });

  document.getElementById('cirSegSlide').addEventListener('mouseup', function() {
    g_circleSegmentNum = this.value;
  });

  document.getElementById('opacitySlide').addEventListener('mouseup', function() {
    g_selectedColor[3] = this.value/100;
  });*/

  document.getElementById('headJointSlide').addEventListener('mousemove', function() {
    g_headAngle = this.value;
    renderAllShapes();
  });

  document.getElementById('cameraAngleSlide').addEventListener('mousemove', function() {
    g_globalAngle = this.value;
    renderAllShapes();

  });

  document.getElementById('AnimationOn').onclick = function() {
    {g_Animiation = true};

  };
  document.getElementById('AnimationOff').onclick = function() {
    {g_Animiation = true};

  };



  /*document.getElementById('undo').onclick = function(){
    if(g_shapesList.length > 0){
      var undo = g_shapesList[g_shapesList.length - 1].undoCount;

      while(g_shapesList.length > 0 && g_shapesList[g_shapesList.length - 1].undoCount == undo){
        g_shapesList.pop();
      }

      renderAllShapes();
    }
  };

  g_selectedColor[0] = document.getElementById('redSlide').value/100;
  g_selectedColor[1] = document.getElementById('greenSlide').value/100;
  g_selectedColor[2] = document.getElementById('blueSlide').value/100;
  g_selectedSize = document.getElementById('sizeSlide').value;
  g_circleSegmentNum = document.getElementById('cirSegSlide').value;
  g_selectedColor[3] = document.getElementById('opacitySlide').value/100;*/
}

var g_undoCount = 0;

function main() {

  setupWebGL();
  connectVariablesToGLSL();

  addUI();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  
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
  console.log(performance.now());

  renderAllShapes();

  requestAnimationFrame(tick);
}

let g_PreviousTime = performance.now();

function renderAllShapes(){

  var startTime = performance.now();

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //gl.clear(gl.COLOR_BUFFER_BIT);

  var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  //var len = g_shapesList.length;

  //gl.enable(gl.BLEND);
  //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  //gl.disable(gl.DEPTH_TEST);

  /*for(var i = 0; i < len; i++) {

    g_shapesList[i].render();

  }*/
  var tri = new Triangle();
  //tri.drawTriangle3D([-1.0, 0.0, 0.0, -0.5,-1.0,0.0, 0.0,0.0,0.0]);
  
  // body
  var body = new Cube();
  //body.matrix = headCoordinatesMat;
  body.color = [0.0, 1.0, 0.0, 1.0];
  //body.matrix.translate(-0.5,-0.5, -0.5);
  //body.matrix.rotate(-5,1,0,0);
  //body.matrix.rotate(0, 1, 0, 0);
  //body.matrix.translate(-0.6,-0.4, -0.05);
  var bodyCoordinatesMat = new Matrix4(body.matrix);
  body.matrix.scale(0.25, 0.15, 0.15);
  //body.matrix.scale(3.5, 2, 0);
  //body.matrix.translate(0.01, -0.5, 0);
  body.render();

  // head
  var head = new Cube();
  head.matrix = new Matrix4(bodyCoordinatesMat);
  head.color = [1.0, 0.0, 0.0, 1.0];
  head.matrix.translate(0.25, 0.15 + 0.15/2, 0);
  head.matrix.rotate(0, 1, 0, 0);
  head.matrix.rotate(g_headAngle, 0, 1, 0, 0);
  var headCoordinatesMat = new Matrix4(head.matrix);
  head.matrix.scale(0.15, 0.15, 0.15);
  head.render();

  // one ear
  var ear1 = new Cube();
  ear1.color = [1.0, 1.0, 0.0, 1.0];
  ear1.matrix = new Matrix4(headCoordinatesMat);
  ear1.matrix.translate(0.1,0.20, 0.1); // x = right; y = up;  z = into screen
  //ear1.matrix.rotate(-5, 1, 0, 0);
  ear1.matrix.scale(0.05, 0.05, 0.05);
  ear1.render();

  // 2nd ear
  var ear2 = new Cube();
  ear2.color = [1.0, 1.0, 1.0, 1.0];
  ear2.matrix = new Matrix4(headCoordinatesMat);
  ear2.matrix.translate(0.1,0.2, -0.1); // x = right; y = up;  z = into screen
  //ear2.matrix.rotate(-5, 1, 0, 0);
  ear2.matrix.scale(0.05, 0.05, 0.05);
  ear2.render();

  //nose/snout
  var nose = new Cube();
  nose.matrix = new Matrix4(headCoordinatesMat);
  nose.color = [1.0, 0.0, 1.0, 1.0];
  nose.matrix.translate(0.15, -0.05, 0); // x = right; y = up;  z = into screen
  //nose.matrix.rotate(-5, 1, 0, 0);
  nose.matrix.scale(0.3, 0.1, 0.1);
  nose.render();

  // leg front 1
  var frontLeg1 = new Cube();
  frontLeg1.color = [0.0, 0.0, 1.0, 1.0];
  frontLeg1.matrix = new Matrix4(bodyCoordinatesMat);
  //frontLeg1.matrix.translate(-0.6,-0.4, -0.05);
  //frontLeg1.matrix.rotate(-5,1,0,0);
  //frontLeg1.matrix.rotate(0, 1, 0, 0);
  frontLeg1.matrix.translate(0.15, -0.15, -0.13);
  frontLeg1.matrix.scale(0.05, 0.15, 0.05);
  //var bodyCoordinatesMat = new Matrix4(body.matrix);
  //frontLeg1.matrix.scale(3.5, 2, 0);
  //frontLeg1.matrix.translate(0.01, -0.5, 0);
  frontLeg1.render();

  // leg front 2
  var frontLeg2 = new Cube();
  frontLeg2.color = [0.0, 0.0, 1.0, 1.0];
  frontLeg2.matrix = new Matrix4(bodyCoordinatesMat);
  //frontLeg2.matrix.translate(-0.6,-0.4, -0.05);
  //frontLeg2.matrix.rotate(-5,1,0,0);
  //frontLeg2.matrix.rotate(0, 1, 0, 0);
  frontLeg2.matrix.translate(0.15, -0.15, 0.13);
  frontLeg2.matrix.scale(0.05, 0.15, 0.05);
  //var bodyCoordinatesMat = new Matrix4(body.matrix);
  //frontLeg2.matrix.scale(3.5, 2, 0);
  //frontLeg2.matrix.translate(0.01, -0.5, 0);
  frontLeg2.render();

  // leg back 1
  var backLeg1 = new Cube();
  backLeg1.color = [0.0, 0.0, 1.0, 1.0];
  backLeg1.matrix = new Matrix4(bodyCoordinatesMat);
  //backLeg1.matrix.translate(-0.6,-0.4, -0.05);
  //backLeg1.matrix.rotate(-5,1,0,0);
  //frontLeg1.matrix.rotate(0, 1, 0, 0);
  backLeg1.matrix.translate(-0.15, -0.15, -0.13);
  backLeg1.matrix.scale(0.05, 0.15, 0.05);
  //var bodyCoordinatesMat = new Matrix4(body.matrix);
  //backLeg1.matrix.scale(3.5, 2, 0);
  //backLeg1.matrix.translate(0.01, -0.5, 0);
  backLeg1.render();

  // leg front 2
  var backLeg2 = new Cube();
  backLeg2.color = [0.0, 0.0, 1.0, 1.0];
  backLeg2.matrix = new Matrix4(bodyCoordinatesMat);
  //backLeg2.matrix.translate(-0.6,-0.4, -0.05);
  //backLeg2.matrix.rotate(-5,1,0,0);
  //backLeg2.matrix.rotate(0, 1, 0, 0);
  backLeg2.matrix.translate(-0.15, -0.15, 0.13);
  backLeg2.matrix.scale(0.05, 0.15, 0.05);
  //var bodyCoordinatesMat = new Matrix4(body.matrix);
  //backLeg2.matrix.scale(3.5, 2, 0);
  //backLeg2.matrix.translate(0.01, -0.5, 0);
  backLeg2.render();

  // tail
  var tail = new Cube();
  tail.color = [0.0, 0.0, 1.0, 1.0];
  tail.matrix = new Matrix4(bodyCoordinatesMat);
  //tail.matrix.translate(-0.6,-0.4, -0.05);
  //tail.matrix.rotate(-5,1,0,0);
  //tail.matrix.rotate(0, 1, 0, 0);
  tail.matrix.translate(-0.25, 0.15, 0);  // x = right; y = up;  z = into screen
  tail.matrix.scale(0.05, 0.05, 0.05);
  //var bodyCoordinatesMat = new Matrix4(body.matrix);
  //tail.matrix.scale(3.5, 2, 0);
  //tail.matrix.translate(0.01, -0.5, 0);
  tail.render();

  var cloneTailCube = new Matrix4(tail.matrix);

  for(var i = 0; i < 10; i++){
    var tailCubePiece = new Cube();
    
  }

  /*var leftArm = new Cube();
  leftArm.color = [1,1,0,1];
  leftArm.matrix.setTranslate(0, -0.5, 0.0);
  leftArm.matrix.rotate(-5,1,0,0);
  //leftArm.matrix.rotate(0,0,0,1);
  leftArm.matrix.scale(0.25, 0.7, 0.5);
  //leftArm.matrix.translate(-0.5,-0, 0);
  leftArm.render();*/

  /*var box = new Cube();
  box.color = [1,0,1,1];
  box.matrix.translate(-0.1, 0.2, 0.0, 0);
  box.matrix.rotate(-30,1,0,0);
  box.matrix.scale(0.2, 0.4, 0.2);
  box.render();*/

  console.log(startTime);

  var duration = startTime - g_PreviousTime;
  g_PreviousTime = startTime;
  var fps = 1000/duration;

  sendTextToHTML("ms: " + duration.toFixed(2) + " fps: " + fps.toFixed(2));

}

function sendTextToHTML(txt) {
  var output = document.getElementById("fps");
  output.innerHTML = txt;
}
