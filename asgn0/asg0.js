// DrawTriangle.js (c) 2012 matsuda
function main() {  
  // Retrieve <canvas> element
  var canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  var ctx = canvas.getContext('2d');

  // Draw a blue rectangle
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height);        // Fill a rectangle with the color
  
  var v1 = new Vector3();
  v1.elements[0] = 2.25;
  v1.elements[1]= 2.25;
  v1.elements[2]= 0;

  //console.log(v1);

  drawVector(v1, "red");
}

function drawVector(v, color){
  var canvas = document.getElementById('example');
  var ctx = canvas.getContext('2d');
  
  var centerX = canvas.width/2;
  var centerY = canvas.height/2;

  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + v.elements[0] * 20, centerY - v.elements[1] * 20);
  ctx.stroke();
}

function handleDrawEvent(){
  var canvas = document.getElementById('example');
  var ctx = canvas.getContext('2d');

  // clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // redraw the canvas
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Read values of the input x and y of v1
  let v1X = document.getElementById('v1x-name').value;
  let v1Y = document.getElementById('v1y-name').value;

  let v2X = document.getElementById('v2x-name').value;
  let v2Y = document.getElementById('v2y-name').value;
  
  //console.log(v1X);
  //console.log(v1Y);

  // Create v1 and draw the vector
  var v1 = new Vector3();
  v1.elements[0] = v1X;
  v1.elements[1]= v1Y;
  v1.elements[2]= 0;

  drawVector(v1, "red");

  // Create v2 and draw the vector
  var v2 = new Vector3();
  v2.elements[0] = v2X;
  v2.elements[1]= v2Y;
  v2.elements[2]= 0;

  drawVector(v2, "blue");

}