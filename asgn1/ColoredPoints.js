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
let g_circleSegmentNum = 10;
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

  document.getElementById('cirSegSlide').addEventListener('mouseup', function() {
    g_circleSegmentNum = this.value;
  })

  document.getElementById('opacitySlide').addEventListener('mouseup', function() {
    g_selectedColor[3] = this.value/100;
  })
  
  document.getElementById('art').addEventListener('mouseup', function() {
    console.log("art button");

    let t;
    let scale = 1500;
    let drawingPts = [
      [[1292, 1116], [907, 775], [1677, 759], [1.0, 1.0, 1.0, 1.0]], // head
      [[907, 780], [1105, 401], [1237, 773], [1.0, 1.0, 1.0, 1.0]], // left ear
      [[1424, 759], [1677, 759], [1589, 390], [1.0, 1.0, 1.0, 1.0]], // right ear
      [[1133, 995], [1375, 1320], [1287, 1116], [1.0, 1.0, 1.0, 1.0]], // left neck
      [[1298, 1325], [1567, 1105], [1430, 968], [1.0, 1.0, 1.0, 1.0]], // right neck
      [[1567, 1105], [2018, 1655], [1276, 1342], [1.0, 1.0, 1.0, 1.0]], // body
      [[1270, 1331], [1446, 1545], [1276, 1771], [1.0, 1.0, 1.0, 1.0]], // front leg (back)
      [[1578, 1463], [1688, 1540], [1496, 1776], [1.0, 1.0, 1.0, 1.0]], // front leg (front)
      [[2018, 1650], [1727, 2205], [2233, 1622], [1.0, 1.0, 1.0, 1.0]], // Tail 1 or back leg
      [[1259, 1754], [891, 1457], [896, 1881], [1.0, 1.0, 1.0, 1.0]], // Tail 2 (first part)
      [[891, 1457], [302, 1996], [885, 1908], [1.0, 1.0, 1.0, 1.0]], // Tail 2 (2nd part)
      [[1771, 1408], [1859, 1325], [1875, 1435], [1.0, 0.5, 1.0, 1.0]], // "E" (1)
      [[1875, 1325], [1974, 1380], [1870, 1424], [1.0, 0.5, 1.0, 1.0]], // "E" (2)
      [[1864, 1325], [1969, 1380], [1864, 1325], [1.0, 0.5, 1.0, 1.0]], // "E" (3)
      [[1870, 1331], [1974, 1237], [1853, 1215], [1.0, 0.5, 1.0, 1.0]], // "E" (4)
      [[1859, 1204], [1853, 1111], [1969, 1171], [1.0, 0.5, 1.0, 1.0]], // "E" (5)
      [[1980, 1402], [2084, 1325], [2101, 1408], [0.5, 1.0, 1.0, 1.0]], // "M" (1)
      [[2101, 1320], [2183, 1182], [2189, 1325], [0.5, 1.0, 1.0, 1.0]], // "M" (2)
      [[2189, 1204], [2183, 1325], [2304, 1320], [0.5, 1.0, 1.0, 1.0]], // "M" (3)
      [[2233, 1325], [2304, 1314], [2326, 1419], [0.5, 1.0, 1.0, 1.0]], // "M" (4)
      [[2348, 1309], [2409, 1210], [2442, 1314], [0.5, 1.0, 1.0, 1.0]], // "M" (5)
      [[2343, 1336], [2442, 1446], [2442, 1320], [0.5, 1.0, 1.0, 1.0]], // "M" (6)
    ]

    let offsetX = -1;

    for(let i = 0; i < drawingPts.length; i++){
      let smth = drawingPts[i];
      let p1 = [smth[0][0]/scale + offsetX, 1 - smth[0][1]/scale];
      let p2 = [smth[1][0]/scale + offsetX, 1 - smth[1][1]/scale];
      let p3 = [smth[2][0]/scale + offsetX, 1 - smth[2][1]/scale];
      t = new ModifiedTriangle(p1, p2, p3, smth[3]);
      g_shapesList.push(t);
    }
    //t = new ModifiedTriangle([0,0], [0.25, 0.25], [-0.25, 0.25], [1.0, 1.0, 1.0, 1.0]); g_shapesList.push(t);
    
    //t = new ModifiedTriangle([-0.25, 0.25], [0.85, 0.25], [1, 0.25], [1.0, 1.0, 1.0, 1.0]); g_shapesList.push(t);

    console.log(g_shapesList);

    renderAllShapes();


  })

  g_selectedColor[0] = document.getElementById('redSlide').value/100;
  g_selectedColor[1] = document.getElementById('greenSlide').value/100;
  g_selectedColor[2] = document.getElementById('blueSlide').value/100;
  g_selectedSize = document.getElementById('sizeSlide').value;
  g_circleSegmentNum = document.getElementById('cirSegSlide').value;
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
  point.segments = g_circleSegmentNum;
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

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.disable(gl.DEPTH_TEST);

  for(var i = 0; i < len; i++) {
    //console.log("nope");

    g_shapesList[i].render();

  }
  
}
