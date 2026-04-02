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