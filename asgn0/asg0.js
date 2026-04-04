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
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill a rectangle with the color
  
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

  // Read values of the input x and y of v2
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

function handleDrawOperationEvent(){
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

  // Read values of the input x and y of v2
  let v2X = document.getElementById('v2x-name').value;
  let v2Y = document.getElementById('v2y-name').value;

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

  var optSelect = document.getElementById('operation')
  //console.log(optSelect.value);
  var scal = document.getElementById('scalar-num').value;
  //console.log(scal);

  // Create v3 and draw the vector
  var v3 = new Vector3();

  if(optSelect.value == 'Add'){
    v3 = v1.add(v2);
    //console.log(v3);

    drawVector(v3, "green");
  }
  if(optSelect.value == 'Subtract'){
    v3 = v1.sub(v2);
    //console.log(v3);

    drawVector(v3, "green");
  }

  // Create v4
  var v4 = new Vector3();

  if(optSelect.value == 'Multiply'){
    v3 = v1.mul(scal);
    //console.log(v3);

    drawVector(v3, "green");

    v4 = v2.mul(scal);
    //console.log(v4);

    drawVector(v4, "green");

  }

  if(optSelect.value == 'Divide'){
    v3 = v1.div(scal);
    //console.log(v3);

    drawVector(v3, "green");

    v4 = v2.div(scal);
    //console.log(v4);

    drawVector(v4, "green");

  }
  if(optSelect.value == "Magnitude"){
    console.log("Magnitude v1: " + v1.magnitude());
    console.log("Magnitude v2: " + v2.magnitude());
  }
  if(optSelect.value == "Normalize"){
    v1 = v1.normalize();
    v2 = v2.normalize();

    drawVector(v1, "green");
    drawVector(v2, "green");
  }
  if(optSelect.value == "AngleBetween"){
    //console.log("Dot: " + Vector3.dot(v1, v2));
    console.log("Angle: " + angleBetween(v1, v2));
  }
  if(optSelect.value == "Area"){
    console.log("Area of the triangle: ", areaTriangle(v1, v2));
  }

}

function angleBetween(v1,v2){
  var dotprd = Vector3.dot(v1,v2);
  //console.log("Dotdotprd: " + dotprd);
  var mag = v1.magnitude() * v2.magnitude();
  //console.log("Mag: " + mag);
  var theta = Math.acos(dotprd / mag);
  //console.log("Theta: " + theta);

  var thetaInDegrees = theta * (180/Math.PI);

  return thetaInDegrees;
}

function areaTriangle(v1, v2){
  let crossProd = Vector3.cross(v1, v2);
  //console.log("Cross: ", crossProd);
  return crossProd.magnitude() / 2;
}