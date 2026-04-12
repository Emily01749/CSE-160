// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  //gl_PointSize = 10.0;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

// Global var
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;


function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

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

  // Get the storage location of u_FragColor
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }

}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedShape = POINT;

function addUI(){
  document.getElementById('green').onclick = function(){
    g_selectedColor = [0.0, 1.0, 0.0, 1.0];
  }
  document.getElementById('red').onclick = function(){
    g_selectedColor = [1.0, 0.0, 0.0, 1.0];
  }

  document.getElementById('clear').onclick = function(){
    {g_shapesList = []};
    renderAllShapes();
  }
  
  document.getElementById('point').onclick = function(){
    {g_selectedShape = POINT};
    console.log("this is point button");
  }
  document.getElementById('triangle').onclick = function(){
    {g_selectedShape = TRIANGLE};
    console.log("this is triangle button");
  }
  document.getElementById('circle').onclick = function(){
    {g_selectedShape = CIRCLE};
    console.log("this is circle button");
  }

  document.getElementById('redSlide').addEventListener('mouseup', function() {
    g_selectedColor[0] = this.value/100;
  })
  document.getElementById('greenSlide').addEventListener('mouseup', function() {
    g_selectedColor[1] = this.value/100;
  })
  document.getElementById('blueSlide').addEventListener('mouseup', function() {
    g_selectedColor[2] = this.value/100;
  })

  document.getElementById('sizeSlide').addEventListener('mouseup', function() {
    g_selectedSize = this.value;
  })

  g_selectedColor[0] = document.getElementById('redSlide').value/100;
  g_selectedColor[1] = document.getElementById('greenSlide').value/100;
  g_selectedColor[2] = document.getElementById('blueSlide').value/100;
  g_selectedSize = document.getElementById('sizeSlide').value;
}

function main() {

  setupWebGL();
  connectVariablesToGLSL();

  addUI();

  
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) {
    if(ev.buttons == 1){
      click(ev);
    }
  };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  //let tri = new Triangle();
  //tri.drawTriangle([0,0.5,-0.5,-0.5,0.5,-0.5]);
  //tri.drawTriangle([0, 0.25, 0.25, 0.25, -0.3, 0.5])
}

var g_shapesList = [];

/*var g_points = [];  // The array for the position of a mouse press
var g_colors = [];  // The array to store the color of a point
var g_sizes = [];*/

function click(ev) {

  let [x, y] = convertCoordEventToGL(ev);

  let point;

  if(g_selectedShape == POINT){
    console.log("this is point ", x, y);
    point = new Point();
  }
  else if(g_selectedShape == TRIANGLE){
    console.log("this is triangle ", x, y);
    point = new Triangle();
  }
  else{
    console.log("this is circle", x, y);
    point = new Circle();

  }

  //let point = new Point();
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);

  console.log(g_shapesList);

  // Store the coordinates to g_points array
  /*g_points.push([x, y]);
  g_colors.push(g_selectedColor.slice());
  g_sizes.push(g_selectedSize);*/
  
  // Store the coordinates to g_points array
  /*if (x >= 0.0 && y >= 0.0) {      // First quadrant
    g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  } else if (x < 0.0 && y < 0.0) { // Third quadrant
    g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  } else {                         // Others
    g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  }*/

  renderAllShapes();
}

function convertCoordEventToGL(ev){

  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return [x, y];

}

function renderAllShapes(){
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;

  for(var i = 0; i < len; i++) {
    //console.log("nope");

    g_shapesList[i].render();

  }
  
}
